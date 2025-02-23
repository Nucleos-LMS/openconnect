import pytest
import time
from typing import Literal
from httpx import AsyncClient
from app.main import app

def test_registration_start(client):
    response = client.post("/api/registration/start", json={
        "userType": "family",
        "email": f"test_{int(time.time() * 1000)}@example.com"
    })
    print(f"Response: {response.status_code} - {response.json()}")  # Debug logging
    assert response.status_code == 200
    data = response.json()
    assert "registrationId" in data
    assert "verificationToken" in data
    assert "expiresAt" in data

def test_verify_email(client):
    # First start registration
    start_response = client.post("/api/registration/start", json={
        "userType": "family",
        "email": f"test_{int(time.time() * 1000)}@example.com"
    })
    start_data = start_response.json()
    
    # Then verify email
    response = client.post("/api/registration/verify-email", json={
        "registrationId": start_data["registrationId"],
        "verificationToken": start_data["verificationToken"]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verified"] is True
    assert "nextStep" in data

def test_personal_info(client):
    # First start registration
    start_response = client.post("/api/registration/start", json={
        "userType": "family",
        "email": f"test_{int(time.time() * 1000)}@example.com"
    })
    registration_id = start_response.json()["registrationId"]

    response = client.post("/api/registration/personal-info", json={
        "registrationId": registration_id,
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01T00:00:00Z",
        "phone": "+1234567890",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "12345"
        }
    })
    assert response.status_code == 200

def test_verify_identity(client):
    # First start registration
    start_response = client.post("/api/registration/start", json={
        "userType": "family",
        "email": f"test_{int(time.time() * 1000)}@example.com"
    })
    registration_id = start_response.json()["registrationId"]

    response = client.post("/api/registration/verify-identity", json={
        "registrationId": registration_id,
        "verificationType": "drivers_license",
        "documentNumber": "DL123456",
        "expirationDate": "2025-01-01T00:00:00Z"
    })
    assert response.status_code == 200

def test_relationships(client):
    # First start registration
    start_response = client.post("/api/registration/start", json={
        "userType": "family",
        "email": f"test_{int(time.time() * 1000)}@example.com"
    })
    registration_id = start_response.json()["registrationId"]

    response = client.post("/api/registration/relationships", json={
        "registrationId": registration_id,
        "relationships": [{
            "inmateId": "123",
            "facilityId": "456",
            "relationship": "parent",
            "isPrimaryContact": True
        }]
    })
    assert response.status_code == 200
