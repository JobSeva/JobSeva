# JobSeva Backend

Initial backend implementation for JobSeva using Express + TypeScript.

## Quick Start

1. Install dependencies:
   npm install
2. Copy environment file:
   copy .env.example .env
3. Run development server:
   npm run dev

## Implemented In This Phase

- API foundation under `/api`
- Auth flow with JWT access and refresh tokens
- Role guard middleware (`seeker`, `company`, `admin`)
- Read-only jobs endpoints used by seeker UI
- Seeker routes for applications, saved jobs, and profile management
- Standardized API responses and error handling

## Routes (Current)

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/password`
- `PUT /api/auth/settings`
- `GET /api/jobs`
- `GET /api/jobs/:jobId`
- `GET /api/jobs/recommendations`
- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/:applicationId`
- `DELETE /api/applications/:applicationId`
- `GET /api/saved-jobs`
- `POST /api/saved-jobs/:jobId`
- `DELETE /api/saved-jobs/:jobId`
- `GET /api/seeker/profile`
- `PUT /api/seeker/profile`
- `POST /api/seeker/profile/avatar`
- `POST /api/seeker/profile/resume`
- `DELETE /api/seeker/profile/resume`
- `POST /api/seeker/profile/experience`
- `PUT /api/seeker/profile/experience/:experienceId`
- `DELETE /api/seeker/profile/experience/:experienceId`
