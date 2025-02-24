from app.core.email import generate_verification_token

def test_registration_start(authed_client):
    response = authed_client.post("/api/registration/start", json={
        "email": f"test_{int(1740281650.247)}@example.com",
        "user_type": "resident"
    })
    print("Response:", response.status_code, "-", response.json())
    assert response.status_code == 200
    data = response.json()
    assert "registrationId" in data
    assert "verificationToken" in data
    assert "expiresAt" in data

def test_verify_email(authed_client):
    email = "test@example.com"
    token = generate_verification_token(email)
    response = authed_client.post("/api/registration/verify-email", json={
        "email": email,
        "token": token
    })
    assert response.status_code == 200
    assert response.json()["verified"] is True

def test_personal_info(authed_client):
    response = authed_client.post("/api/registration/personal-info", json={
        "name": "John Doe",
        "phone": "+1234567890",
        "address": "123 Main St"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_verify_identity(authed_client):
    response = authed_client.post("/api/registration/verify-identity", json={
        "id_type": "drivers_license",
        "id_number": "DL123456",
        "id_expiry": "2025-12-31",
        "id_image": "base64_encoded_image"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_relationships(authed_client):
    from uuid import UUID
    response = authed_client.post("/api/registration/relationships", json={
        "contacts": [str(UUID("123e4567-e89b-12d3-a456-426614174000"))],
        "relationships": ["parent"]
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"
