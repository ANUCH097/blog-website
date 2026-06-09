import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import moment from 'moment'

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">

      {/* Post Image */}
      {post.image?.url ? (
        <img
          src={post.image.url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      {/* Post Content */}
      <div className="p-5">

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h2>

        {/* Content Preview */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
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

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Calendar size={14} />
            <span>{moment(post.createdAt).format('MMM DD, YYYY')}</span>
          </div>
          <Link
            to={`/post/${post._id}`}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Read More
          </Link>
        </div>

      </div>
    </div>
  )
}

export default PostCard