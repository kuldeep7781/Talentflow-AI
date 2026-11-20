# Development workflow

## Local services

Run three terminals:

1. Backend: `cd backend; npm ci; npm run dev`
2. AI service: `cd ai-service; py -3.12 -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; python -m uvicorn app.main:app --reload --port 8000`
3. Frontend: `cd frontend; npm ci; npm run dev`

Start MongoDB before the backend. Configure backend `.env` from `.env.example`.

## Provision test staff accounts

Set `SEED_HR_*` and `SEED_INTERVIEWER_*` variables in backend `.env`, then run `npm run seed:users` from the backend directory.

## Recommended feature workflow

1. State the user story and acceptance criteria.
2. Identify affected UI, route, controller, service, model and AI-service boundaries.
3. Define request/response contracts and authorization rules.
4. Implement the smallest vertical slice.
5. Test happy path, validation failure, unauthorized access and dependency failure.
6. Run regression checks and inspect `git diff`.
7. Update requirements, architecture and learning notes.

## Debugging checklist

- Reproduce the exact request and capture expected vs actual behavior.
- Identify the failing layer: browser, Express route, controller, service, MongoDB or FastAPI.
- Test services independently (`/api/health`, FastAPI `/health`).
- Inspect HTTP status/body and backend/AI terminal logs.
- Check environment variables, ports, CORS, token and MongoDB connectivity.
- Fix the root cause, not only the visible symptom.
- Repeat the failing test and run regression tests.

## Git safety

Before changes: `git status --short --branch` and commit or back up work. Review `git diff` before staging. Never use destructive reset/clean commands to resolve ordinary integration conflicts. Never commit `.env`, `.venv`, `node_modules`, uploaded resumes or credentials.

## Production terminology

- **Upstream dependency:** FastAPI, which Express calls.
- **Service boundary:** separation between recruitment API and AI processing.
- **API contract:** defined request and response schema.
- **RBAC:** authorization by user role.
- **Resource-level authorization:** ownership or assignment check for a specific record.
- **Error taxonomy:** classifying failures into 4xx, 5xx, timeout and dependency errors.
- **Regression test:** test that confirms existing functionality still works after a change.
- **Observability:** logs, metrics and traces used to understand system behavior.
