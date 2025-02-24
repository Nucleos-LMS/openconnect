def generate_room_token(room_name: str, user_id: str) -> str:
    """Generate a mock token for testing."""
    return f"mock_token_{room_name}_{user_id}"
