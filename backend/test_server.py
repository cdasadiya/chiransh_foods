import json
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from server import POLICY_VERSION, app, read_enquiries, reset_rate_limits

client = TestClient(app)


@pytest.fixture(autouse=True)
def _clear_rate_limits():
    reset_rate_limits()
    yield
    reset_rate_limits()


@pytest.fixture
def enquiries_file(tmp_path, monkeypatch):
    path = tmp_path / "enquiries.json"
    monkeypatch.setenv("ENQUIRIES_PATH", str(path))
    monkeypatch.delenv("ENQUIRY_STORAGE_KEY", raising=False)
    return path

def test_root():
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chiransh Foods API", "status": "ok"}

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "slug" in data[0]

def test_get_product_by_slug():
    response = client.get("/api/products")
    products = response.json()
    if products:
        slug = products[0]["slug"]
        response = client.get(f"/api/products/{slug}")
        assert response.status_code == 200
        assert response.json()["slug"] == slug

def test_get_product_not_found():
    response = client.get("/api/products/non-existent-product-12345")
    assert response.status_code == 404

def test_get_settings():
    response = client.get("/api/settings")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_create_enquiry_success(enquiries_file):
    payload = {
        "name": "Test User",
        "phone": "9876543210",
        "email": "test@example.com",
        "product_interest": "General enquiry",
        "message": "This is a test message",
        "consent": True,
        "locale": "en",
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["policy_version"] == POLICY_VERSION
    assert data["consent"] is True
    assert data["locale"] == "en"
    assert data["consent_at"] == data["created_at"]
    assert "id" in data
    stored = json.loads(enquiries_file.read_text(encoding="utf-8"))
    assert stored[0]["id"] == data["id"]
    assert "website" not in stored[0]


def test_create_enquiry_requires_true_consent(enquiries_file):
    base = {"name": "Test User", "phone": "9876543210"}
    missing = client.post("/api/enquiries", json=base)
    assert missing.status_code == 422
    as_string = client.post("/api/enquiries", json={**base, "consent": "true"})
    assert as_string.status_code == 422
    assert enquiries_file.exists() is False


def test_create_enquiry_prunes_and_encrypts(enquiries_file, monkeypatch):
    monkeypatch.setenv("ENQUIRY_STORAGE_KEY", "test-key")
    now = datetime.now(timezone.utc)
    enquiries_file.write_text(
        json.dumps(
            [
                {
                    "id": "old",
                    "name": "Old Person",
                    "phone": "9000000001",
                    "created_at": (now - timedelta(days=91)).isoformat(),
                },
                {
                    "id": "recent",
                    "name": "Recent Person",
                    "phone": "9000000002",
                    "created_at": (now - timedelta(days=10)).isoformat(),
                },
            ]
        ),
        encoding="utf-8",
    )
    response = client.post(
        "/api/enquiries",
        json={"name": "Test User", "phone": "9876543210", "consent": True, "locale": "gu"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["locale"] == "gu"
    assert body["policy_version"] == POLICY_VERSION
    raw = enquiries_file.read_text(encoding="utf-8")
    assert "Test User" not in raw
    assert "Old Person" not in raw
    assert json.loads(raw)["alg"] == "aes-256-gcm"
    stored = read_enquiries()
    assert sorted(item["name"] for item in stored) == ["Recent Person", "Test User"]


def test_encrypted_store_without_key_is_not_overwritten(enquiries_file, monkeypatch):
    monkeypatch.setenv("ENQUIRY_STORAGE_KEY", "test-key")
    from server import write_enquiries

    write_enquiries(
        [
            {
                "id": "1",
                "name": "Secret Person",
                "phone": "9000000003",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]
    )
    encrypted = enquiries_file.read_text(encoding="utf-8")
    monkeypatch.delenv("ENQUIRY_STORAGE_KEY")
    response = client.post(
        "/api/enquiries",
        json={"name": "Test User", "phone": "9876543210", "consent": True},
    )
    assert response.status_code == 500
    assert enquiries_file.read_text(encoding="utf-8") == encrypted
    assert "Secret Person" not in encrypted

def test_create_enquiry_invalid_name(enquiries_file):
    payload = {
        "name": " ",
        "phone": "9876543210",
        "consent": True,
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422

def test_create_enquiry_invalid_phone(enquiries_file):
    payload = {
        "name": "Test User",
        "phone": "123",
        "consent": True,
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422

def test_create_enquiry_honeypot(enquiries_file):
    payload = {
        "name": "Test User",
        "phone": "9876543210",
        "website": "https://spam.example",
        "consent": True,
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422


def test_enquiry_cipher_matches_the_published_format():
    import hashlib

    from server import seal_enquiries

    key = hashlib.sha256(b"cross-check-key").digest()
    envelope = seal_enquiries('[{"id":"1","name":"Asha"}]', key, bytes([0x0B] * 12))
    assert envelope == {
        "v": 1,
        "alg": "aes-256-gcm",
        "iv": "CwsLCwsLCwsLCwsL",
        "tag": "jEeZx9v6eFQYaotk+Z/G2g==",
        "data": "MSsmX5khXZKuBRqQApROWn/IgxPIBA44sB4=",
    }


def test_create_enquiry_invalid_email(enquiries_file):
    payload = {
        "name": "Test User",
        "phone": "9876543210",
        "email": "not-an-email",
        "consent": True,
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422
