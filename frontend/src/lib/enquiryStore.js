import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const AAD = Buffer.from("chiransh-enquiries-v1", "utf8");
let warnedPlaintext = false;

function storageKey() {
  const raw = process.env.ENQUIRY_STORAGE_KEY;
  if (!raw || !raw.trim()) return null;
  return createHash("sha256").update(raw, "utf8").digest();
}

function unavailable(message = "Enquiry storage is unavailable") {
  return Object.assign(new Error(message), { status: 500 });
}

/** AES-256-GCM envelope. `iv` is optional so tests can lock the byte format. */
export function sealEnquiries(plaintext, key, iv = randomBytes(12)) {
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(AAD);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return {
    v: 1,
    alg: "aes-256-gcm",
    iv: Buffer.from(iv).toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

export function openEnquiries(envelope, key) {
  try {
    const iv = Buffer.from(envelope.iv, "base64");
    const tag = Buffer.from(envelope.tag, "base64");
    const data = Buffer.from(envelope.data, "base64");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    throw unavailable();
  }
}

export function readEnquiries(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  if (!raw.trim()) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw unavailable();
  }
  if (Array.isArray(parsed)) return parsed;
  if (parsed && parsed.alg === "aes-256-gcm") {
    const key = storageKey();
    if (!key) throw unavailable();
    const decoded = JSON.parse(openEnquiries(parsed, key));
    if (!Array.isArray(decoded)) throw unavailable();
    return decoded;
  }
  throw unavailable();
}

export function writeEnquiries(file, records) {
  const key = storageKey();
  let payload;
  if (!key) {
    if (!warnedPlaintext) {
      warnedPlaintext = true;
      console.warn(JSON.stringify({ event: "enquiry_store", mode: "plaintext", reason: "ENQUIRY_STORAGE_KEY unset" }));
    }
    payload = JSON.stringify(records, null, 2);
  } else {
    payload = JSON.stringify(sealEnquiries(JSON.stringify(records), key));
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, payload, { encoding: "utf8", mode: 0o600 });
  fs.renameSync(tmp, file);
  try {
    fs.chmodSync(file, 0o600);
  } catch {
    // The host may not allow a mode change. The secret, when set, still encrypts the bytes.
  }
}
