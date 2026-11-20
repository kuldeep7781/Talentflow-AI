# API contracts (MVP)

Base URL: `http://localhost:5000/api`

Authenticated routes require `Authorization: Bearer <JWT>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Candidate registration |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | Authenticated | Current account |
| GET | `/jobs` | Public | Open job search/list with pagination |
| POST | `/jobs` | HR | Create job |
| PATCH | `/jobs/:id` | HR | Update job |
| DELETE | `/jobs/:id` | HR | Close job |
| POST | `/jobs/:jobId/apply` | Candidate | Submit PDF resume application (`resume` multipart field) |
| GET | `/applications/mine` | Candidate | Own applications |
| GET | `/applications` | HR | Paginated application list |
| GET | `/applications/:id/resume` | HR or assigned Interviewer | Download original resume |
| PATCH | `/applications/:id/status` | HR | Change recruitment status |
| GET | `/interviewers` | HR | Active interviewer accounts |
| GET | `/interviews` | HR / Interviewer | HR all; interviewer assigned only |
| POST | `/interviews` | HR | Schedule and assign interview |
| POST | `/interviews/:id/feedback` | Assigned Interviewer | Submit evaluation |
| GET | `/dashboard/stats` | HR | Recruitment dashboard statistics |
| GET | `/ai/health` | Public | FastAPI dependency health check |

## Application response data

Application records include `status`, `parsedResume`, and `matchResult`. Match results include `score`, `score_breakdown`, `matched_skills`, `missing_skills`, matching method and a decision-support disclaimer.

## Error response

Most errors use `{ "message": "..." }`. Validation errors may include a `details` array. Common statuses: 400 validation, 401 unauthenticated, 403 forbidden, 404 missing resource, 409 duplicate, 413 oversized file, 415 unsupported file, 422 unprocessable PDF, 502 invalid upstream response, 503 dependency unavailable, 504 upstream timeout, 500 unexpected server error.
