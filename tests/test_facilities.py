import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_update_facility_settings():
    async with AsyncClient(app=app, base_url="http://test") as client:
        facility_id = "123"
        settings = {
            "requirements": {
                "idRequired": True,
                "additionalDocuments": ["proof_of_address"],
                "visitationHours": "9:00-17:00"
            },
            "webrtc": {
                "iceServers": ["stun:stun.l.google.com:19302"],
                "maxBitrate": 1000,
                "fallbackToRelay": True
            },
            "monitoring": {
                "enableAiMonitoring": False,
                "recordCalls": True,
                "retentionDays": 30
            }
        }
        
        response = await client.put(
            f"/api/facilities/{facility_id}/settings",
            json=settings
        )
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_facility_settings():
    async with AsyncClient(app=app, base_url="http://test") as client:
        facility_id = "123"
        response = await client.get(f"/api/facilities/{facility_id}/settings")
        assert response.status_code == 200
        data = response.json()
        assert "requirements" in data
        assert "webrtc" in data
        assert "monitoring" in data
