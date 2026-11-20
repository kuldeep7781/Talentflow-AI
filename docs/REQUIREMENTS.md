# Requirements — TalentFlow AI MVP

## Product objective

Provide a compact recruitment portal with Candidate, HR/Recruiter and Interviewer workflows, backed by an Express API and a Python resume-processing service.

## Roles and permissions

### Candidate
- Publicly register and sign in.
- Browse and search published/open jobs.
- Upload a PDF resume and apply to an open job.
- View their own application history and status.
- Cannot access another candidate's application or HR/interviewer operations.

### HR / Recruiter
- Accounts are provisioned through the seed/admin process; public registration cannot select HR.
- View recruitment dashboard and applications.
- Create, update and close jobs.
- Review extracted resume data and AI-assisted match explanation.
- View original resume for an application.
- Shortlist/reject/move application through allowed statuses.
- Schedule an interview and assign an active Interviewer.
- Make final recruitment decisions; AI and interviewer recommendations are advisory.

### Interviewer
- Accounts are provisioned by HR/admin process.
- View only interviews assigned to their account.
- View the related candidate and job details.
- Submit rating, strengths, concerns and recommendation.
- Cannot directly change the final application status or view unassigned applications/resumes.

## Functional requirements
- JWT-based sign-in and candidate-only public registration.
- Password hashing and active-account check.
- Backend role checks and resource-level ownership/assignment checks.
- Public open-job listing with search and pagination.
- PDF resume upload (maximum 5 MB) and text extraction.
- Structured resume fields: name, email, phone, skills, experience, education and summary.
- Explainable baseline match score, score breakdown, matched skills and missing skills.
- Application lifecycle: Applied, Screening, Shortlisted, Rejected, Hired, Withdrawn.
- Interview lifecycle: Scheduled, Completed, Cancelled.
- HR dashboard statistics, including aggregation by application status.
- Centralized error handling and upstream timeout/error mapping.

## Non-functional requirements
- Keep secrets in environment variables; do not commit `.env`.
- Limit resume size and accepted file type.
- Use server-side authorization; frontend route visibility is not security.
- Keep MongoDB as source of truth.
- Keep AI processing behind FastAPI service boundaries.
- Use indexes for uniqueness and common query patterns.
- Provide tests for key AI service and matching behavior.

## Explicit MVP exclusions
- OCR for scanned/image-only PDFs.
- Semantic embedding-based matching; current matching is keyword/experience rule-based.
- LLM resume parsing, RAG and autonomous agents.
- Email notifications and Redis/BullMQ background processing.
- Full audit trail, object storage, malware scanning and enterprise compliance controls.
