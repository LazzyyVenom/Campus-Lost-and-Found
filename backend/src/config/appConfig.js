const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'very-secret-college-project-key';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@college.edu').toLowerCase();

module.exports = {
  PORT,
  SESSION_SECRET,
  ADMIN_EMAIL,
};
