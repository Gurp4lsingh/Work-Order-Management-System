# WorkOrderHub (TPS-Aligned Lean Work Order Management)

WorkOrderHub is a lean digital workflow system for internal operational requests (Facilities, IT, Security, HR). It applies TPS principles through software controls:

- Standard Work: strict validated input model
- Jidoka (quality at source): invalid payloads and transitions rejected immediately
- Flow Control: lifecycle transition rules enforced in service layer
- Pull System: only authorized + valid requests enter workflow
- Visual Management: dashboard and filtered list views
- Andon: centralized structured error responses with `requestId`

## Repository Structure

- `backend/` Express.js REST API with in-memory store
- `frontend/` Next.js app (pages router)
- `postman/` API collection
- `templates/` CSV sample

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# set API_KEY (and optionally CORS_ORIGIN)
npm run dev
```

Default port: `3001`

## Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_KEY to match backend API_KEY
npm run dev
```

Frontend points to `http://localhost:3001` by default.

Quick connectivity check:

```bash
curl http://localhost:3001/health
```

If this fails, start/restart backend before opening frontend pages.

## API Summary

- `GET /health`
- `GET /api/workorders`
- `GET /api/workorders/:id`
- `POST /api/workorders`
- `PUT /api/workorders/:id`
- `PATCH /api/workorders/:id/status`
- `DELETE /api/workorders/:id`
- `POST /api/workorders/bulk-upload`
- `POST /api/workorders/data-transfer` (alias)

All `/api/**` routes require header: `x-api-key`
`/health` does not require API key.

## Lifecycle Rules

- `NEW -> IN_PROGRESS`
- `IN_PROGRESS -> BLOCKED | DONE`
- `BLOCKED -> IN_PROGRESS`
- `DONE -> no transitions`

Invalid transitions return `409 INVALID_TRANSITION`.

## Response Contract

Success:

```json
{
  "requestId": "uuid",
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "requestId": "uuid",
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description",
    "details": []
  }
}
```

Example `/health` data payload:

```json
{
  "requestId": "uuid",
  "success": true,
  "data": {
    "status": "ok",
    "time": "ISO"
  }
}
```

## CSV Bulk Upload

Endpoint: `POST /api/workorders/data-transfer` (`multipart/form-data`, field: `file`)

Accepted file:
- `.csv` only
- max size: 2MB

Required headers (case-insensitive):
- `title`
- `description`
- `department` (`FACILITIES|IT|SECURITY|HR`)
- `priority` (`LOW|MEDIUM|HIGH`)
- `requesterName`

Optional:
- `assignee`

Processing strategy: `PARTIAL_ACCEPTANCE`
- valid rows are created
- invalid rows are rejected
- response includes row-level errors

See sample: [`templates/workorders.csv`](templates/workorders.csv)
Invalid sample for testing: [`templates/workorders-invalid.csv`](templates/workorders-invalid.csv)

## Frontend Pages

- `/dashboard`
- `/workorders`
- `/workorders/create`
- `/workorders/[id]`
- `/data-transfer` (`/bulk-upload` redirects here)
- `/help`

## Error Codes

- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `NOT_FOUND` (404)
- `INVALID_TRANSITION` (409)
- `CONFLICT` (409)
- `PAYLOAD_TOO_LARGE` (413)
- `UNSUPPORTED_MEDIA_TYPE` (415)
- `INTERNAL_ERROR` (500)

## Testing

Use the Postman collection in `postman/WorkOrderHub.postman_collection.json`.
It includes:
- unauthorized example
- create valid/invalid
- status transition valid/invalid
- list filters/pagination
- bulk upload valid/invalid/wrong type

## Screenshots

Add required screenshots under `docs/screenshots/`:
- API calls
- bulk upload results
- error handling examples
