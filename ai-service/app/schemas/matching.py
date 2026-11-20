from pydantic import BaseModel, Field

class ResumeData(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: list[str] = Field(default_factory=list)
    experience_years: float = 0
    education: list[str] = Field(default_factory=list)
    summary: str = ""

class JobData(BaseModel):
    title: str = ""
    description: str = ""
    required_skills: list[str] = Field(default_factory=list)
    experience_required: float = 0

class MatchRequest(BaseModel):
    resume: ResumeData
    job: JobData
