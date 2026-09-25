import uuid


def test_register_success(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Jane Doe",
            "email": unique_email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "privacy_consent": True,
        }
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique_email
    assert data["user"]["name"] == "Jane Doe"


def test_register_duplicate_email(client):
    email = f"duplicate_{uuid.uuid4().hex[:8]}@example.com"
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Duplicate One",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "privacy_consent": True,
        }
    )
    # Second registration should fail with 409
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Duplicate Two",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "privacy_consent": True,
        }
    )
    assert resp.status_code == 409
    assert "already exists" in resp.json()["detail"].lower()


def test_register_password_mismatch(client):
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Mismatch User",
            "email": "mismatch@example.com",
            "password": "Password123!",
            "confirm_password": "DifferentPassword123!",
            "privacy_consent": True,
        }
    )
    assert resp.status_code == 400
    assert "match" in resp.json()["detail"].lower()


def test_login_success(client):
    # Use demo user created during DB initialization
    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "demo@menstruai.com",
            "password": "Password123!"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@menstruai.com"


def test_login_invalid_password(client):
    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "demo@menstruai.com",
            "password": "WrongPassword999!"
        }
    )
    assert resp.status_code == 401


def test_protected_me_without_token(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401


def test_protected_me_with_token(client, test_user_token):
    resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "email" in data
