/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axios'
import { PenSquare, Trash2, Edit, Plus } from 'lucide-react'
import moment from 'moment'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await axiosInstance.get('/api/posts')
      setPosts(data)
    } catch (error) {
      toast.error('Failed to fetch posts!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axiosInstance.delete(`/api/posts/${id}`)
      toast.success('Post deleted successfully!')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your blog posts
            </p>
          </div>
          <Link
            to="/admin/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <PenSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-400">
                No posts yet!
              </h2>
              <p className="text-gray-400 mt-2 mb-6">
                Create your first blog post
              </p>
              <Link
                to="/admin/create"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Post
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Title</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Tags</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Date</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 line-clamp-1">
                        {post.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {post.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {moment(post.createdAt).format('MMM DD, YYYY')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.isPublished
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/edit/${post._id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard