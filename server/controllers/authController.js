const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Generate token
    const token = generateToken(user._id)

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({
      message: error.message,
    })
  }
}

// @desc    Register admin (one time setup)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({
        message: 'Email already exists',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Register error:', error.message)
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = { loginUser, registerUser }