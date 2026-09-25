import uuid


def test_analytics_empty_user(client):
    # Register fresh user with no tracking records
    unique_email = f"fresh_analytics_{uuid.uuid4().hex[:8]}@example.com"
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Fresh User",
            "email": unique_email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "privacy_consent": True,
        }
    )
    assert resp.status_code == 201
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Summary should be clean 0
    summary_resp = client.get("/api/v1/analytics/summary", headers=headers)
    assert summary_resp.status_code == 200
    data = summary_resp.json()
    assert data["total_records"] == 0
    assert len(data["factual_statements"]) >= 1


def test_analytics_with_data(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    # Add 2 records
    sym_resp = client.get("/api/v1/tracking/symptoms")
    symptoms = sym_resp.json()
    fatigue_id = next(s["id"] for s in symptoms if s["name"] == "Fatigue")

    client.post(
        "/api/v1/tracking",
        json={
            "start_date": "2026-09-01",
            "flow": "Heavy",
            "mood": "Low",
            "sleep": "Poor",
            "symptom_ids": [fatigue_id]
        },
        headers=headers
    )

    client.post(
        "/api/v1/tracking",
        json={
            "start_date": "2026-09-02",
            "flow": "Medium",
            "mood": "Good",
            "sleep": "Good",
            "symptom_ids": [fatigue_id]
        },
        headers=headers
    )

    summary_resp = client.get("/api/v1/analytics/summary", headers=headers)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["total_records"] >= 2
    # Verify factual statements contain no medical diagnosis
    for stmt in summary["factual_statements"]:
        assert "you have a disease" not in stmt.lower()
        assert "you have a medical condition" not in stmt.lower()

    # Flow endpoint
    flow_resp = client.get("/api/v1/analytics/flow", headers=headers)
    assert flow_resp.status_code == 200

    # Symptoms endpoint
    sym_counts_resp = client.get("/api/v1/analytics/symptoms", headers=headers)
    assert sym_counts_resp.status_code == 200
    fatigue_item = next((s for s in sym_counts_resp.json() if s["symptom"] == "Fatigue"), None)
    assert fatigue_item is not None
    assert fatigue_item["count"] >= 2
