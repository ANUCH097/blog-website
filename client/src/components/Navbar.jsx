/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { LogOut, PenSquare, LayoutDashboard } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

      {/* Left side - Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        My Blog
      </Link>

      {/* Right side - Links */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              to="/admin/create"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <PenSquare size={18} />
              New Post
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Admin Login
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar