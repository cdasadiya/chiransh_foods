import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import en from "../locales/en/translation.json";
import gu from "../locales/gu/translation.json";
import { POLICY_VERSION, RETENTION_DAYS, validateEnquiry } from "./enquiry";
import { sealEnquiries } from "./enquiryStore";

const consented = { consent: true };

describe("validateEnquiry", () => {
  it("accepts a normal enquiry", () => {
    const result = validateEnquiry({
      name: "Asha Patel",
      phone: "+91 91063 54619",
      message: "નમસ્તે",
      locale: "gu",
      ...consented,
    });
    expect(result.errors).toEqual([]);
    expect(result.value.name).toBe("Asha Patel");
    expect(result.value.consent).toBe(true);
    expect(result.value.locale).toBe("gu");
  });

  it("rejects a filled honeypot", () => {
    const result = validateEnquiry({ name: "Asha Patel", phone: "9106354619", website: "spam", ...consented });
    expect(result.honeypot).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects a short phone and an oversized message", () => {
    const result = validateEnquiry({ name: "Asha", phone: "123", message: "x".repeat(2001), ...consented });
    expect(result.errors.map((error) => error.loc[1])).toEqual(["phone", "message"]);
  });

  it("rejects consent that is missing or not strictly true", () => {
    for (const consent of [undefined, false, "true", 1]) {
      const result = validateEnquiry({ name: "Asha Patel", phone: "9106354619", consent });
      expect(result.errors.map((error) => error.loc[1])).toContain("consent");
      expect(result.value.consent).toBe(false);
    }
  });

  it("defaults an unknown locale to English", () => {
    const result = validateEnquiry({ name: "Asha Patel", phone: "9106354619", locale: "fr", ...consented });
    expect(result.value.locale).toBe("en");
  });
});

describe("enquiry cipher", () => {
  it("matches the AES-256-GCM envelope used by the local API", () => {
    const key = createHash("sha256").update("cross-check-key", "utf8").digest();
    const envelope = sealEnquiries('[{"id":"1","name":"Asha"}]', key, Buffer.alloc(12, 0x0b));
    expect(envelope).toEqual({
      v: 1,
      alg: "aes-256-gcm",
      iv: "CwsLCwsLCwsLCwsL",
      tag: "jEeZx9v6eFQYaotk+Z/G2g==",
      data: "MSsmX5khXZKuBRqQApROWn/IgxPIBA44sB4=",
    });
  });
});

describe("privacy notice", () => {
  it("publishes the same version, retention, and host in English and Gujarati", () => {
    for (const copy of [en.legal.privacy, gu.legal.privacy]) {
      const text = JSON.stringify(copy);
      expect(text).toContain(POLICY_VERSION);
      expect(text).toContain(String(RETENTION_DAYS));
      expect(text).toContain("Render");
    }
    expect(JSON.stringify(en.legal.privacy)).toContain("Data Protection Board");
    expect(JSON.stringify(gu.legal.privacy)).toContain("ડેટા પ્રોટેક્શન બોર્ડ");
    expect(JSON.stringify(en.legal.terms)).toContain("Digital Personal Data Protection Act, 2023");
    expect(JSON.stringify(gu.legal.terms)).toContain("2023");
  });
});
