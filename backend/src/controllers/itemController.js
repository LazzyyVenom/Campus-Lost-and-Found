const Item = require('../models/Item');
const User = require('../models/User');

function buildFilters(query) {
  const filters = {};

  const searchText = (query.q || '').trim();
  const category = (query.category || '').trim();
  const itemType = (query.itemType || '').trim().toUpperCase();
  const status = (query.status || 'ALL').trim().toUpperCase();

  if (itemType && ['LOST', 'FOUND'].includes(itemType)) {
    filters.itemType = itemType;
  }

  if (status !== 'ALL' && ['LOST', 'FOUND', 'RETURNED'].includes(status)) {
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
    searchText,
    category,
    itemType,
    status,
  };
}

async function listItems(req, res) {
  const { filters, searchText, category, itemType, status } = buildFilters(req.query);
  const latest = Number(req.query.latest || 0);

  const query = Item.find(filters)
    .populate('ownerId', 'name email')
    .populate('claimedBy', 'name email')
    .sort({ createdAt: -1 });

  if (latest > 0) {
    query.limit(latest);
  }

  const items = await query;
  const categories = await Item.distinct('category');

  const [totalUsers, totalListings, lostCount, foundCount, returnedCount] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments(),
    Item.countDocuments({ status: 'LOST' }),
    Item.countDocuments({ status: 'FOUND' }),
    Item.countDocuments({ status: 'RETURNED' }),
  ]);

  return res.json({
    items,
    categories,
    stats: {
      totalUsers,
      totalListings,
      lostCount,
      foundCount,
      returnedCount,
    },
    filters: {
      q: searchText,
      category,
      itemType,
      status,
    },
  });
}

async function createItem(req, res) {
  const {
    itemType,
    title,
    description,
    category,
    incidentDate,
    locationLost,
    locationFound,
    contactInfo,
    imageData,
  } = req.body;

  if (!itemType || !title || !description || !category || !incidentDate || !contactInfo) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  if (!['LOST', 'FOUND'].includes(String(itemType).toUpperCase())) {
    return res.status(400).json({ message: 'Item type must be LOST or FOUND.' });
  }

  const normalizedType = String(itemType).toUpperCase();

  const item = await Item.create({
    itemType: normalizedType,
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    incidentDate,
    locationLost: (locationLost || '').trim(),
    locationFound: (locationFound || '').trim(),
    contactInfo: contactInfo.trim(),
    imageData: imageData || '',
    ownerId: req.user._id,
    status: normalizedType,
  });

  return res.status(201).json({ message: 'Item posted successfully.', item });
}

async function updateItem(req, res) {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (String(item.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only owner can edit this item.' });
  }

  const allowedFields = [
    'title',
    'description',
    'category',
    'incidentDate',
    'locationLost',
    'locationFound',
    'contactInfo',
    'imageData',
  ];

  allowedFields.forEach((field) => {
    if (typeof req.body[field] !== 'undefined') {
      item[field] = req.body[field];
    }
  });

  await item.save();

  return res.json({ message: 'Item updated successfully.', item });
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

  item.claimedBy = req.user._id;
  await item.save();

  return res.json({ message: 'Owner contact is now available for this item.', item });
}

async function markReturned(req, res) {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (String(item.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only owner can mark this item as returned.' });
  }

  item.status = 'RETURNED';
  await item.save();

  return res.json({ message: 'Item status updated to RETURNED.', item });
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

async function getMyPosts(req, res) {
  const posts = await Item.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  return res.json({ posts });
}

module.exports = {
  listItems,
  createItem,
  updateItem,
  getItemById,
  claimItem,
  markReturned,
  deleteItem,
  getDashboard,
  getMyPosts,
};
