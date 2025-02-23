import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.models.base import Base
from app.main import app
from app.core.deps import get_db

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="session")
def engine():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    return engine

@pytest.fixture(scope="session")
def TestingSessionLocal(engine):
    return sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

@pytest.fixture(autouse=True)
def cleanup_database(engine):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

@pytest.fixture
def db(TestingSessionLocal):
    db = TestingSessionLocal()
    try:
        # Create test data
        from app.models.users import User
        from app.models.facilities import Facility
        from uuid import UUID
        
        import random
        import time
        facility = Facility(
            id=UUID("123e4567-e89b-12d3-a456-426614174000"),
            name=f"Test Facility {int(time.time() * 1000)}_{random.randint(1000, 9999)}",
            settings={}
        )
        db.add(facility)
        
        test_user = User(
            id=UUID("123e4567-e89b-12d3-a456-426614174000"),
            email="test@example.com",
            role="staff",
            status="approved",
            facility_id=facility.id,
            is_active=True
        )
        db.add(test_user)
        
        test_contact = User(
            id=UUID("123e4567-e89b-12d3-a456-426614174001"),
            email="contact@example.com",
            role="resident",
            status="approved",
            facility_id=facility.id,
            is_active=True
        )
        db.add(test_contact)
        
        db.commit()
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture
def auth_headers():
    return {
        "Authorization": "Bearer test_token"
    }

@pytest.fixture
def authed_client(client):
    client.headers.update({
        "Authorization": "Bearer test_token"
    })
    return client
