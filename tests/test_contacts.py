import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_request_contact():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contacts/request", json={
            "inmateId": "123",
            "facilityId": "456",
            "relationship": "parent",
            "isPrimaryContact": True
        })
        assert response.status_code == 200
        data = response.json()
        assert "contactId" in data
        assert data["status"] == "pending"

@pytest.mark.asyncio
async def test_approve_contact():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First create a contact request
        request_response = await client.post("/api/contacts/request", json={
            "inmateId": "123",
            "facilityId": "456",
            "relationship": "parent",
            "isPrimaryContact": True
        })
        contact_id = request_response.json()["contactId"]
        
        # Then approve it
        response = await client.put(f"/api/contacts/{contact_id}/approve")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_get_pending_contacts():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/contacts/pending")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for contact in data:
            assert "contactId" in contact
            assert "status" in contact
            assert contact["status"] == "pending"
