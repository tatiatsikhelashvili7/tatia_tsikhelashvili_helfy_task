# Task Manager App

## Backend Setup
1. cd backend
2. npm install
3. npm start (runs on port 4000)

## Frontend Setup
1. cd frontend
2. npm install
3. npm start (runs on port 3000)

Start backend first, then frontend.

## API Endpoints
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/toggle

POST body:
```
{
  "title": "Buy milk",
  "description": "from the store",
  "priority": "low"
}
```

priority can be low, medium or high.

## Assumptions
- Tasks are stored in an array on the server. Restarting the backend resets them.
- Filter (all / pending / completed) is done on the frontend.
- Delete uses the browser confirm dialog.
- The carousel clones the first and last slide so next/prev can loop. No carousel library.

## Time spent
- Backend API: 90 minutes
- Frontend core features: 90 minutes
- Styling: 30 minutes
- Testing: 30 minutes
