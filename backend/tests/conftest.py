import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.database.init_db import init_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    init_db(db)
    db.close()
    yield


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user_token(client):
    # Register or login unique test user
    email = "testuser_pytest@example.com"
    pwd = "TestPassword123!"
    
    # Try register
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test Runner",
            "email": email,
            "password": pwd,
            "confirm_password": pwd,
            "privacy_consent": True,
        }
    )
    if resp.status_code == 201:
        return resp.json()["access_token"]
    
    # Or login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": pwd}
    )
    return login_resp.json()["access_token"]
