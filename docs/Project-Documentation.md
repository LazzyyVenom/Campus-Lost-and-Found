# Campus Lost and Found System (MERN)

## 1. Project Title

Campus Lost and Found System

## 2. Objective

The goal of this project is to provide one reliable web platform where students can report lost items, post found items, and recover belongings quickly.

## 3. Why This Project

In college, important things like ID cards, wallets, keys, chargers, and notebooks are often lost. Most recovery depends on random friend groups and luck. This project solves that by creating a structured platform with clear records.

## 4. Stack Used (MERN)

- MongoDB: Database for users, items, and logs
- Express.js: REST API layer
- React + Vite: Frontend user interface
- Node.js: Backend runtime

## 5. Additional Libraries

### Backend
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon

### Frontend
- react-router-dom
- axios

## 6. Folder Structure

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
|- package.json
```

## 7. Main Features

1. Authentication
- Signup
- Login
- Forgot password
- Reset password
- JWT-based protected routes

2. Item Management
- Create lost/found listing
- Search and filter listings
- Open item details
- Claim item
- Resolve item
- Delete own item

3. Dashboard
- View your posted items
- View your claimed items

4. Admin Module
- Admin-only login logs
- Access-protected admin routes

## 8. Security Design

- Password stored as hash using bcrypt
- JWT token validation on protected API routes
- Admin-only middleware for audit endpoints
- Login attempts tracked in database

## 9. API Summary

### Auth Routes
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Item Routes
- GET /api/items
- GET /api/items/dashboard
- POST /api/items
- GET /api/items/:id
- POST /api/items/:id/claim
- POST /api/items/:id/resolve
- DELETE /api/items/:id

### Admin Routes
- GET /api/admin/login-logs
- GET /api/admin/users

## 10. How to Run

1. Install everything:

npm run install:all

2. Set backend env:

Do not type these lines in PowerShell. Create a file named `backend/.env` instead.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_lost_found
JWT_SECRET=replace_with_secret
ADMIN_EMAIL=admin@example.com
```

Windows shortcut:

```powershell
notepad backend\.env
```

3. Set frontend env:

Create a file named `frontend/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Windows shortcut:

```powershell
notepad frontend\.env
```

4. Run backend:

npm run dev:backend

5. Run frontend:

npm run dev:frontend

6. Open app:

http://localhost:5173

## 11. Conclusion

This MERN-based Campus Lost and Found System is a practical and clean full-stack project that can be used by students daily and is suitable for college project submission.
