import { useState, useEffect } from "react";
import { postRequest, getRequest } from "../../api/requests";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Plus,
  Bookmark
} from "lucide-react";
import SuccessToast from "./SuccessToast";
import CreatePostModal from "./CreatePost";
import SinglePost from "./SinglePost";
import type { Post, PostFormData, PostType } from "../../interfaces/CommunityInterfaces";

// Define a cute notification component
const CuteNotification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
      <div className="bg-gradient-to-r from-[#ffb3b3] to-[#ffccd5] border-2 border-[#ff8fa3] rounded-xl shadow-lg p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-[#ff4d6d]" fill="#ff4d6d" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[#590d22] font-medium">Saved! ✨</p>
            <p className="text-[#800f2f] text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#ff4d6d] hover:text-[#c9184a] transition-colors"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 w-full bg-white rounded-full overflow-hidden">
          <div className="h-full bg-[#ff4d6d] animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

const CommunityCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState<boolean>(false);
  const [saveNotificationMessage, setSaveNotificationMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

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

      console.log(response);
      
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

  // Handle save post
  const handleSavePost = async (postId: string) => {
    try {
      // Prevent multiple clicks
      if (isSaving[postId]) return;
      
      setIsSaving(prev => ({ ...prev, [postId]: true }));
      
      const response = await postRequest(`/user-profile/save-post/${postId}/`, {});
      
      if (response) {
        // Show cute notification
        const postTitle = posts.find(p => p.id === postId)?.title || "Post";
        setSaveNotificationMessage(`${postTitle} has been saved to your collection! 📚`);
        setShowSaveNotification(true);
        
        // Update local state to show saved status
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              is_saved: true
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Show error notification
      setSaveNotificationMessage("Failed to save post. Please try again! 😢");
      setShowSaveNotification(true);
    } finally {
      setIsSaving(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle view post
  const handleViewPost = () => {
    if (createdPostId) {
      navigate(`/community/post/${createdPostId}`);
      setShowToast(false);
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
            posts.map((post) => (
              <SinglePost
                key={post.id}
                post={post}
                getPostTypeStyle={getPostTypeStyle}
                formatDate={formatDate}
                onSavePost={handleSavePost}
                isSaving={isSaving[post.id]}
              />
            ))
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

      {/* Cute Save Notification */}
      {showSaveNotification && (
        <CuteNotification
          message={saveNotificationMessage}
          onClose={() => setShowSaveNotification(false)}
        />
      )}
    </>
  );
};

export default CommunityCenter;