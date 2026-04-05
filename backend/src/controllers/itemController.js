const Item = require('../models/Item');

function buildFilters(query) {
  const filters = {};

  const searchText = (query.q || '').trim();
  const category = (query.category || '').trim();
  const status = (query.status || 'OPEN').trim().toUpperCase();

  if (status !== 'ALL') {
    filters.status = status;
  }

  if (category) {
    filters.category = category;
  }

  if (searchText) {
    filters.$or = [
      { title: { $regex: searchText, $options: 'i' } },
      { description: { $regex: searchText, $options: 'i' } },
      { locationLost: { $regex: searchText, $options: 'i' } },
      { locationFound: { $regex: searchText, $options: 'i' } },
    ];
  }

  return {
    filters,
    status,
    category,
    searchText,
  };
}

async function listItems(req, res) {
  const { filters, status, category, searchText } = buildFilters(req.query);

  const items = await Item.find(filters)
    .populate('ownerId', 'name email')
    .populate('claimedBy', 'name email')
    .sort({ createdAt: -1 });

  const categories = await Item.distinct('category');

  const [totalUsers, totalListings, openListings, resolvedListings] = await Promise.all([
    req.models.User.countDocuments(),
    Item.countDocuments(),
    Item.countDocuments({ status: 'OPEN' }),
    Item.countDocuments({ status: 'RESOLVED' }),
  ]);

  return res.json({
    items,
    categories,
    stats: {
      totalUsers,
      totalListings,
      openListings,
      resolvedListings,
    },
    filters: {
      q: searchText,
      category,
      status,
    },
  });
}

async function createItem(req, res) {
  const { title, description, category, locationLost, locationFound, contactInfo } = req.body;

  if (!title || !description || !category || !contactInfo) {
    return res.status(400).json({ message: 'Title, description, category and contact info are required.' });
  }

  const item = await Item.create({
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    locationLost: (locationLost || '').trim(),
    locationFound: (locationFound || '').trim(),
    contactInfo: contactInfo.trim(),
    ownerId: req.user._id,
  });

  return res.status(201).json({ message: 'Item created successfully.', item });
}

async function getItemById(req, res) {
  const item = await Item.findById(req.params.id)
    .populate('ownerId', 'name email')
    .populate('claimedBy', 'name email');

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  return res.json({ item });
}

async function claimItem(req, res) {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (String(item.ownerId) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot claim your own item.' });
  }

  if (item.status !== 'OPEN') {
    return res.status(400).json({ message: 'This item is not open for claim.' });
  }

  item.status = 'CLAIMED';
  item.claimedBy = req.user._id;
  await item.save();

  return res.json({ message: 'Claim request sent.', item });
}

async function resolveItem(req, res) {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (String(item.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only owner can resolve this item.' });
  }

  item.status = 'RESOLVED';
  await item.save();

  return res.json({ message: 'Item marked as resolved.', item });
}

async function deleteItem(req, res) {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (String(item.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only owner can delete this item.' });
  }

  await item.deleteOne();

  return res.json({ message: 'Item deleted successfully.' });
}

async function getDashboard(req, res) {
  const myItems = await Item.find({ ownerId: req.user._id })
    .populate('claimedBy', 'name email')
    .sort({ createdAt: -1 });

  const claimedItems = await Item.find({ claimedBy: req.user._id })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });

  return res.json({ myItems, claimedItems });
}

module.exports = {
  listItems,
  createItem,
  getItemById,
  claimItem,
  resolveItem,
  deleteItem,
  getDashboard,
};
