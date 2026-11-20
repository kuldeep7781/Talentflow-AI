# Database schema overview

## User
- `name`, `email` (unique), `passwordHash` (excluded from normal query selection), `role` (`CANDIDATE`, `HR`, `INTERVIEWER`), `isActive`.

## Candidate
- `userId` reference to User, `name`, `email` (unique), `phone`, `skills`, `experience`, `education`, `resumePath`, `status`.

## Job
- `title`, `department`, `location`, `employmentType`, `description`, `requiredSkills`, `experienceRequired`, `openings`, `status`, `createdBy`.
- Indexes: status/createdAt and text search over title/department/description.

## Application
- `candidateId`, `jobId`, `status`, `resumePath`, `parsedResume`, `matchResult`, `reviewedBy`, `appliedAt`.
- Unique compound index on candidateId + jobId prevents duplicate applications.
- Additional indexes support status and recent-application listing.

## Interview
- `applicationId`, `interviewerId`, `scheduledAt`, `durationMinutes`, `interviewType`, `meetingLink`, `status`, `feedback`, `createdBy`.
- Indexes support application lookup and interviewer schedule listing.

References are stored as MongoDB ObjectIds. The service layer populates related candidate/job data for portal views.
