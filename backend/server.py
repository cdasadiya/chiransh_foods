"""Mock of the original Chiransh Foods FastAPI backend (Emergent apps use FastAPI + MongoDB).

Endpoints reproduced (captured from the live preview on 2026-10-02):
  GET  /api/                 -> {"message": "Chiransh Foods API", "status": "ok"}
  GET  /api/health           -> {"status": "ok"}
  GET  /api/products         -> list of products (data/products.json, sorted by sort_order)
  GET  /api/products/{slug}  -> single product, 404 {"detail": "Product not found"} otherwise
  GET  /api/settings         -> site settings (data/settings.json)
  POST /api/enquiries        -> validates and appends to data/enquiries.json (instead of MongoDB)

Run:  uvicorn server:app --port 8001
"""
import base64
import hashlib
import json
import os
import re
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Any, Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, BeforeValidator, Field, field_validator

DATA = Path(__file__).parent / "data"
# Keep these aligned with frontend/src/lib/enquiry.js and SECURITY.md.
POLICY_VERSION = "2026-10-11"
ENQUIRY_AAD = b"chiransh-enquiries-v1"
_warned_plaintext = False


class EnquiryStoreError(Exception):
    pass


def _require_consent(value: Any) -> bool:
    if value is not True:
        raise ValueError("Please agree to the privacy notice before sending.")
    return True


def enquiries_path() -> Path:
    override = os.environ.get("ENQUIRIES_PATH", "").strip()
    return Path(override) if override else DATA / "enquiries.json"


def _storage_key():
    raw = os.environ.get("ENQUIRY_STORAGE_KEY", "")
    if not raw.strip():
        return None
    return hashlib.sha256(raw.encode("utf-8")).digest()


def seal_enquiries(plaintext: str, key: bytes, iv: Optional[bytes] = None) -> dict:
    nonce = iv if iv is not None else os.urandom(12)
    blob = AESGCM(key).encrypt(nonce, plaintext.encode("utf-8"), ENQUIRY_AAD)
    return {
        "v": 1,
        "alg": "aes-256-gcm",
        "iv": base64.b64encode(nonce).decode("ascii"),
        "tag": base64.b64encode(blob[-16:]).decode("ascii"),
        "data": base64.b64encode(blob[:-16]).decode("ascii"),
    }


def open_enquiries(envelope: dict, key: bytes) -> str:
    try:
        iv = base64.b64decode(envelope["iv"])
        tag = base64.b64decode(envelope["tag"])
        data = base64.b64decode(envelope["data"])
        plain = AESGCM(key).decrypt(iv, data + tag, ENQUIRY_AAD)
        return plain.decode("utf-8")
    except Exception as exc:
        raise EnquiryStoreError("decrypt failed") from exc


# Each enquiry write erases records older than 90 days.
# That step is commented out and does not run:
#
# RETENTION_DAYS = 90
#
# def prune_enquiries(items, now=None):
#     moment = now or datetime.now(timezone.utc)
#     cutoff = moment - timedelta(days=RETENTION_DAYS)
#     kept = []
#     for item in items if isinstance(items, list) else []:
#         if not isinstance(item, dict):
#             continue
#         raw = item.get("created_at")
#         try:
#             stamp = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
#         except (TypeError, ValueError):
#             continue
#         if stamp.tzinfo is None:
#             stamp = stamp.replace(tzinfo=timezone.utc)
#         if stamp >= cutoff:
#             kept.append(item)
#     return kept


def read_enquiries():
    path = enquiries_path()
    if not path.exists():
        return []
    raw = path.read_text(encoding="utf-8")
    if not raw.strip():
        return []
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise EnquiryStoreError("unreadable") from exc
    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict) and parsed.get("alg") == "aes-256-gcm":
        key = _storage_key()
        if key is None:
            raise EnquiryStoreError("encrypted without key")
        decoded = json.loads(open_enquiries(parsed, key))
        if not isinstance(decoded, list):
            raise EnquiryStoreError("unexpected payload")
        return decoded
    raise EnquiryStoreError("unexpected payload")


def write_enquiries(records):
    global _warned_plaintext
    path = enquiries_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    key = _storage_key()
    if key is None:
        if not _warned_plaintext:
            _warned_plaintext = True
            print(json.dumps({"event": "enquiry_store", "mode": "plaintext", "reason": "ENQUIRY_STORAGE_KEY unset"}))
        payload = json.dumps(records, ensure_ascii=False, indent=2)
    else:
        payload = json.dumps(seal_enquiries(json.dumps(records, ensure_ascii=False, separators=(",", ":")), key))
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(payload, encoding="utf-8")
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass


def load(name, default):
    p = DATA / name
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else default


app = FastAPI(title="Chiransh Foods API (local mock)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


RATE_WINDOW = 10 * 60
RATE_MAX = 5
_rate_hits: dict[str, list[float]] = {}


def reset_rate_limits():
    _rate_hits.clear()


def allow_rate(ip: str) -> bool:
    now = time.time()
    bucket = [stamp for stamp in _rate_hits.get(ip, []) if now - stamp < RATE_WINDOW]
    if len(bucket) >= RATE_MAX:
        _rate_hits[ip] = bucket
        return False
    bucket.append(now)
    _rate_hits[ip] = bucket
    return True


class EnquiryIn(BaseModel):
    name: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=20)
    email: Optional[str] = Field(None, max_length=200)
    product_interest: Optional[str] = Field("General enquiry", max_length=120)
    message: Optional[str] = Field("", max_length=2000)
    website: Optional[str] = None
    company: Optional[str] = None
    consent: Annotated[bool, BeforeValidator(_require_consent)]
    locale: Optional[str] = None

    @field_validator("name")
    @classmethod
    def _name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("Please enter your name.")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def _phone(cls, v):
        v = v.strip()
        if not re.fullmatch(r"[0-9+()\-\s]{7,20}", v) or len(re.sub(r"\D", "", v)) < 7:
            raise ValueError("Please enter a valid phone number.")
        return v

    @field_validator("email")
    @classmethod
    def _email(cls, v):
        if v and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", v.strip()):
            raise ValueError("Please enter a valid email address.")
        return v.strip() if v else None


@app.get("/api/")
def root():
    return {"message": "Chiransh Foods API", "status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/products")
def products():
    return sorted(load("products.json", []), key=lambda p: p.get("sort_order", 0))


@app.get("/api/products/{slug}")
def product(slug: str):
    for p in load("products.json", []):
        if p["slug"] == slug:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


@app.get("/api/settings")
def settings():
    return load("settings.json", {})


@app.post("/api/enquiries", status_code=201)
def create_enquiry(body: EnquiryIn, request: Request):
    if (body.website or "").strip() or (body.company or "").strip():
        raise HTTPException(status_code=422, detail="Unable to accept this enquiry.")
    ip = request.client.host if request.client else "unknown"
    if not allow_rate(ip):
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again later.")
    payload = body.model_dump(exclude={"website", "company", "locale"})
    now = datetime.now(timezone.utc).isoformat()
    rec = {
        "id": str(uuid.uuid4()),
        **payload,
        "locale": "gu" if body.locale == "gu" else "en",
        "policy_version": POLICY_VERSION,
        "consent_at": now,
        "created_at": now,
    }
    try:
        # Each enquiry write erases records older than 90 days.
        # That step is commented out and does not run:
        # items = prune_enquiries(read_enquiries())
        items = read_enquiries()
        items.append(rec)
        write_enquiries(items)
    except EnquiryStoreError:
        raise HTTPException(status_code=500, detail="Enquiry storage is unavailable")
    print(json.dumps({"event": "enquiry", "id": rec["id"], "at": rec["created_at"], "product": rec["product_interest"]}))
    return rec
