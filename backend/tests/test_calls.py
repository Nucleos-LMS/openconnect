def test_create_call(authed_client):
    from uuid import UUID
    response = authed_client.post("/api/calls/create", json={
        "creator_id": str(UUID("123e4567-e89b-12d3-a456-426614174000")),
        "room_name": "test-room",
        "participant_ids": [str(UUID("123e4567-e89b-12d3-a456-426614174001"))],
        "scheduled_start": "2025-02-23T12:00:00Z",
        "scheduled_duration": 30,
        "max_participants": 2,
        "recording_enabled": True
    })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "token" in data

def test_join_call(authed_client):
    # First create a call
    create_response = authed_client.post("/api/calls/create", json={
        "creator_id": "123e4567-e89b-12d3-a456-426614174000",
        "room_name": "test-room",
        "participant_ids": ["123e4567-e89b-12d3-a456-426614174001"],
        "scheduled_start": "2025-02-23T12:00:00Z",
        "scheduled_duration": 30,
        "max_participants": 2,
        "recording_enabled": True
    })
    call_id = create_response.json()["id"]
    
    # Then join it
    response = authed_client.post(f"/api/calls/{call_id}/join")
    assert response.status_code == 200
    data = response.json()
    assert "token" in data

def test_get_scheduled_calls(authed_client):
    response = authed_client.get("/api/calls/scheduled")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for call in data:
        assert "id" in call
        assert "scheduled_start" in call
        assert "participant_ids" in call
