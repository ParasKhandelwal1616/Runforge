Webhooks:
1. POST /webhooks/github

Failures:
2. GET /api/failures/:repo
3. GET /api/failures/:repo/:failureId

Analyses:
4. GET /api/analyses/:repo
5. GET /api/analyses/:failureId

Patterns:
6. GET /api/patterns/:repo

Users:
7. GET /api/user/profile

Installations:
8. GET /api/installations

DELETE /api/installations/:installationId


PATCH /api/installations/:installationId/settings


PATCH /api/failures/:repo/:failureId/resolve