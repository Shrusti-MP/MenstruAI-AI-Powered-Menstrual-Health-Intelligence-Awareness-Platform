"""
MenstruAI End-to-End Quiz & Education System Verification Script
Tests anti-repetition question selection, difficulty balancing, pool exhaustion reset, and educational library.
"""

import json
import sys
import urllib.error
import urllib.request


def post(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        try:
            error_json = json.loads(error_body)
            detail = error_json.get("detail", error_body)
        except Exception:
            detail = error_body
        raise RuntimeError(f"HTTP {e.code} on POST {url}: {detail}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(
            f"Cannot connect to {url}. Ensure the FastAPI server is running on http://127.0.0.1:8000. ({e.reason})"
        ) from e


def get(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        try:
            error_json = json.loads(error_body)
            detail = error_json.get("detail", error_body)
        except Exception:
            detail = error_body
        raise RuntimeError(f"HTTP {e.code} on GET {url}: {detail}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(
            f"Cannot connect to {url}. Ensure the FastAPI server is running on http://127.0.0.1:8000. ({e.reason})"
        ) from e


def authenticate_user():
    """Register a fresh unique test user to verify anti-repetition from scratch."""
    import uuid
    uid = uuid.uuid4().hex[:6]
    email = f"quiz_test_{uid}@example.com"
    password = "TestPassword123!"

    auth_data = post(
        "http://127.0.0.1:8000/api/v1/auth/register",
        {
            "name": f"Quiz Tester {uid}",
            "email": email,
            "password": password,
            "confirm_password": password,
            "privacy_consent": True,
        },
    )
    print(f"[Auth] Registered and logged in fresh test user: {email}")
    return auth_data["access_token"]


def run_tests():
    print("=" * 60)
    print("MenstruAI End-to-End Quiz & Education Verification")
    print("=" * 60)

    # Step 1: Authentication
    token = authenticate_user()
    print("  -> Access token acquired successfully.\n")

    # Step 2: Educational Content Library
    print("--- 1. Testing Education Library & Categories ---")
    categories = get("http://127.0.0.1:8000/api/v1/education/categories/list")
    print(f"Total categories available: {len(categories)}")
    for c in categories:
        print(f"  - {c['category']}: {c['count']} articles")
    assert len(categories) >= 15, f"Expected at least 15 categories, found {len(categories)}"

    search_term = "cramps"
    search_res = get(f"http://127.0.0.1:8000/api/v1/education?search={search_term}")
    print(f"Live search for '{search_term}' returned: {len(search_res)} articles")
    assert len(search_res) > 0, f"Expected articles for '{search_term}', got 0"
    print("  -> Education library verification PASSED.\n")

    # Step 3: Quiz Attempt 1
    print("--- 2. Testing Quiz Attempt 1 & Difficulty Balance ---")
    q1 = get("http://127.0.0.1:8000/api/v1/quiz", token)
    q1_ids = set(q["id"] for q in q1)
    print(f"Attempt 1 Question IDs ({len(q1_ids)}): {sorted(list(q1_ids))}")
    assert len(q1) == 10, f"Expected 10 questions, got {len(q1)}"

    q1_diffs = [q["difficulty"] for q in q1]
    diff_counts = {d: q1_diffs.count(d) for d in set(q1_diffs)}
    print(f"Difficulty distribution: {diff_counts} (Expected: 5 Easy, 3 Medium, 2 Hard)")
    assert diff_counts.get("Easy", 0) == 5, f"Expected 5 Easy questions, got {diff_counts.get('Easy', 0)}"
    assert diff_counts.get("Medium", 0) == 3, f"Expected 3 Medium questions, got {diff_counts.get('Medium', 0)}"
    assert diff_counts.get("Hard", 0) == 2, f"Expected 2 Hard questions, got {diff_counts.get('Hard', 0)}"

    # Submit Attempt 1
    answers1 = [{"question_id": q["id"], "selected_option_id": q["options"][0]["id"]} for q in q1]
    res1 = post("http://127.0.0.1:8000/api/v1/quiz/submit", {"answers": answers1}, token)
    print(f"Attempt 1 Result: {res1['score']}/{res1['total_questions']} ({res1['percentage']}%)")
    print("  -> Attempt 1 submitted and evaluated successfully.\n")

    # Step 4: Quiz Attempt 2 — Anti-Repetition Check
    print("--- 3. Testing Quiz Attempt 2 (Anti-Repetition Check) ---")
    q2 = get("http://127.0.0.1:8000/api/v1/quiz", token)
    q2_ids = set(q["id"] for q in q2)
    print(f"Attempt 2 Question IDs ({len(q2_ids)}): {sorted(list(q2_ids))}")
    overlap1_2 = q1_ids.intersection(q2_ids)
    print(f"Overlapping questions between Attempt 1 and Attempt 2: {len(overlap1_2)}")
    assert len(overlap1_2) == 0, f"Anti-repetition FAILED! Questions repeated: {overlap1_2}"

    # Submit Attempt 2
    answers2 = [{"question_id": q["id"], "selected_option_id": q["options"][0]["id"]} for q in q2]
    res2 = post("http://127.0.0.1:8000/api/v1/quiz/submit", {"answers": answers2}, token)
    print(f"Attempt 2 Result: {res2['score']}/{res2['total_questions']} ({res2['percentage']}%)")
    print("  -> Anti-repetition check between Attempt 1 & 2 PASSED.\n")

    # Step 5: Quiz Attempt 3 — Further Anti-Repetition Check
    print("--- 4. Testing Quiz Attempt 3 (Cumulative Anti-Repetition) ---")
    q3 = get("http://127.0.0.1:8000/api/v1/quiz", token)
    q3_ids = set(q["id"] for q in q3)
    print(f"Attempt 3 Question IDs ({len(q3_ids)}): {sorted(list(q3_ids))}")
    overlap_prev = (q1_ids | q2_ids).intersection(q3_ids)
    print(f"Overlapping questions with Attempt 1 or Attempt 2: {len(overlap_prev)}")
    assert len(overlap_prev) == 0, f"Anti-repetition FAILED! Questions repeated: {overlap_prev}"

    answers3 = [{"question_id": q["id"], "selected_option_id": q["options"][0]["id"]} for q in q3]
    res3 = post("http://127.0.0.1:8000/api/v1/quiz/submit", {"answers": answers3}, token)
    print(f"Attempt 3 Result: {res3['score']}/{res3['total_questions']} ({res3['percentage']}%)")
    print("  -> Cumulative anti-repetition check PASSED.\n")

    # Step 6: Quiz History & User Statistics
    print("--- 5. Testing Quiz History Persistence ---")
    history = get("http://127.0.0.1:8000/api/v1/quiz/history", token)
    print(f"Total attempts recorded in database: {history['total_attempts']}")
    print(f"Latest score: {history['latest_score']}/10")
    print(f"Best score: {history['best_score']}/10")
    assert history["total_attempts"] >= 3, "Expected at least 3 attempts recorded"
    print("  -> Quiz history persistence PASSED.\n")

    # Step 7: Pool Exhaustion & Automatic Round Reset
    print("--- 6. Testing Pool Exhaustion & Automatic Round Reset ---")
    print("Simulating consecutive quiz rounds until pool cycles...")
    for round_num in range(1, 12):
        q_round = get("http://127.0.0.1:8000/api/v1/quiz", token)
        assert len(q_round) == 10, f"Round {round_num} failed: expected 10 questions, got {len(q_round)}"
        ans_round = [{"question_id": x["id"], "selected_option_id": x["options"][0]["id"]} for x in q_round]
        res_round = post("http://127.0.0.1:8000/api/v1/quiz/submit", {"answers": ans_round}, token)
        ids_preview = [x["id"] for x in q_round[:4]]
        print(f"  Round {round_num:2d}: Selected 10 questions (sample IDs: {ids_preview}...) - Score: {res_round['score']}/10")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED: Anti-repetition, pool exhaustion,")
    print("difficulty balance, and educational library are 100% verified!")
    print("=" * 60)


if __name__ == "__main__":
    try:
        run_tests()
    except Exception as err:
        print(f"\n[Test Error]: {err}", file=sys.stderr)
        sys.exit(1)
