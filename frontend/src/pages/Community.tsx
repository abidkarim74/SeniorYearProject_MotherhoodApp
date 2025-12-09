import { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; 
import { getRequest, postRequest } from "../api/requests";
import type { MotherProfile } from "../interfaces/ProfileInterfaces"; 
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark,
  Search,
  MoreVertical,
  ThumbsUp,
  MessageSquare,
  Eye,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Users2,
  MessageSquareText,
  Sparkles,
  Loader2,
  CheckCircle,
  X,
  ArrowRight,
  Image as ImageIcon,
  XCircle,
  Menu
} from "lucide-react";

import LeftSidebar from "../components/CommunityLeftBar";
import RightSidebar from "../components/CommunityRightBar";


const Community = () => {
  const { accessToken, user } = useAuth(); 
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedPostType, setSelectedPostType] = useState<"Discussion" | "Support" | "Advice" | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [creatingPost, setCreatingPost] = useState<boolean>(false);
  
  const [currentUserProfile, setCurrentUserProfile] = useState<MotherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    onlineMembers: 0,
    postsToday: 0,
    activeDiscussions: 0
  });
  
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const centerContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCurrentUserProfile = async () => {
    if (!user?.id) {
      setLoadingProfile(false);
      return; 
    }

    setLoadingProfile(true);
    try {
      const response = await getRequest(`/user-profile/mother/${user.id}`);
      setCurrentUserProfile(response);
    } catch (err) {
      console.error("Error fetching current user profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchFeedPosts = async () => {
    setLoadingFeed(true);
    try {
      const postsData = await getRequest("/community/feed");
      setFeedPosts(postsData || []);
    } catch (err) {
      console.error("Error fetching community feed:", err);
      setFeedPosts([]);
    } finally {
      setLoadingFeed(false);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      const stats = await getRequest("/community/stats");
      setCommunityStats(stats || {
        totalMembers: 0,
        onlineMembers: 0,
        postsToday: 0,
        activeDiscussions: 0
      });
    } catch (err) {
      console.error("Error fetching community stats:", err);
    }
  };

  useEffect(() => {
    if (accessToken && user?.id) {
      fetchCurrentUserProfile();
      fetchFeedPosts();
      fetchCommunityStats();
    } else {
      setLoadingProfile(false);
      setLoadingFeed(false);
    }
  }, [accessToken, user?.id]);

  const filters = [
    { key: "all", label: "All", icon: MessageSquareText },
    { key: "popular", label: "Popular", icon: TrendingUp },
    { key: "recent", label: "Recent", icon: Clock }
  ];

  const handleLikePost = async (postId: number) => {
    try {
      await postRequest(`/community/posts/${postId}/like`, {});
      setFeedPosts(posts => posts.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) + 1, isLiked: true }
          : post
      ));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleBookmarkPost = async (postId: number) => {
    try {
      await postRequest(`/community/posts/${postId}/bookmark`, {});
      setFeedPosts(posts => posts.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      ));
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };
  
  const handleSelectPostType = (type: "Discussion" | "Support" | "Advice") => {
    setSelectedPostType(type);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 4 - selectedImages.length);
    const newPreviews: string[] = [];
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPost.trim() || !user?.id || !selectedPostType) {
      if (!selectedPostType) {
        alert("Please select a post type (Discussion, Support, or Advice) before posting.");
      }
      if (!newPostTitle.trim()) {
        alert("Please add a title for your post.");
      }
      if (!newPost.trim()) {
        alert("Please add a description for your post.");
      }
      return; 
    }

    setCreatingPost(true);

    try {
      // If we have images, use FormData
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('title', newPostTitle.trim());
        formData.append('description', newPost.trim());
        formData.append('post_type', selectedPostType);
        formData.append('tags', JSON.stringify([])); // Empty array for tags
        formData.append('images', JSON.stringify([])); // Empty array for now
        
        // Add images if any
        selectedImages.forEach((image) => {
          formData.append('image_files', image);
        });

        // Use fetch API for multipart/form-data
        const response = await fetch('http://localhost:8000/api/community/create-post', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to create post');
        }

        await response.json();
      } else {
        // If no images, use JSON
        const postData = {
          user_id: user.id,
          title: newPostTitle.trim(),
          description: newPost.trim(),
          post_type: selectedPostType,
          tags: [], // Empty array as requested
          images: [] // Empty array as requested
        };

        await postRequest("/community/create-post", postData);
      }
      
      // Show success popup
      setPopupMessage("Your post was successfully created!");
      setShowSuccessPopup(true);
      
      // Clear form
      setNewPost("");
      setNewPostTitle("");
      setSelectedPostType(null);
      setSelectedImages([]);
      setImagePreviews([]);
      
      // Refresh the feed
      fetchFeedPosts();
      
      // Auto-hide popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    } finally {
      setCreatingPost(false);
    }
  };

  const navigateToProfile = () => {
    if (user?.id) {
      navigate(`/mother/${user.id}`);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const getFilteredPosts = () => {
    let filtered = [...feedPosts];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(post => 
        (post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    switch (activeFilter) {
      case "popular":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case "all":
      default:
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }
    
    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  const SuccessPopup = () => {
    if (!showSuccessPopup) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeSuccessPopup}
        ></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeInUp">
          <button
            onClick={closeSuccessPopup}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Success!
            </h3>
            <p className="text-gray-600 mb-6">
              {popupMessage}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  closeSuccessPopup();
                  navigateToProfile();
                }}
                className="flex-1 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                View Your Profile
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={closeSuccessPopup}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Stay Here
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Your post is now visible to the community. 
              </p>
            </div>
          </div>
          
          <div className="h-2 bg-gradient-to-r from-[#e5989b] via-[#e8a6a9] to-[#d88a8d]"></div>
        </div>
      </div>
    );
  };

  const PostCard = ({ post }: { post: any }) => {
    const formatTimestamp = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    };

    return (
      <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl ${
        post.is_featured ? 'ring-2 ring-[#e5989b]/20' : ''
      }`}>
        {post.is_featured && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#e5989b] font-medium mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Featured Post
          </div>
        )}
        
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <img
                src={post.user?.profile_pic || defaultAvatar} 
                alt={post.user?.firstname || "User"}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                {post.user?.firstname} {post.user?.lastname}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">{post.user?.role || "Parent"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
              {post.created_at ? formatTimestamp(post.created_at) : "Just now"}
            </span>
            <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
            {post.post_type || "Discussion"}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">{post.title}</h3>
        <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{post.description}</p>

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
            {post.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-32 sm:h-48 object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 sm:space-x-6 text-gray-500">
            <button 
              onClick={() => handleLikePost(post.id)}
              className={`flex items-center space-x-1 sm:space-x-2 transition-all duration-200 ${
                post.isLiked ? "text-red-600 scale-110" : "hover:text-red-600 hover:scale-110"
              }`}
            >
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{post.likes || 0}</span>
            </button>
            <button className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-600 hover:scale-110 transition-all duration-200">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{post.comments_count || 0}</span>
            </button>
            <button className="flex items-center space-x-1 sm:space-x-2 hover:text-green-600 hover:scale-110 transition-all duration-200">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 text-gray-500">
            <div className="hidden sm:flex items-center space-x-1 text-sm">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
            <button 
              onClick={() => handleBookmarkPost(post.id)}
              className={`p-1 sm:p-2 transition-all duration-200 ${
                post.isBookmarked ? "text-yellow-600 scale-110" : "hover:text-yellow-600 hover:scale-110"
              }`}
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
      <SuccessPopup />
      
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 rounded-lg bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-900">Community</h1>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Left Sidebar */}
          <LeftSidebar 
            showMobileSidebar={showMobileSidebar}
            setShowMobileSidebar={setShowMobileSidebar}
          />

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div 
              ref={centerContentRef}
              className="overflow-y-auto lg:h-[calc(100vh-3rem)]"
            >
              <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-6 pr-1">
                {/* Compact Create Post Area */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4">
                  <div className="flex items-start gap-3 mb-4">
                    {loadingProfile ? (
                      <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center animate-pulse flex-shrink-0">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <img
                        src={currentUserProfile?.profile_pic || defaultAvatar}
                        alt="Your avatar"
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        placeholder="What's on your mind?"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-2 text-sm focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] transition-all duration-200"
                      />
                      
                      <textarea
                        placeholder="Share details..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] transition-all duration-200 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  {/* Image previews - compact */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative flex-shrink-0">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom actions - compact */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Post type buttons - compact */}
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleSelectPostType("Discussion")}
                          className={`flex items-center gap-1 transition-colors duration-200 px-2 py-1.5 rounded-lg text-xs
                            ${selectedPostType === "Discussion" 
                              ? "bg-blue-100 text-blue-700 font-medium ring-1 ring-blue-300" 
                              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Discussion</span>
                        </button>
                        <button 
                          onClick={() => handleSelectPostType("Support")}
                          className={`flex items-center gap-1 transition-colors duration-200 px-2 py-1.5 rounded-lg text-xs
                            ${selectedPostType === "Support" 
                              ? "bg-green-100 text-green-700 font-medium ring-1 ring-green-300" 
                              : "text-gray-500 hover:text-green-600 hover:bg-green-50"}`}
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Support</span>
                        </button>
                        <button 
                          onClick={() => handleSelectPostType("Advice")}
                          className={`flex items-center gap-1 transition-colors duration-200 px-2 py-1.5 rounded-lg text-xs
                            ${selectedPostType === "Advice" 
                              ? "bg-purple-100 text-purple-700 font-medium ring-1 ring-purple-300" 
                              : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"}`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Advice</span>
                        </button>
                      </div>
                      
                      {/* Image upload button - compact */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={selectedImages.length >= 4}
                        className="flex items-center gap-1 px-2 py-1.5 text-gray-500 hover:text-[#e5989b] hover:bg-pink-50 rounded-lg transition-colors duration-200 disabled:opacity-50 text-xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{selectedImages.length}/4</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                    
                    {/* Compact Create Post Button */}
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostTitle.trim() || !newPost.trim() || loadingProfile || !selectedPostType || creatingPost} 
                      className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-4 py-2 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium flex items-center gap-2 text-sm"
                    >
                      {creatingPost ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="hidden sm:inline">Creating...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-xl shadow-md border border-gray-100 p-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-1">
                    {filters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <button
                          key={filter.key}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0
                            ${activeFilter === filter.key
                              ? "bg-[#e5989b] text-white shadow"
                              : "text-gray-600 hover:bg-gray-100"
                            }`}
                          onClick={() => setActiveFilter(filter.key)}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full sm:w-auto">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      className="bg-transparent ml-2 text-sm w-full focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4 lg:space-y-6 pb-6">
                  {loadingFeed ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                      <Loader2 className="w-8 h-8 text-[#e5989b] animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">Loading posts...</p>
                    </div>
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                      <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {searchTerm.trim() 
                          ? "No posts match your search."
                          : "Be the first to start a discussion!"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>

      <style>
        {`
          @keyframes slideInLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slideInLeft {
            animation: slideInLeft 0.3s ease-out;
          }
          
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: #fceaea;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: #e5989b;
            border-radius: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default Community;