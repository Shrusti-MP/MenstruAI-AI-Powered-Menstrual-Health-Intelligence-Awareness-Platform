import uuid


def test_get_symptoms_list(client):
    resp = client.get("/api/v1/tracking/symptoms")
    assert resp.status_code == 200
    symptoms = resp.json()
    assert len(symptoms) >= 7
    symptom_names = [s["name"] for s in symptoms]
    assert "Cramps" in symptom_names
    assert "Fatigue" in symptom_names


def test_create_and_get_tracking_record(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    
    # 1. Fetch symptoms to get IDs
    sym_resp = client.get("/api/v1/tracking/symptoms")
    symptoms = sym_resp.json()
    cramp_id = next(s["id"] for s in symptoms if s["name"] == "Cramps")

    # 2. Create tracking record
    payload = {
        "start_date": "2026-09-20",
        "end_date": "2026-09-24",
        "flow": "Medium",
        "mood": "Okay",
        "sleep": "Good",
        "notes": "Mild morning cramps, improved after warm tea.",
        "symptom_ids": [cramp_id]
    }
    create_resp = client.post("/api/v1/tracking", json=payload, headers=headers)
    assert create_resp.status_code == 201
    record = create_resp.json()
    assert record["flow"] == "Medium"
    assert record["mood"] == "Okay"
    assert len(record["symptoms"]) == 1
    assert record["symptoms"][0]["name"] == "Cramps"
    record_id = record["id"]

    # 3. Get single record
    get_resp = client.get(f"/api/v1/tracking/{record_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == record_id

    # 4. Update record
    update_resp = client.put(
        f"/api/v1/tracking/{record_id}",
        json={"flow": "Heavy", "notes": "Updated note: heavier flow on day 2."},
        headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["flow"] == "Heavy"

    # 5. List records
    list_resp = client.get("/api/v1/tracking", headers=headers)
    assert list_resp.status_code == 200
    assert any(r["id"] == record_id for r in list_resp.json())

    # 6. Delete record
    del_resp = client.delete(f"/api/v1/tracking/{record_id}", headers=headers)
    assert del_resp.status_code == 200

    # 7. Verify deletion
    verify_resp = client.get(f"/api/v1/tracking/{record_id}", headers=headers)
    assert verify_resp.status_code == 404


def test_user_data_isolation(client, test_user_token):
    # Register a second distinct user
    other_email = f"other_{uuid.uuid4().hex[:6]}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Other User",
            "email": other_email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "privacy_consent": True,
        }
    )
    other_token = reg_resp.json()["access_token"]
    other_headers = {"Authorization": f"Bearer {other_token}"}

    # User 2 creates a record
    create_resp = client.post(
        "/api/v1/tracking",
        json={"start_date": "2026-09-15", "flow": "Light", "symptom_ids": []},
        headers=other_headers
    )
    assert create_resp.status_code == 201
    other_record_id = create_resp.json()["id"]

    # User 1 tries to access User 2's record -> MUST be 404 forbidden
    user1_headers = {"Authorization": f"Bearer {test_user_token}"}
    unauthorized_get = client.get(f"/api/v1/tracking/{other_record_id}", headers=user1_headers)
    assert unauthorized_get.status_code == 404

    # User 1 tries to delete User 2's record -> MUST be 404
    unauthorized_del = client.delete(f"/api/v1/tracking/{other_record_id}", headers=user1_headers)
    assert unauthorized_del.status_code == 404
