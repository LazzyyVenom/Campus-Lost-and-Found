const express = require('express');

const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { setFlash } = require('../utils/flash');

const router = express.Router();

function getPlatformStats() {
  return db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM items) AS total_listings,
        (SELECT COUNT(*) FROM items WHERE status = 'OPEN') AS open_listings,
        (SELECT COUNT(*) FROM items WHERE status = 'RESOLVED') AS resolved_listings`
    )
    .get();
}

router.get('/', (req, res) => {
  const filters = {
    q: (req.query.q || '').trim(),
    category: (req.query.category || '').trim(),
    status: (req.query.status || 'OPEN').trim().toUpperCase(),
  };

  const allowedStatuses = ['OPEN', 'CLAIMED', 'RESOLVED', 'ALL'];
  if (!allowedStatuses.includes(filters.status)) {
    filters.status = 'OPEN';
  }

  const conditions = [];
  const params = [];

  if (filters.status !== 'ALL') {
    conditions.push('items.status = ?');
    params.push(filters.status);
  }

  if (filters.category) {
    conditions.push('items.category = ?');
    params.push(filters.category);
  }

  if (filters.q) {
    conditions.push(
      `(items.title LIKE ?
        OR items.description LIKE ?
        OR IFNULL(items.location_lost, '') LIKE ?
        OR IFNULL(items.location_found, '') LIKE ?)`
    );
    const queryValue = `%${filters.q}%`;
    params.push(queryValue, queryValue, queryValue, queryValue);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const items = db
    .prepare(
      `SELECT items.*, users.name AS owner_name
       FROM items
       JOIN users ON users.id = items.owner_id
       ${whereClause}
       ORDER BY items.created_at DESC`
    )
    .all(...params);

  const categories = db
    .prepare(
      `SELECT DISTINCT category
       FROM items
       WHERE category IS NOT NULL AND category != ''
       ORDER BY category ASC`
    )
    .all();

  const stats = getPlatformStats();

  res.render('home', {
    title: 'Lost and Found',
    items,
    stats,
    filters,
    categories,
  });
});

function renderAboutPage(req, res) {
  const stats = getPlatformStats();

  res.render('about', {
    title: 'Why This Platform Exists',
    stats,
  });
}

router.get('/about', renderAboutPage);
router.get('/why-this-site', renderAboutPage);
router.get('/whythissite', renderAboutPage);

router.get('/dashboard', requireAuth, (req, res) => {
  const myItems = db
    .prepare(
      `SELECT items.*, claimant.name AS claimant_name
       FROM items
       LEFT JOIN users AS claimant ON claimant.id = items.claimed_by
       WHERE owner_id = ?
       ORDER BY items.created_at DESC`
    )
    .all(req.session.user.id);

  const claimedItems = db
    .prepare(
      `SELECT items.*, owner.name AS owner_name
       FROM items
       JOIN users AS owner ON owner.id = items.owner_id
       WHERE claimed_by = ?
       ORDER BY items.created_at DESC`
    )
    .all(req.session.user.id);

  res.render('dashboard', {
    title: 'Dashboard',
    myItems,
    claimedItems,
  });
});

router.get('/items/new', requireAuth, (req, res) => {
  res.render('new-item', { title: 'Add New Item' });
});

router.post('/items', requireAuth, (req, res) => {
  const {
    title,
    description,
    category,
    locationLost,
    locationFound,
    contactInfo,
  } = req.body;

  if (!title || !description || !category || !contactInfo) {
    setFlash(req, 'error', 'Title, description, category, and contact info are required.');
    return res.redirect('/items/new');
  }

  db.prepare(
    `INSERT INTO items (
      title,
      description,
      category,
      location_lost,
      location_found,
      contact_info,
      owner_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    title.trim(),
    description.trim(),
    category.trim(),
    locationLost?.trim() || null,
    locationFound?.trim() || null,
    contactInfo.trim(),
    req.session.user.id
  );

  setFlash(req, 'success', 'Item posted successfully.');
  return res.redirect('/dashboard');
});

router.get('/items/:id', (req, res) => {
  const item = db
    .prepare(
      `SELECT items.*, users.name AS owner_name, claimant.name AS claimant_name
       FROM items
       JOIN users ON users.id = items.owner_id
       LEFT JOIN users AS claimant ON claimant.id = items.claimed_by
       WHERE items.id = ?`
    )
    .get(req.params.id);

  if (!item) {
    return res.status(404).send('Item not found');
  }

  res.render('item', { title: item.title, item });
});

router.post('/items/:id/claim', requireAuth, (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);

  if (!item) {
    setFlash(req, 'error', 'Item not found.');
    return res.redirect('/');
  }

  if (item.owner_id === req.session.user.id) {
    setFlash(req, 'error', 'You cannot claim your own item.');
    return res.redirect(`/items/${item.id}`);
  }

  if (item.status !== 'OPEN') {
    setFlash(req, 'error', 'This item is not open for claiming.');
    return res.redirect(`/items/${item.id}`);
  }

  db.prepare('UPDATE items SET status = ?, claimed_by = ? WHERE id = ?').run(
    'CLAIMED',
    req.session.user.id,
    item.id
  );

  setFlash(req, 'success', 'Claim request sent. Please contact the owner.');
  return res.redirect('/dashboard');
});

router.post('/items/:id/resolve', requireAuth, (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);

  if (!item || item.owner_id !== req.session.user.id) {
    setFlash(req, 'error', 'Action not allowed.');
    return res.redirect('/dashboard');
  }

  db.prepare('UPDATE items SET status = ? WHERE id = ?').run('RESOLVED', item.id);
  setFlash(req, 'success', 'Item marked as resolved.');
  return res.redirect('/dashboard');
});

router.post('/items/:id/delete', requireAuth, (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);

  if (!item || item.owner_id !== req.session.user.id) {
    setFlash(req, 'error', 'Action not allowed.');
    return res.redirect('/dashboard');
  }

  db.prepare('DELETE FROM items WHERE id = ?').run(item.id);
  setFlash(req, 'success', 'Item deleted successfully.');
  return res.redirect('/dashboard');
});

module.exports = router;
