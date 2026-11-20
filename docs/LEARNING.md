# Learning and interview notes

## Architecture concepts

- **Layered architecture:** routes match HTTP paths, controllers coordinate HTTP input/output, services implement application logic, models persist data.
- **Microservice boundary:** Express owns recruitment workflows; FastAPI owns Python-based document and matching workloads.
- **Upstream dependency:** FastAPI is upstream from Express during an AI request.
- **RBAC vs resource authorization:** roles gate capabilities; ownership/assignment checks protect individual records.
- **Server state vs client state:** TanStack Query manages remote API data/cache; Zustand stores small client-side session state.
- **Aggregation pipeline:** MongoDB groups applications by status for HR dashboard metrics.
- **Compound unique index:** prevents a candidate applying to the same job more than once.
- **Timeout and error taxonomy:** dependency connection failures, timeouts and upstream HTTP errors are distinguished.

## AI concepts implemented

- PyMuPDF extracts selectable text from PDF pages.
- Resume parsing uses regular expressions and a small keyword dictionary; output is validated by Pydantic.
- Matching computes required-skill coverage and experience fit, weighted 80% and 20% respectively.
- The score is a transparent heuristic, not an ML prediction or probability.
- HR must review source resume and evidence; no automated hiring decision is made.

## Interview explanation

"I built a recruitment portal with Candidate, HR and Interviewer roles. The React frontend uses TanStack Query for API/server state and Zustand for authentication state. The Express API implements JWT authentication, backend RBAC and resource-level authorization. MongoDB stores users, candidate profiles, jobs, applications and interviews with indexes to enforce uniqueness and support listing. A separate FastAPI service extracts selectable PDF text and returns structured resume data and an explainable rule-based match breakdown. Express orchestrates the AI service with bounded timeouts and centralized error handling. HR remains responsible for recruitment decisions."

Only claim the features that have been run and verified in your environment. The current matcher is rule-based; do not describe it as embedding-based semantic matching.
