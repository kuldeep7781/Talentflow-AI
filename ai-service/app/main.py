from fastapi import FastAPI, UploadFile, File, HTTPException
from app.schemas.matching import MatchRequest
from app.services.resume_parser import extract_text, parse_resume_text
from app.services.matcher import calculate_match

app = FastAPI(title="TalentFlow AI Service", description="Resume extraction and explainable candidate-job matching", version="1.0.0")

@app.get("/")
def root():
    return {"message": "TalentFlow AI Service"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "talentflow-ai"}

@app.post("/api/v1/resumes/parse")
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" or not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF resumes are supported")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume exceeds the 5 MB limit")
    try:
        text = extract_text(content)
        return parse_resume_text(text).model_dump()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

@app.post("/api/v1/matching/score")
def score_match(payload: MatchRequest):
    return calculate_match(payload)
