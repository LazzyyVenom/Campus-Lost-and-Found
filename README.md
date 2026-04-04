# Lost and Found System

A structured full-stack Lost and Found web app for college practical submission.

## Features

- User signup and login
- Forgot password with reset code
- Session-based authentication
- Post lost/found item listings
- View all active listings
- Claim available items
- Dashboard for your posted and claimed items
- Mark items as resolved
- Delete your own listings
- Admin login audit page (see who tried to log in)
- SQLite local database (easy to run)

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
|- public/
|  |- styles.css
|- src/
|  |- config/
|  |  |- appConfig.js
|  |- middleware/
|  |  |- auth.js
|  |- routes/
|  |  |- admin.js
|  |  |- auth.js
|  |  |- items.js
|  |- services/
|  |  |- loginLogService.js
|  |- utils/
|  |  |- flash.js
|  |- app.js
|  |- db.js
|- views/
|  |- partials/
|  |  |- footer.ejs
|  |  |- header.ejs
|  |- admin-login-logs.ejs
|  |- dashboard.ejs
|  |- item.ejs
|  |- login.ejs
|  |- new-item.ejs
|  |- signup.ejs
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
