# Task Manager App

## Time spent
- Backend: 90 minutes
- Frontend: 120 minutes
- Styling: 30 minutes

## Backend Setup
1. cd backend
2. npm install
3. npm start (runs on port 4000)

## Frontend Setup
1. cd frontend
2. npm install
3. npm start (runs on port 3000)

Start backend first, then frontend.

The React app calls `http://localhost:4000/api/tasks` (CORS is enabled on the server).

## API Endpoints

Base: `http://localhost:4000`

Task shape:
```
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "createdAt": "2026-11-10T08:15:00.000Z",
  "priority": "medium"
}
```

priority is `low`, `medium` or `high`.

### GET /api/tasks
Returns all tasks.

```
200
[ { "id": 1, "title": "Buy groceries", ... } ]
```

### POST /api/tasks
```
{
  "title": "Buy milk",
  "description": "from the store",
  "priority": "low"
}
```

```
201
{
  "id": 5,
  "title": "Buy milk",
  "description": "from the store",
  "completed": false,
  "createdAt": "2026-11-17T17:00:00.000Z",
  "priority": "low"
}
```

Errors:
```
400 { "error": "Title is required" }
400 { "error": "Title is too long" }
400 { "error": "Description must be a string" }
400 { "error": "Priority must be low, medium or high" }
```

### PUT /api/tasks/:id
Send any of title, description, priority, completed.

```
200 { "id": 5, "title": "Buy milk tonight", ... }
400 { "error": "Invalid task id" }
400 { "error": "Nothing to update" }
404 { "error": "Task not found" }
```

`/api/tasks/1.5` and `/api/tasks/abc` return 400.

### DELETE /api/tasks/:id
```
200 { "message": "Task deleted", "task": { ... } }
400 { "error": "Invalid task id" }
404 { "error": "Task not found" }
```

### PATCH /api/tasks/:id/toggle
Flips completed.

```
200 { "id": 5, "completed": true, ... }
400 { "error": "Invalid task id" }
404 { "error": "Task not found" }
```

Unknown url:
```
404 { "error": "Route not found" }
```

## Assumptions
- Tasks are stored in an array on the server. Restarting the backend resets them.
- Filter / search / sort run on the frontend.
- Delete uses `window.confirm`.
- The carousel clones the first and last slide so next/prev can loop. No carousel library.
- `frontend/src/App.js` renders `frontend/src/main-app-layout/App.js` because the assignment asked for the main app component in that folder.
- Theme, filter, search and sort are saved in localStorage.

## Extra
Search, sort, dark/light theme, localStorage for those settings.

Screenshots are in the `screenshots` folder.
