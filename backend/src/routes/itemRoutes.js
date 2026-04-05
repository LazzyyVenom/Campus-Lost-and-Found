const express = require('express');
const {
  listItems,
  createItem,
  getItemById,
  claimItem,
  resolveItem,
  deleteItem,
  getDashboard,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listItems);
router.get('/dashboard', protect, getDashboard);
router.post('/', protect, createItem);
router.get('/:id', getItemById);
router.post('/:id/claim', protect, claimItem);
router.post('/:id/resolve', protect, resolveItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
