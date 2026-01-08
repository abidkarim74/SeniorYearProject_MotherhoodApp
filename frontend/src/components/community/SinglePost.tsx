import { Heart, MessageCircle, Share2, MoreVertical, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PostType } from "../../interfaces/CommunityInterfaces";


interface SinglePostProps {
  post: {
    id: string;
    user: {
      firstname: string;
      lastname: string;
      username: string;
      profile_pic: string;
    };
    title: string;
    tags: string[];
    images: string[];
    description: string;
    post_type: PostType;
    like_count: number;
    created_at: string;
  };
  onLike: (postId: string) => void;
  getPostTypeStyle: (type: PostType) => {
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode;
  };
  formatDate: (dateString: string) => string;
}

const SinglePost = ({ post, onLike, getPostTypeStyle, formatDate }: SinglePostProps) => {
  const navigate = useNavigate();
  const postTypeStyle = getPostTypeStyle(post.post_type);

  const handleContainerClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(post.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle menu click logic
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle comment logic
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle share logic
  };

  return (
    <div 
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={handleContainerClick}
    >
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.user?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt={post.user?.firstname}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">
                  {post.user?.firstname} {post.user?.lastname}
                </h4>
                <span className="text-xs text-gray-500">@{post.user?.username}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${postTypeStyle.bg} ${postTypeStyle.text}`}>
                  {postTypeStyle.icon}
                  {post.post_type}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(post.created_at)}
                </span>
              </div>
            </div>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={handleMenuClick}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-[#fff6f6] text-[#e5989b] px-3 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
            post.images.length === 1 ? "grid-cols-1" :
            post.images.length === 2 ? "grid-cols-2" :
            "grid-cols-2 sm:grid-cols-3"
          }`}>
            {post.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#e5989b] transition-colors group"
            >
              <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:bg-[#fceaea] group-hover:border-[#e5989b]/20 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{post.like_count}</span>
            </button>
            <button 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors group"
              onClick={handleCommentClick}
            >
              <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Comment</span>
            </button>
          </div>
          <button 
            className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors group"
            onClick={handleShareClick}
          >
            <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:bg-green-50 group-hover:border-green-200 transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;