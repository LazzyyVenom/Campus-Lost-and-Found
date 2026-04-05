const express = require('express');
const {
  listItems,
  createItem,
  updateItem,
  getItemById,
  claimItem,
  markReturned,
  deleteItem,
  getDashboard,
  getMyPosts,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listItems);
router.get('/dashboard', protect, getDashboard);
router.get('/my-posts', protect, getMyPosts);
router.post('/', protect, createItem);
router.get('/:id', getItemById);
router.put('/:id', protect, updateItem);
router.post('/:id/claim', protect, claimItem);
router.post('/:id/mark-returned', protect, markReturned);
router.delete('/:id', protect, deleteItem);

module.exports = router;
