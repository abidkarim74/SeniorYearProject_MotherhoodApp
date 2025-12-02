import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
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
  Plus,
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
  Loader2 
} from "lucide-react";


const Community = () => {
  const { accessToken, user } = useAuth(); 
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState("");
  // --- ADDED: State to track the selected post type ---
  const [selectedPostType, setSelectedPostType] = useState<"Discussion" | "Support" | "Advice" | null>(null);

  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  
  const [currentUserProfile, setCurrentUserProfile] = useState<MotherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
    } finally {
      setLoadingFeed(false);
    }
  };

  // --- New useEffect Hook to Trigger Fetch ---
  useEffect(() => {
    if (accessToken && user?.id) {
      fetchCurrentUserProfile();
      fetchFeedPosts(); // <-- ADDED: Fetch the community feed data
    } else {
      setLoadingProfile(false);
      setLoadingFeed(false); // <-- ADDED: Also stop loading the feed if unauthenticated
    }
  }, [accessToken, user?.id]);

  // Mock data for community
  const communityData = {
    stats: {
      totalMembers: 1250,
      onlineMembers: 42,
      postsToday: 18,
      activeDiscussions: 56
    },
    categories: [
      { id: 1, name: "Newborn Care", color: "from-blue-100 to-blue-200", icon: "👶", posts: 234 },
      { id: 2, name: "Breastfeeding", color: "from-green-100 to-green-200", icon: "🤱", posts: 189 },
      { id: 3, name: "Sleep Training", color: "from-purple-100 to-purple-200", icon: "😴", posts: 156 },
      { id: 4, name: "Nutrition", color: "from-orange-100 to-orange-200", icon: "🍎", posts: 142 },
      { id: 5, name: "Development", color: "from-pink-100 to-pink-200", icon: "🌟", posts: 128 },
      { id: 6, name: "Health & Safety", color: "from-red-100 to-red-200", icon: "🏥", posts: 115 }
    ],
    featuredMembers: [
      {
        id: 1,
        name: "Ayesha Khan",
        role: "Pediatric Nurse",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 89,
        likes: 423,
        isOnline: true,
        badge: "Expert"
      },
      {
        id: 2,
        name: "Fatima Ahmed",
        role: "Child Nutritionist",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 67,
        likes: 298,
        isOnline: false,
        badge: "Nutritionist"
      },
      {
        id: 3,
        name: "Sara Johnson",
        role: "Sleep Consultant",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 54,
        likes: 356,
        isOnline: true,
        badge: "Specialist"
      }
    ],
    posts: [
      {
        id: 1,
        author: {
          name: "Maria Khan",
          avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face&auto=format",
          role: "Mother of 2"
        },
        category: "Newborn Care",
        title: "Tips for managing colic in newborns?",
        content: "My 3-week-old has been crying non-stop for hours every evening. We've tried everything - swaddling, white noise, gentle rocking. Any advice from experienced moms?",
        timestamp: "2 hours ago",
        likes: 24,
        comments: 18,
        views: 142,
        isLiked: false,
        isBookmarked: false,
        tags: ["colic", "newborn", "crying"],
        isFeatured: true
      },
      {
        id: 2,
        author: {
          name: "Dr. Sarah Ahmed",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face&auto=format",
          role: "Pediatrician"
        },
        category: "Health & Safety",
        title: "Important: Updated vaccination schedule for 2024",
        content: "The Ministry of Health has updated the childhood immunization schedule. Key changes include earlier HPV vaccination and new recommendations for flu shots. Always consult with your healthcare provider.",
        timestamp: "5 hours ago",
        likes: 45,
        comments: 12,
        views: 289,
        isLiked: true,
        isBookmarked: true,
        tags: ["vaccinations", "health", "doctor"],
        isFeatured: false
      },
      {
        id: 3,
        author: {
          name: "Zainab Raza",
          avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face&auto=format",
          role: "Mother of 3"
        },
        category: "Breastfeeding",
        title: "Breastfeeding success story after initial struggles",
        content: "I want to share my journey to encourage other moms. After weeks of pain and frustration, we finally found our rhythm. Don't give up - seek help from lactation consultants!",
        timestamp: "1 day ago",
        likes: 67,
        comments: 23,
        views: 324,
        isLiked: false,
        isBookmarked: false,
        tags: ["breastfeeding", "support", "success"],
        isFeatured: true
      }
    ],
    recentActivities: [
      {
        id: 1,
        user: "Fatima Ali",
        action: "commented on your post",
        target: "Sleep training tips",
        timestamp: "30 minutes ago",
        avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop&crop=face&auto=format",
        type: "comment"
      },
      {
        id: 2,
        user: "Community",
        action: "You earned the",
        target: "Helper Badge",
        timestamp: "2 hours ago",
        avatar: "https://images.unsplash.com/photo-1560250056-07ba64664864?w=100&h=100&fit=crop&crop=face&auto=format",
        type: "badge"
      },
      {
        id: 3,
        user: "Sana Khan",
        action: "liked your comment on",
        target: "Vaccination schedule",
        timestamp: "4 hours ago",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face&auto=format",
        type: "like"
      }
    ]
  };

  const filters = [
    { key: "all", label: "All Posts", icon: MessageSquareText },
    { key: "popular", label: "Popular", icon: TrendingUp },
    { key: "recent", label: "Recent", icon: Clock }
  ];

  const handleLikePost = (postId: number) => {
    console.log("Liked post:", postId);
  };

  const handleBookmarkPost = (postId: number) => {
    console.log("Bookmarked post:", postId);
  };
  
  const handleSelectPostType = (type: "Discussion" | "Support" | "Advice") => {
    setSelectedPostType(type);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user?.id || !selectedPostType) {
      if (!selectedPostType) {
        alert("Please select a post type (Discussion, Support, or Advice) before posting.");
      }
      return; 
    }

    const postData = {
      user_id: user.id, 
      title: newPost.trim().substring(0, 50), 
      tags: ["general", selectedPostType.toLowerCase()], 
      images: [],
      description: newPost.trim(),
      post_type: selectedPostType 
    };

    try {
      // API: POST /api/community/create-post
      const createdPost = await postRequest("/community/create-post", postData);
      
      
      // alert("Post created successfully!");
      setNewPost(""); // Clear the input field
      setSelectedPostType(null); 
      fetchFeedPosts(); // Refresh the feed to show the new post
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.response?.data?.detail?.[0]?.msg || error.message}`);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  const PostCard = ({ post }: { post: any }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl ${
      post.isFeatured ? 'ring-2 ring-[#e5989b]/20' : ''
    }`}>
      {post.isFeatured && (
        <div className="flex items-center gap-2 text-sm text-[#e5989b] font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Featured Post
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={post.user?.profile_pic || defaultAvatar} 
              alt={post.user?.firstname || "User"}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
            <p className="text-sm text-gray-600">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{post.timestamp}</span>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
          post.category === "Newborn Care" ? "from-blue-100 to-blue-200 text-blue-800" :
          post.category === "Breastfeeding" ? "from-green-100 to-green-200 text-green-800" :
          post.category === "Health & Safety" ? "from-red-100 to-red-200 text-red-800" :
          post.category === "Nutrition" ? "from-orange-100 to-orange-200 text-orange-800" :
          "from-purple-100 to-purple-200 text-purple-800"
        }`}>
          {post.category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6 text-gray-500">
          <button 
            onClick={() => handleLikePost(post.id)}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              post.isLiked ? "text-red-600 scale-110" : "hover:text-red-600 hover:scale-110"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="font-medium">{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 hover:scale-110 transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-600 hover:scale-110 transition-all duration-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-1 text-sm">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <button 
            onClick={() => handleBookmarkPost(post.id)}
            className={`p-2 transition-all duration-200 ${
              post.isBookmarked ? "text-yellow-600 scale-110" : "hover:text-yellow-600 hover:scale-110"
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-start space-x-3 py-3 group hover:bg-gray-50 rounded-xl px-2 transition-colors duration-200">
      <div className="relative">
        <img
          src={activity.avatar}
          alt={activity.user}
          className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
        />
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
          activity.type === 'comment' ? 'bg-blue-400' :
          activity.type === 'badge' ? 'bg-yellow-400' :
          'bg-green-400'
        }`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 leading-relaxed">
          <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
          <span className="font-semibold text-[#e5989b]">{activity.target}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        {/* Header */}
        {/* <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5989b]/20 shadow-sm mb-4">
            <div className="w-2 h-2 bg-[#e5989b] rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Parent Community</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Community{" "}
            <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
              Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Connect with other parents, share experiences, and get the support you need on your parenting journey.
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#e5989b]" />
                Community Stats
              </h3>
              <div className="space-y-4">
                <StatCard 
                  title="Total Members" 
                  value={communityData.stats.totalMembers.toLocaleString()} 
                  icon={Users}
                  color="from-blue-100 to-blue-200"
                />
                <StatCard 
                  title="Online Now" 
                  value={communityData.stats.onlineMembers} 
                  icon={Zap}
                  color="from-green-100 to-green-200"
                  description="Active members"
                />
                <StatCard 
                  title="Posts Today" 
                  value={communityData.stats.postsToday} 
                  icon={MessageCircle}
                  color="from-purple-100 to-purple-200"
                />
                <StatCard 
                  title="Active Discussions" 
                  value={communityData.stats.activeDiscussions} 
                  icon={Users2}
                  color="from-orange-100 to-orange-200"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#e5989b]" />
                Categories
              </h3>
              <div className="space-y-3">
                {communityData.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-gray-900 group-hover:text-[#e5989b] transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full font-medium">
                      {category.posts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Members */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#e5989b]" />
                Featured Members
              </h3>
              <div className="space-y-4">
                {communityData.featuredMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                        <span className="text-xs bg-[#e5989b] text-white px-2 py-0.5 rounded-full">
                          {member.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{member.role}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MessageSquare className="w-3 h-3" />
                          <span>{member.posts}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{member.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

{/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post - MODIFIED SECTION */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-4 mb-4">
                {loadingProfile ? (
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center animate-pulse">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                ) : (
                  <img
                    // **Dynamically display the fetched profile picture**
                    src={currentUserProfile?.profile_pic || defaultAvatar}
                    alt={currentUserProfile ? `${currentUserProfile.firstname} avatar` : "Your avatar"}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                )}

                <input
                  type="text"
                  placeholder="Share your experience or ask a question..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] transition-all duration-200"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {/* Discussion Button - MODIFIED */}
                  <button 
                    onClick={() => handleSelectPostType("Discussion")}
                    className={`flex items-center space-x-2 transition-colors duration-200 p-2 rounded-xl 
                      ${selectedPostType === "Discussion" 
                        ? "bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-300" 
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Discussion</span>
                  </button>
                  {/* Support Button - MODIFIED */}
                  <button 
                    onClick={() => handleSelectPostType("Support")}
                    className={`flex items-center space-x-2 transition-colors duration-200 p-2 rounded-xl 
                      ${selectedPostType === "Support" 
                        ? "bg-green-100 text-green-700 font-semibold ring-2 ring-green-300" 
                        : "text-gray-500 hover:text-green-600 hover:bg-green-50"}`}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Support</span>
                  </button>
                  {/* Advice Button - MODIFIED */}
                  <button 
                    onClick={() => handleSelectPostType("Advice")}
                    className={`flex items-center space-x-2 transition-colors duration-200 p-2 rounded-xl 
                      ${selectedPostType === "Advice" 
                        ? "bg-purple-100 text-purple-700 font-semibold ring-2 ring-purple-300" 
                        : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"}`}
                  >
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">Advice</span>
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || loadingProfile || !selectedPostType} 
                  className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-3 rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
                >
                  Create Post
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"> */}
              <div className="flex items-center gap-2 flex-nowrap overflow-hidden bg-white rounded-2xl shadow-md border border-gray-100 p-3 mb-6">

                {/* Filters */}
                <div className="flex items-center gap-2 flex-nowrap">
                  {filters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.key}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all whitespace-nowrap
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

                {/* Search bar */}
                <div className="flex items-center bg-gray-100 px-2 py-1.5 rounded-lg ml-auto w-48">
                  <Search className="w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent ml-2 text-xs w-full focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

              </div>
            {/* </div> */}


            {/* Posts List */}
            <div className="space-y-6">
              {communityData.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#e5989b]" />
                Your Activity
              </h3>
              <div className="space-y-1">
                {communityData.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Community Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start space-x-3 p-2 rounded-xl bg-white/50">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Be kind and supportive to other parents</span>
                </li>
                <li className="flex items-start space-x-3 p-2 rounded-xl bg-white/50">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Share experiences, not medical advice</span>
                </li>
                <li className="flex items-start space-x-3 p-2 rounded-xl bg-white/50">
                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Respect different parenting choices</span>
                </li>
                <li className="flex items-start space-x-3 p-2 rounded-xl bg-white/50">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Celebrate each other's successes</span>
                </li>
              </ul>
            </div>

            {/* Quick Resources */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Resources</h3>
              <div className="space-y-3">
                <Link to="/emergency-contacts" className="flex items-center space-x-3 p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 group">
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Emergency Contacts</span>
                </Link>
                <Link to="/local-support" className="flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 group">
                  <Users2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Local Support Groups</span>
                </Link>
                <Link to="/expert-advice" className="flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-200 group">
                  <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Expert Q&A Sessions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;












