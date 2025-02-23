import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app
from app.core.deps import get_db
from app.models.facilities import Facility
from app.models.users import User
from app.schemas.facilities import FacilitySettings

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create test facility
    facility = Facility(
        name="Central Facility",
        settings=FacilitySettings().model_dump()
    )
    db.add(facility)
    db.commit()
    
    yield db
    
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

@pytest.fixture
def authed_client(client):
    """Client with test token."""
    client.headers["Authorization"] = "Bearer test_token"
    return client
