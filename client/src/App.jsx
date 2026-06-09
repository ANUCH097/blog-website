import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Home from './pages/public/Home'
import SinglePost from './pages/public/SinglePost'
import Dashboard from './pages/admin/Dashboard'
import CreatePost from './pages/admin/CreatePost'
import EditPost from './pages/admin/EditPost'
import Setup from './pages/auth/Setup'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/login" element={<Login />} />
        {/* Add this route */}
        <Route path="/setup" element={<Setup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App