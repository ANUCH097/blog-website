/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axios'
import PostCard from '../../components/PostCard'
import toast from 'react-hot-toast'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Latest Posts
        </h1>
        <p className="text-gray-500">
          Read our latest articles and tutorials
        </p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">
              No posts yet!
            </h2>
            <p className="text-gray-400 mt-2">
              Check back later for new content
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Home