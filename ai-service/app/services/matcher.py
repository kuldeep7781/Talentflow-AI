from app.schemas.matching import MatchRequest

def calculate_match(payload: MatchRequest) -> dict:
    resume_skills = {item.strip().lower() for item in payload.resume.skills if item.strip()}
    required = {item.strip().lower() for item in payload.job.required_skills if item.strip()}
    matched = sorted(resume_skills & required)
    missing = sorted(required - resume_skills)
    skill_score = (len(matched) / len(required) * 100) if required else 0.0
    required_experience = max(0.0, payload.job.experience_required)
    candidate_experience = max(0.0, payload.resume.experience_years)
    experience_score = 100.0 if required_experience == 0 else min(candidate_experience / required_experience, 1.0) * 100
    # Transparent MVP weighting; do not treat this score as an automated hiring decision.
    overall = round(skill_score * 0.8 + experience_score * 0.2, 1)
    return {
        "score": overall,
        "score_breakdown": {"skills": round(skill_score, 1), "experience": round(experience_score, 1), "weights": {"skills": 0.8, "experience": 0.2}},
        "matched_skills": matched,
        "missing_skills": missing,
        "candidate_experience_years": candidate_experience,
        "required_experience_years": required_experience,
        "method": "transparent-rule-based-v1",
        "disclaimer": "Decision-support only. HR must review the resume and make the hiring decision.",
    }
