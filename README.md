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

3. Create frontend env file:

```bash
cp frontend/.env.example frontend/.env
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
