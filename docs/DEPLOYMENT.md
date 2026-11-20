# Deployment notes

The repository is structured as three separately deployable services. For a first portfolio deployment, choose providers that support Node.js, Python ASGI applications and a managed MongoDB database. Free-tier availability, sleep behavior, storage persistence, outbound network restrictions and monthly quotas vary by provider and can change; verify current terms before choosing.

## Service configuration

### Backend
- Set `NODE_ENV=production`.
- Set a strong randomly generated `JWT_SECRET` (32+ characters).
- Set `MONGO_URI` to a production database with least-privilege credentials.
- Set `AI_SERVICE_URL` to the private/reachable AI service URL.
- Set `CLIENT_ORIGIN` to the exact deployed frontend origin(s).
- Set seed HR/interviewer credentials securely; run the seed command once, then rotate/remove seed secrets where appropriate.
- Persist uploaded resumes in private object storage; local filesystem storage may be ephemeral on hosted platforms.

### Frontend
- Set `VITE_API_URL` to the deployed backend `/api` base URL at build time.
- Build with `npm run build`; deploy the generated `dist/` directory.

### AI service
- Run `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (adapt port binding to the host).
- Do not use `--reload` in production.
- Restrict access to the AI service to the backend where the hosting platform supports private networking.

## Before real candidate data

This MVP is not production-hardened for sensitive applicant data. Add private object storage, malware scanning, retention/deletion workflows, audit logging, backup/restore drills, monitoring/alerting, stricter schema validation, security review, and a documented privacy/legal basis before processing real resumes.
