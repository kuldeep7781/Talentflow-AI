import re
import fitz
from app.schemas.matching import ResumeData

SKILL_DICTIONARY = [
    "javascript", "typescript", "react", "node.js", "express", "mongodb", "sql",
    "python", "java", "c++", "html", "css", "tailwind", "rest api", "git",
    "docker", "aws", "fastapi", "django", "flask", "machine learning", "deep learning",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "langchain", "langgraph",
    "llm", "rag", "redis", "postgresql", "mysql", "mongoose", "jest", "pytest"
]

def extract_text(pdf_bytes: bytes) -> str:
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            return "\n".join(page.get_text("text") for page in document).strip()
    except Exception as exc:
        raise ValueError("Unable to read this PDF. It may be encrypted, corrupted or image-only.") from exc

def parse_resume_text(text: str) -> ResumeData:
    if not text.strip():
        raise ValueError("No selectable text was found in this PDF. OCR is not included in this MVP.")
    email_match = re.search(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", text, re.I)
    phone_match = re.search(r"(?:\+?\d[\d\s().-]{8,}\d)", text)
    lower = text.lower()
    skills = [skill for skill in SKILL_DICTIONARY if skill in lower]
    exp_match = re.search(r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)", lower)
    education_terms = [line.strip() for line in text.splitlines() if any(term in line.lower() for term in ["b.tech", "bachelor", "master", "m.tech", "bca", "mca", "degree", "university", "college"])][:8]
    first_lines = [line.strip() for line in text.splitlines() if line.strip()]
    name = first_lines[0][:100] if first_lines else None
    return ResumeData(
        full_name=name,
        email=email_match.group(0) if email_match else None,
        phone=phone_match.group(0).strip() if phone_match else None,
        skills=skills,
        experience_years=float(exp_match.group(1)) if exp_match else 0,
        education=education_terms,
        summary=" ".join(text.split())[:700],
    )
