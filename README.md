# Lost and Found System

This is a college project made to solve real lost-and-found issues inside campus.

## Features

- User signup and login
- Forgot password with reset code
- Session-based authentication
- Create lost/found listings
- Search and filter listings
- Claim available items
- Dashboard for posted and claimed items
- Mark item as resolved
- Delete your own listing
- Admin-only login logs page
- SQLite local database

## Tech Stack

- Node.js
- Express.js
- EJS templates
- SQLite (`better-sqlite3`)
- `express-session`
- `bcryptjs`
- `dotenv`

## Project Structure

```text
Lost and found System/
|- backend/
|  |- lostfound.db
|  |- src/
|  |  |- config/
|  |  |  |- appConfig.js
|  |  |- middleware/
|  |  |  |- auth.js
|  |  |- routes/
|  |  |  |- admin.js
|  |  |  |- auth.js
|  |  |  |- items.js
|  |  |- services/
|  |  |  |- loginLogService.js
|  |  |- utils/
|  |  |  |- flash.js
|  |  |- app.js
|  |  |- db.js
|- frontend/
|  |- public/
|  |  |- styles.css
|  |- views/
|  |  |- partials/
|  |  |  |- footer.ejs
|  |  |  |- header.ejs
|  |  |- admin-login-logs.ejs
|  |  |- dashboard.ejs
|  |  |- item.ejs
|  |  |- login.ejs
|  |  |- new-item.ejs
|  |  |- signup.ejs
|- .env.example
|- package.json
|- README.md
```

## Run the project

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env` from `.env.example` and set values.
3. Start the app:
   ```bash
   npm start
   ```
4. Open:
   ```
   http://localhost:3000
   ```

## Environment Variables

Use `.env` with these keys:

- `PORT=3000`
- `SESSION_SECRET=replace_with_random_secret`
- `ADMIN_EMAIL=admin@college.edu`

Who can view login logs:

- Login with the same email as `ADMIN_EMAIL`.
- Open `/admin/login-logs`.
- You can see login success/failure, time, IP address, and user agent.

Password recovery flow:

- Open `/forgot-password`.
- Enter registered email.
- Use the generated 6-digit reset code.
- Open `/reset-password` and set a new password.

## For development

```bash
npm run dev
```

## Suggested viva/demo flow

1. Sign up with a new user.
2. Create one lost/found listing.
3. Log out and sign up with a second user.
4. Claim the first listing.
5. Try one wrong password login to generate failure logs.
6. Log in as admin and show `/admin/login-logs` in viva.
7. Log in back as owner and mark item resolved.
