/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axios'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import moment from 'moment'
import toast from 'react-hot-toast'

const SinglePost = () => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/posts/${id}`)
      setPost(data)
    } catch (error) {
      toast.error('Post not found!')
      navigate('/')
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

  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Post Image */}
        {post.image?.url && (
          <img
            src={post.image.url}
            alt={post.title}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        {/* Post Header */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{moment(post.createdAt).format('MMM DD, YYYY')}</span>
            </div>
            <span>By {post.author?.name}</span>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <Tag size={14} className="text-blue-500" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <hr className="mb-6" />

          {/* Content */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

        </div>
      </div>
    </div>
  )
}

export default SinglePost