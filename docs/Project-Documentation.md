# Lost and Found System Documentation

## 1. Project Title

Campus Lost and Found System

## 2. Project Objective

The objective of this project is to provide a centralized digital platform where students can report lost items, publish found items, and recover belongings quickly and securely.

## 3. Problem Statement

In college environments, students frequently lose important items such as ID cards, wallets, chargers, and keys. Recovery through informal messaging is unreliable. This system solves that issue by creating a single structured platform for listing, searching, claiming, and resolving lost-and-found cases.

## 4. Technology Stack

- Backend: Node.js, Express.js
- Frontend: EJS templates, HTML5, CSS3
- Database: SQLite (better-sqlite3)
- Authentication: express-session, bcryptjs
- Configuration: dotenv
- Utilities: method-override

## 5. Architecture Type

Monolithic full-stack web application with server-side rendering.

## 6. Core Functional Modules

1. User Authentication
- Signup and Login
- Password hashing with bcrypt
- Forgot password and reset password flow
- Password visibility toggle for better usability

2. Lost and Found Listings
- Create item listing
- Browse active listings
- View detailed item information
- Claim available items
- Mark item as resolved
- Delete own listings

3. Role-Based Access Control
- Normal users can use listing features
- Admin-only access to login audit details

4. Login Audit Module
- Tracks successful and failed login attempts
- Stores attempted email, user mapping, IP, user-agent, and timestamp

## 7. Database Tables

- users
- items
- login_logs
- password_reset_tokens

## 8. Security Features

- Passwords stored as hash, not plain text
- Session-based authentication
- Admin route protection using DB-based role check
- Reset code expiry and one-time usage behavior

## 9. Real-World Readiness

- Responsive interface for mobile and desktop
- Search and filter on listings (keyword, category, status)
- Clear status lifecycle: OPEN, CLAIMED, RESOLVED
- Designed for daily student usage

## 10. Setup Instructions

1. Install dependencies:

npm install

2. Add environment variables in .env:

PORT=3000
SESSION_SECRET=your_secret
ADMIN_EMAIL=your_admin_email

3. Run application:

npm start

4. Open:

http://localhost:3000

## 11. Deployment Recommendation

This is a server-side Node.js + SQLite app, so Netlify is not ideal for full deployment.

Recommended platforms:
- Render (best for this project)
- Railway
- VPS (DigitalOcean, AWS EC2)

If you need SQLite persistence, use a disk/persistent volume. For scalable production, migrate to PostgreSQL.

## 12. Conclusion

The Campus Lost and Found System provides a practical, secure, and user-friendly solution for managing lost-and-found operations in college. It improves recovery speed, transparency, and accountability for daily use.
