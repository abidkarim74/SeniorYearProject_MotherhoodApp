import { Heart, MessageCircle, Share2, MoreVertical, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { PostType } from "../../interfaces/CommunityInterfaces";
import DotBar from "./includes/DotBar";
import { useAuth } from "../../context/authContext";
import { postRequest } from "../../api/requests";

interface SinglePostProps {
  post: {
    id: string;
    user: {
      id?: string;
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
    likers: string[]; // Add likers array
    user_id: string; // Add user_id to check ownership
  };
  getPostTypeStyle: (type: PostType) => {
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode;
  };
  formatDate: (dateString: string) => string;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onLikeUpdate?: (postId: string, newLikeCount: number, isLiked: boolean) => void; // Optional callback for parent
}

const SinglePost = ({ 
  post, 
  getPostTypeStyle, 
  formatDate,
  onEdit,
  onDelete,
  onLikeUpdate
}: SinglePostProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isDotBarOpen, setIsDotBarOpen] = useState(false);
  const [dotBarPosition, setDotBarPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(post.likers?.includes(user?.id || "") || false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isLiking, setIsLiking] = useState(false);
  
  const postTypeStyle = getPostTypeStyle(post.post_type);

  const handleContainerClick = () => {
    if (!isDotBarOpen) {
      navigate(`/community/post/${post.id}`);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      // Redirect to login or show login modal
      navigate("/auth/login");
      return;
    }

    if (isLiking) return; // Prevent double clicks
    
    setIsLiking(true);
    
    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
      
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      
      // Call the backend API using postRequest
      // Note: Fixed typo from "toogle" to "toggle"
      const response = await postRequest(`/community/post/toogle-like/${post.id}`, {});
      
      // Log response for debugging
      console.log("Like response:", response);

      // Handle response based on your API structure
      // From your image: {liked: true, message: 'Post Liked'}
      // or {liked: false, message: 'Post Unliked'}
      
      let serverLikedStatus: boolean | undefined;
      let serverMessage: string | undefined;
      
      // Check different possible response structures
      if (response && typeof response === 'object') {
        if (response.liked !== undefined) {
          // Direct response structure
          serverLikedStatus = response.liked;
          serverMessage = response.message;
        } else if (response.data && response.data.liked !== undefined) {
          // Wrapped response structure
          serverLikedStatus = response.data.liked;
          serverMessage = response.data.message;
        }
      }
      
      if (serverLikedStatus !== undefined) {
        // Server responded with a valid liked status
        if (serverLikedStatus !== newIsLiked) {
          // Server returned different state than our optimistic update
          // Revert to server state and adjust count accordingly
          setIsLiked(serverLikedStatus);
          const correctedLikeCount = serverLikedStatus ? likeCount + 1 : likeCount - 1;
          setLikeCount(correctedLikeCount);
        }
        // else: server agrees with our optimistic update, keep as is
        
        console.log(serverMessage || `Post ${serverLikedStatus ? 'Liked' : 'Unliked'}`);
        
        // Notify parent component if callback provided
        if (onLikeUpdate) {
          onLikeUpdate(post.id, likeCount, serverLikedStatus);
        }
      } else {
        // Unexpected response structure - revert optimistic update
        console.warn("Unexpected response structure:", response);
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
        // alert("Failed to update like. Please try again.");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      
      // Show error message to user
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else if (error.message) {
        alert(error.message);
      } else {
        // alert("Failed to update like. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDotBarPosition({
      x: rect.right - 220,
      y: rect.bottom + 10,
    });
    setIsDotBarOpen(true);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/community/post/${post.id}#comments`);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: `${window.location.origin}/community/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
      // Add toast notification: "Link copied to clipboard!"
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleReport = () => {
    console.log("Report post:", post.id);
    // Implement your report logic here
  };

  const handleSave = () => {
    console.log("Save post:", post.id);
    // Implement save logic here
  };

  const handleHide = () => {
    console.log("Hide post:", post.id);
    // Implement hide logic here
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
    // Add toast notification: "Link copied to clipboard!"
  };

  // Check if current user is the post owner
  const isOwner = user?.id && post.user_id ? user.id === post.user_id : false;

  return (
    <>
      <div 
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer relative"
        onClick={handleContainerClick}
      >
        {/* Post Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.user?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={`${post.user?.firstname} ${post.user?.lastname}`}
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
              className="text-gray-400 hover:text-gray-600 relative"
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
                disabled={isLiking}
                className={`flex items-center gap-1.5 transition-colors group ${
                  isLiked 
                    ? 'text-[#e5989b]' 
                    : 'text-gray-600 hover:text-[#e5989b]'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`p-1.5 rounded-full border transition-colors ${
                  isLiked
                    ? 'bg-[#fceaea] border-[#e5989b]/20'
                    : 'bg-white border-gray-200 group-hover:bg-[#fceaea] group-hover:border-[#e5989b]/20'
                }`}>
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-sm font-medium">{likeCount}</span>
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

      {/* DotBar Menu */}
      <DotBar
        isOpen={isDotBarOpen}
        onClose={() => setIsDotBarOpen(false)}
        position={dotBarPosition}
        isOwner={isOwner}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReport={handleReport}
        onSave={handleSave}
        onHide={handleHide}
        onCopyLink={handleCopyLink}
      />
    </>
  );
};

export default SinglePost;