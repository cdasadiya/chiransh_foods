import pytest
import json
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

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

def test_create_enquiry_success():
    payload = {
        "name": "Test User",
        "phone": "9876543210",
        "email": "test@example.com",
        "product_interest": "General enquiry",
        "message": "This is a test message"
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert "id" in data

def test_create_enquiry_invalid_name():
    payload = {
        "name": " ",
        "phone": "9876543210"
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422

def test_create_enquiry_invalid_phone():
    payload = {
        "name": "Test User",
        "phone": "123"
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422

def test_create_enquiry_invalid_email():
    payload = {
        "name": "Test User",
        "phone": "9876543210",
        "email": "not-an-email"
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 422
