require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const { PORT, SESSION_SECRET, ADMIN_EMAIL } = require('./config/appConfig');

const db = require('./db');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const { consumeFlash } = require('./utils/flash');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

db.prepare('UPDATE users SET is_admin = 1 WHERE email = ?')
  .run(ADMIN_EMAIL);

app.use((req, res, next) => {
  if (req.session.user) {
    const user = db
      .prepare('SELECT is_admin FROM users WHERE id = ?')
      .get(req.session.user.id);

    req.session.user.isAdmin = !!(user && user.is_admin === 1);
  }

  res.locals.currentUser = req.session.user || null;
  res.locals.flash = consumeFlash(req);
  next();
});

app.use(authRoutes);
app.use(itemRoutes);
app.use(adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Lost & Found running on http://localhost:${PORT}`);
});
