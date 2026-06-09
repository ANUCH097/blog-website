const express = require('express')
const router = express.Router()
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController')
const { protect, adminOnly } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public routes
router.get('/', getPosts)
router.get('/:id', getPost)

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createPost)
router.put('/:id', protect, adminOnly, upload.single('image'), updatePost)
router.delete('/:id', protect, adminOnly, deletePost)

module.exports = router