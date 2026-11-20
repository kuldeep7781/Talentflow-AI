# Architecture — TalentFlow AI MVP

## System context

```text
Candidate / HR / Interviewer browser
                |
                v
      React 19 + Vite frontend
      Zustand (auth state)
      TanStack Query (server state)
                |
          HTTPS / REST
                |
                v
      Node.js 20+ / Express 5 API
        |          |           |
        |          |           +--> FastAPI AI service
        |          |                 |--> PyMuPDF extraction
        |          |                 +--> rule-based matching
        |          |
        |          +--> JWT/RBAC middleware
        |
        +--> MongoDB / Mongoose
```

## Service responsibilities

- **React:** role-specific user experience, forms, navigation, query caching and mutation state.
- **Express:** authentication, authorization, recruitment business rules, persistence orchestration and API response contracts.
- **MongoDB:** authoritative users, candidate profiles, jobs, applications and interviews.
- **FastAPI:** PDF text extraction, heuristic structured parsing and explainable matching.

## Data model

- `User`: identity, email, password hash, role, active flag.
- `Candidate`: candidate profile linked to `User` by `userId`.
- `Job`: job description, requirements, status and creator.
- `Application`: references Candidate and Job; stores status, resume path, parsed resume and match result.
- `Interview`: references Application and assigned Interviewer; stores schedule and feedback.

Application has a unique compound index on `(candidateId, jobId)` to prevent duplicate applications. Job and Interview have indexes supporting listing and schedule queries. Job has a text index for basic search.

## Authorization model

RBAC answers whether a role can invoke a category of operation. Resource-level authorization narrows access to a particular record. Interviewer interview listing is filtered by `interviewerId`; resume download checks that the interviewer is assigned to the application. Candidate applications are queried using the candidate profile linked to the authenticated user.

## AI request flow

1. Candidate submits a PDF to Express using multipart field `resume`.
2. Express checks the upload metadata and size, then forwards bytes to FastAPI.
3. FastAPI extracts selectable text with PyMuPDF and parses heuristic fields.
4. Express sends parsed resume data and job requirements to FastAPI matching endpoint.
5. FastAPI returns score, breakdown, matched skills, missing skills and a decision-support disclaimer.
6. Express persists application, parsed data and match result in MongoDB.
7. HR reviews the original resume and match explanation; HR makes the decision.

## Reliability and error handling

- Express uses a bounded timeout for calls to FastAPI.
- Unavailable AI dependency maps to 503; timeout maps to 504; invalid upstream response maps to 502; expected upstream 4xx validation errors are preserved.
- Express 5 forwards rejected async route-handler promises to centralized error middleware.
- The current log implementation is compact console logging; structured Pino logging is a planned enhancement.

## Important boundaries and limitations

The matching algorithm is deterministic keyword/experience scoring, not semantic matching. Resume field extraction is heuristic. Local disk storage is suitable only for local demonstration; deployed use should move to private object storage and add retention, access logging and malware scanning.
