# Campus Lost and Found (MERN)

A complete MERN-based lost and found system built in a clean student project style.

## Stack

- MongoDB
- Express.js
- React (Vite)
- Node.js

## Project Structure

```text
Lost and found System/
|- backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- utils/
|  |  |- server.js
|  |- .env.example
|  |- package.json
|- frontend/
|  |- src/
|  |  |- api/
|  |  |- components/
|  |  |- context/
|  |  |- pages/
|  |  |- styles/
|  |  |- App.jsx
|  |  |- main.jsx
|  |- .env.example
|  |- package.json
|  |- index.html
|- package.json
```

## Features

- User signup/login with JWT auth
- Forgot password and reset password (demo code based)
- Post lost/found items
- Search and filter listings
- Claim/resolve/delete flow
- Dashboard for posted and claimed items
- Admin-only login logs
- Clean architecture and readable code

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend env file:

```bash
cp backend/.env.example backend/.env
```

Windows shortcut:

```powershell
notepad backend\.env
```

Then paste:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_lost_found
JWT_SECRET=replace_with_secret
ADMIN_EMAIL=admin@example.com
```

3. Create frontend env file:

```bash
cp frontend/.env.example frontend/.env
```

Windows shortcut:

```powershell
notepad frontend\.env
```

Then paste:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Run backend:

```bash
npm run dev:backend
```

5. Run frontend in another terminal:

```bash
npm run dev:frontend
```

6. Open app:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Deployment Notes

- Frontend can be deployed to Vercel/Netlify
- Backend can be deployed to Render/Railway
- Use MongoDB Atlas for cloud database

## Deploy On Render

This repo now includes a Render blueprint file: [render.yaml](render.yaml).

### Option A: Blueprint (recommended)

1. Push latest code to GitHub.
2. In Render, click New + then Blueprint.
3. Select this GitHub repo.
4. Render will detect [render.yaml](render.yaml) and create two services:
	- `campus-lost-found-api` (Node web service)
	- `campus-lost-found-web` (Static site)

### Set Environment Variables

For backend service `campus-lost-found-api` set:

- `MONGO_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = long random secret string
- `ADMIN_EMAIL` = admin user email (optional)
- `CORS_ORIGIN` = frontend Render URL, e.g. `https://campus-lost-found-web.onrender.com`

For frontend service `campus-lost-found-web` set:

- `VITE_API_BASE_URL` = backend API URL + `/api`, e.g. `https://campus-lost-found-api.onrender.com/api`

### Important Deployment Order

1. Let backend deploy first and copy its URL.
2. Add `VITE_API_BASE_URL` in frontend settings.
3. Redeploy frontend.
4. Add frontend URL to backend `CORS_ORIGIN`.
5. Redeploy backend.

### Health Check

Open:

- `https://<your-backend>.onrender.com/api/health`

Expected response:

```json
{"ok":true,"message":"Campus Lost & Found API running"}
```
