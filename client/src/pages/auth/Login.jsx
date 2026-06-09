/* eslint-disable no-undef */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axios'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('All fields are required!')
      return
    }

    try {
      setLoading(true)
      const { data } = await axiosInstance.post('/api/auth/login', formData)
      dispatch(setCredentials({ user: data.user, token: data.token }))
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to manage your blog
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>
         {/* Setup Link */}
      <p className="text-center text-gray-500 text-sm mt-6">
        First time setup?{' '}
        <Link to="/setup" className="text-blue-600 font-medium hover:underline">
          Create Admin Account
        </Link>
      </p>
      </div>
    </div>
  )
}

export default Login