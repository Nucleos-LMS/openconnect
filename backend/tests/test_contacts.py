def test_request_contact(authed_client):
    from uuid import UUID
    response = authed_client.post("/api/contacts/request", json={
        "requestor_id": str(UUID("123e4567-e89b-12d3-a456-426614174000")),
        "contact_id": str(UUID("123e4567-e89b-12d3-a456-426614174001")),
        "relationship": "parent"
    })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["status"] == "pending"

def test_approve_contact(authed_client):
    # First create a contact request
    request_response = authed_client.post("/api/contacts/request", json={
        "requestor_id": "123e4567-e89b-12d3-a456-426614174000",
        "contact_id": "123e4567-e89b-12d3-a456-426614174001",
        "relationship": "parent"
    })
    contact_id = request_response.json()["id"]
    
    # Then approve it
    response = authed_client.put(f"/api/contacts/{contact_id}/approve", json={
        "relationship": "parent",
        "status": "approved"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"

def test_get_pending_contacts(authed_client):
    response = authed_client.get("/api/contacts/pending")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for contact in data:
        assert "id" in contact
        assert "status" in contact
        assert contact["status"] == "pending"
