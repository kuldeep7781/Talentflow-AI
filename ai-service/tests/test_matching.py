from app.schemas.matching import MatchRequest
from app.services.matcher import calculate_match
from app.services.resume_parser import parse_resume_text


def test_matcher_reports_matched_and_missing_skills():
    payload = MatchRequest(
        resume={"skills": ["Python", "React"], "experience_years": 2},
        job={"required_skills": ["Python", "Node.js"], "experience_required": 2},
    )
    result = calculate_match(payload)
    assert result["matched_skills"] == ["python"]
    assert result["missing_skills"] == ["node.js"]
    assert result["score"] == 60.0
    assert "Decision-support only" in result["disclaimer"]


def test_resume_parser_extracts_basic_contact_and_skills():
    parsed = parse_resume_text("Kuldeep Sharma\nkuldeep@example.com\nPython React Node.js\n2 years experience\nB.Tech Computer Science")
    assert parsed.full_name == "Kuldeep Sharma"
    assert parsed.email == "kuldeep@example.com"
    assert "python" in parsed.skills
    assert parsed.experience_years == 2


def test_health_endpoint_and_matching_api():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"

    response = client.post("/api/v1/matching/score", json={
        "resume": {"skills": ["Python"], "experience_years": 1},
        "job": {"required_skills": ["Python"], "experience_required": 1},
    })
    assert response.status_code == 200
    assert response.json()["score"] == 100.0
