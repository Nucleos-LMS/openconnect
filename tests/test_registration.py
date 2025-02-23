import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_registration_start():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/registration/start", json={
            "userType": "family",
            "email": "test@example.com"
        })
        assert response.status_code == 200
        data = response.json()
        assert "registrationId" in data
        assert "verificationToken" in data
        assert "expiresAt" in data

@pytest.mark.asyncio
async def test_verify_email():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First start registration
        start_response = await client.post("/api/registration/start", json={
            "userType": "family",
            "email": "test@example.com"
        })
        start_data = start_response.json()
        
        # Then verify email
        response = await client.post("/api/registration/verify-email", json={
            "registrationId": start_data["registrationId"],
            "verificationToken": start_data["verificationToken"]
        })
        assert response.status_code == 200
        data = response.json()
        assert data["verified"] is True
        assert "nextStep" in data

@pytest.mark.asyncio
async def test_personal_info():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/registration/personal-info", json={
            "firstName": "John",
            "lastName": "Doe",
            "dateOfBirth": "1990-01-01",
            "phone": "+1234567890",
            "address": {
                "street1": "123 Main St",
                "city": "Anytown",
                "state": "CA",
                "zipCode": "12345",
                "country": "US"
            }
        })
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_verify_identity():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/registration/verify-identity", json={
            "governmentId": {
                "type": "drivers_license",
                "number": "DL123456",
                "expirationDate": "2025-01-01",
                "issuingState": "CA",
                "issuingCountry": "US"
            }
        })
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_relationships():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/registration/relationships", json={
            "relationships": [{
                "inmateId": "123",
                "facilityId": "456",
                "relationship": "parent",
                "isPrimaryContact": True
            }]
        })
        assert response.status_code == 200
