"""Mock of the original Chiransh Foods FastAPI backend (Emergent apps use FastAPI + MongoDB).

Endpoints reproduced (captured from the live preview on 2026-10-02):
  GET  /api/                 -> {"message": "Chiransh Foods API", "status": "ok"}
  GET  /api/health           -> {"status": "ok"}
  GET  /api/products         -> list of products (data/products.json, sorted by sort_order)
  GET  /api/products/{slug}  -> single product, 404 {"detail": "Product not found"} otherwise
  GET  /api/settings         -> site settings (data/settings.json)
  POST /api/enquiries        -> validates and appends to data/enquiries.json (instead of MongoDB)

Run:  uvicorn server:app --port 8001 --reload
"""
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

DATA = Path(__file__).parent / "data"


def load(name, default):
    p = DATA / name
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else default


app = FastAPI(title="Chiransh Foods API (local mock)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class EnquiryIn(BaseModel):
    name: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=20)
    email: Optional[str] = Field(None, max_length=200)
    product_interest: Optional[str] = Field("General enquiry", max_length=120)
    message: Optional[str] = Field("", max_length=2000)

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
def create_enquiry(body: EnquiryIn):
    rec = {
        "id": str(uuid.uuid4()),
        **body.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    items = load("enquiries.json", [])
    items.append(rec)
    (DATA / "enquiries.json").write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    return rec
