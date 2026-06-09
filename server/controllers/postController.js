const Post = require('../models/Post')
const ImageKit = require('imagekit')

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

// @desc    Get all posts (public)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })

    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @desc    Get single post (public)
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @desc    Create post (admin)
// @route   POST /api/posts
// @access  Admin
const createPost = async (req, res) => {
  try {
    const { title, content, tags, isPublished } = req.body

    let image = { url: '', fileId: '' }

    // Upload image to ImageKit if provided
    if (req.file) {
      const uploadResponse = await new Promise((resolve, reject) => {
        imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: '/blog',
        }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
      image = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      }
    }

    const post = await Post.create({
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image,
      isPublished: isPublished === 'true' ? true : false,
      author: req.user._id,
    })

    return res.status(201).json(post)
  } catch (error) {
    console.error('Create post error FULL:', error)
    return res.status(500).json({ message: error.message })
  }
}

// @desc    Update post (admin)
// @route   PUT /api/posts/:id
// @access  Admin
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const { title, content, tags, isPublished } = req.body

    let image = post.image

    // Upload new image if provided
    if (req.file) {
      // Delete old image from ImageKit
      if (post.image.fileId) {
        await new Promise((resolve, reject) => {
          imagekit.deleteFile(post.image.fileId, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        })
      }

      const uploadResponse = await new Promise((resolve, reject) => {
        imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: '/blog',
        }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
      image = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      }
    }

    post.title = title || post.title
    post.content = content || post.content
    post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags
    post.image = image
    post.isPublished = isPublished === 'true' ? true : false

    const updatedPost = await post.save()

    return res.status(200).json(updatedPost)
  } catch (error) {
    console.error('Update post error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

// @desc    Delete post (admin)
// @route   DELETE /api/posts/:id
// @access  Admin
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Delete image from ImageKit
    if (post.image.fileId) {
      await new Promise((resolve, reject) => {
        imagekit.deleteFile(post.image.fileId, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
    }

    await Post.findByIdAndDelete(req.params.id)

    return res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { getPosts, getPost, createPost, updatePost, deletePost }