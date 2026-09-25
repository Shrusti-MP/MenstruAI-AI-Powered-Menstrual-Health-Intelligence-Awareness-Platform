def test_get_quiz_questions(client):
    resp = client.get("/api/v1/quiz")
    assert resp.status_code == 200
    questions = resp.json()
    assert len(questions) >= 10
    # Verify no correct answer leak in options
    for q in questions:
        assert "question" in q
        assert len(q["options"]) >= 2
        for opt in q["options"]:
            assert "is_correct" not in opt or opt.get("is_correct") is None


def test_submit_quiz_and_history(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    
    # 1. Fetch questions
    q_resp = client.get("/api/v1/quiz")
    questions = q_resp.json()

    # 2. Build answers
    answers = []
    for q in questions[:5]:
        answers.append({
            "question_id": q["id"],
            "selected_option_id": q["options"][0]["id"]
        })

    # 3. Submit
    sub_resp = client.post("/api/v1/quiz/submit", json={"answers": answers}, headers=headers)
    assert sub_resp.status_code == 200
    result = sub_resp.json()
    assert "score" in result
    assert "percentage" in result
    assert len(result["results"]) == 5

    # 4. Check history
    hist_resp = client.get("/api/v1/quiz/history", headers=headers)
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert history["total_attempts"] >= 1
    assert history["latest_score"] is not None


def test_quiz_anti_repetition(client, test_user_token):
    """Verify that retaking a quiz yields completely new questions when unused questions exist."""
    headers = {"Authorization": f"Bearer {test_user_token}"}

    # 1. Fetch first quiz
    q1_resp = client.get("/api/v1/quiz", headers=headers)
    assert q1_resp.status_code == 200
    q1_questions = q1_resp.json()
    assert len(q1_questions) == 10
    q1_ids = {q["id"] for q in q1_questions}

    # 2. Submit answers for first quiz
    answers = [
        {"question_id": q["id"], "selected_option_id": q["options"][0]["id"]}
        for q in q1_questions
    ]
    sub1_resp = client.post("/api/v1/quiz/submit", json={"answers": answers}, headers=headers)
    assert sub1_resp.status_code == 200

    # 3. Fetch second quiz for the same user
    q2_resp = client.get("/api/v1/quiz", headers=headers)
    assert q2_resp.status_code == 200
    q2_questions = q2_resp.json()
    assert len(q2_questions) == 10
    q2_ids = {q["id"] for q in q2_questions}

    # 4. Anti-repetition assertion: No overlap between Quiz 1 and Quiz 2
    overlap = q1_ids.intersection(q2_ids)
    assert len(overlap) == 0, f"Expected 0 repeating questions, but found {len(overlap)}: {overlap}"
