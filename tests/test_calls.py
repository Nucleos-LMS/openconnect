import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_call():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/calls/create", json={
            "userId": "123",
            "userRole": "family",
            "facilityId": "456"
        })
        assert response.status_code == 200
        data = response.json()
        assert "callId" in data
        assert "token" in data

@pytest.mark.asyncio
async def test_join_call():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First create a call
        create_response = await client.post("/api/calls/create", json={
            "userId": "123",
            "userRole": "family",
            "facilityId": "456"
        })
        call_id = create_response.json()["callId"]
        
        # Then join it
        response = await client.post(f"/api/calls/{call_id}/join", json={
            "userId": "789",
            "userRole": "resident"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data

@pytest.mark.asyncio
async def test_get_scheduled_calls():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/calls/scheduled")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for call in data:
            assert "callId" in call
            assert "scheduledTime" in call
            assert "participants" in call
