/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axios'
import toast from 'react-hot-toast'
import { Image, X } from 'lucide-react'

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isPublished: 'true',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/posts/${id}`)
      setFormData({
        title: data.title,
        content: data.content,
        tags: data.tags.join(', '),
        isPublished: data.isPublished ? 'true' : 'false',
      })
      if (data.image?.url) {
        setImagePreview(data.image.url)
      }
    } catch (error) {
      toast.error('Failed to fetch post!')
      navigate('/admin')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required!')
      return
    }

    try {
      setLoading(true)

      const postData = new FormData()
      postData.append('title', formData.title)
      postData.append('content', formData.content)
      postData.append('tags', formData.tags)
      postData.append('isPublished', formData.isPublished)
      if (image) {
        postData.append('image', image)
      }

      await axiosInstance.put(`/api/posts/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Post updated successfully!')
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post!')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Edit Post
        </h1>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Content
              </label>
              <textarea
                name="content"
                placeholder="Write your post content here..."
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="react, nodejs, javascript"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Cover Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <Image size={24} className="text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <select
                name="isPublished"
                value={formData.isPublished}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPost