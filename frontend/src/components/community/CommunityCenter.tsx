import { useState, useEffect } from "react";
import { postRequest, getRequest } from "../../api/requests";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  Clock,
  Users,
  AlertCircle,
  TrendingUp,
  Plus
} from "lucide-react";
import SuccessToast from "./SuccessToast";
import CreatePostModal from "./CreatePost";
// Type definitions (same as before)
type PostType = "Advice" | "Discussion" | "Support";

interface User {
  firstname: string;
  lastname: string;
  username: string;
  profile_pic: string;
}

interface Post {
  user_id: string;
  user: User;
  title: string;
  tags: string[];
  images: string[];
  description: string;
  post_type: PostType;
  id: string;
  visible: boolean;
  post_category: string;
  like_count: number;
  created_at: string;
}

interface PostFormData {
  title: string;
  description: string;
  post_type: PostType;
  tags: string[];
  images: string[];
}

const CommunityCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);


  console.log(posts)

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getRequest("/community/feed/");
      if (response && Array.isArray(response)) {
        setPosts(response as Post[]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post creation
  const handleCreatePost = async (postData: PostFormData) => {
    try {
      const response = await postRequest("/community/create-post/", postData);
      
      if (response && response.id) {
        setCreatedPostId(response.id);
        setToastMessage("Post created successfully!");
        setShowToast(true);
        
        // Refresh posts
        await fetchPosts();
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowModal(false);
        }, 100);
        
        return response;
      }
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  // Handle view post
  const handleViewPost = () => {
    if (createdPostId) {
      navigate(`/community/post/${createdPostId}`);
      setShowToast(false);
    }
  };

  // Handle like
  const handleLike = async (postId: string) => {
    try {
      // Update local state for now
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, like_count: post.like_count + 1 };
        }
        return post;
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Post type styling
  const getPostTypeStyle = (type: PostType) => {
    switch (type) {
      case "Advice":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <TrendingUp className="w-3 h-3" />
        };
      case "Discussion":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <MessageCircle className="w-3 h-3" />
        };
      case "Support":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: <Users className="w-3 h-3" />
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e5989b]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Create Post Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={user?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-[#fff6f6] border border-[#e5989b]/20 rounded-full px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fceaea] transition-colors text-left hover:border-[#e5989b]/40"
            >
              What's on your mind, {user?.firstname}?
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white p-2.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#fceaea] flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#e5989b]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share something with the community!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium shadow-md"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => {
              const postTypeStyle = getPostTypeStyle(post.post_type);
              
              return (
                <div 
                  key={post.id} 
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/community/post/${post.id}`)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle menu click
                        }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-[#e5989b] transition-colors group"
                        >
                          <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:bg-[#fceaea] group-hover:border-[#e5989b]/20 transition-colors">
                            <Heart className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{post.like_count}</span>
                        </button>
                        <button 
                          className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors group"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle comment
                          }}
                        >
                          <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">Comment</span>
                        </button>
                      </div>
                      <button 
                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share
                        }}
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
            })
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreatePost={handleCreatePost}
        user={user}
      />

      {/* Success Toast */}
      {showToast && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          showViewButton={!!createdPostId}
          onViewClick={handleViewPost}
          duration={5000}
        />
      )}
    </>
  );
};

export default CommunityCenter;