# CivicEye - OpenAPI / REST API Documentation

Base URL: `http://localhost:8000/api/v1`

## 1. Authentication Endpoints
- `POST /auth/register`: Register new user (`CITIZEN`, `OFFICER`, `ADMIN`).
- `POST /auth/login`: Login & receive JWT Bearer Access Token.
- `GET /auth/me`: Fetch authenticated user profile.

## 2. Complaint Management Endpoints
- `POST /complaints/check-ai`: Pre-submission AI verification & classification check.
  - Query Params: `image_url`, `description`
  - Returns: `is_genuine_civic_issue`, `predicted_category`, `confidence_percentage`, `predicted_priority`, `recommended_department`.
- `POST /complaints/check-duplicate`: Haversine 30m radius duplicate check.
  - Request Body: `{ "latitude": float, "longitude": float, "category": string }`
  - Returns: `is_duplicate`, `existing_tracking_code`, `distance_meters`.
- `POST /complaints`: Create complaint.
- `GET /complaints`: List complaints with optional filtering (`status`, `category`, `priority`, `department_id`, `citizen_id`).
- `GET /complaints/{tracking_code}`: Get details for specific complaint by tracking code (e.g. `CIV-2026-1001`).
- `PUT /complaints/{complaint_id}/status`: Update status, assign field worker, and upload before/after work photo.
- `POST /complaints/{complaint_id}/feedback`: Submit 1-5 star citizen rating & feedback.

## 3. Analytics & Export Endpoints
- `GET /analytics/dashboard`: Aggregated KPI metrics, monthly trends, department performance, and heatmap spatial coordinates.
- `GET /analytics/export-csv`: Download municipal audit report in CSV format.

## 4. AI Chatbot Endpoints
- `POST /chatbot/query`: Process natural language citizen queries regarding complaint status, ETAs, and emergency helplines.
