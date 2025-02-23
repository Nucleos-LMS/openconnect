def test_update_facility_settings(authed_client):
    facility_id = "123e4567-e89b-12d3-a456-426614174000"
    settings = {
        "name": f"Test Facility {facility_id}",
        "settings": {
            "network": {
                "max_bandwidth": 1000,
                "allowed_ip_ranges": ["10.0.0.0/8"],
                "vpn_required": False,
                "latency_threshold": 150
            },
            "devices": {
                "allowed_browsers": ["chrome", "firefox"],
                "min_browser_version": "90",
                "allowed_devices": ["desktop", "mobile"],
                "require_camera": True,
                "require_microphone": True
            },
            "security": {
                "require_vpn": False,
                "allowed_auth_methods": ["password"],
                "session_timeout": 30,
                "max_failed_attempts": 5,
                "password_policy": {}
            },
            "deployment": {
                "deployment_type": "cloud",
                "update_policy": "automatic",
                "backup_policy": {},
                "maintenance_window": {}
            }
        }
    }
    
    response = authed_client.put(
        f"/api/facilities/{facility_id}/settings",
        json=settings
    )
    assert response.status_code == 200

def test_get_facility_settings(authed_client):
    facility_id = "123e4567-e89b-12d3-a456-426614174000"
    response = authed_client.get(f"/api/facilities/{facility_id}/settings")
    assert response.status_code == 200
    data = response.json()
    assert "network" in data["settings"]
    assert "devices" in data["settings"]
    assert "security" in data["settings"]
    assert "deployment" in data["settings"]
