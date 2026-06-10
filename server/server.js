require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: 'https://blog-website-ecru-mu.vercel.app',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

// Test route
app.get('/', (req, res) => {
  res.send('Blog API is running...')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Loaded ✅' : 'Missing ❌'}`)
  console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'Loaded ✅' : 'Missing ❌'}`)
  console.log(`IMAGEKIT: ${process.env.IMAGEKIT_PRIVATE_KEY ? 'Loaded ✅' : 'Missing ❌'}`)
})