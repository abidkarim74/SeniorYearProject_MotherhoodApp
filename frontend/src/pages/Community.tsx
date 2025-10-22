import { useState } from "react";
import { Link } from "react-router-dom";
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
  Star
} from "lucide-react";


const Community = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState("");

  // Mock data for community
  const communityData = {
    stats: {
      totalMembers: 1250,
      onlineMembers: 42,
      postsToday: 18,
      activeDiscussions: 56
    },
    categories: [
      { id: 1, name: "Newborn Care", color: "bg-blue-100 text-blue-800", posts: 234 },
      { id: 2, name: "Breastfeeding", color: "bg-green-100 text-green-800", posts: 189 },
      { id: 3, name: "Sleep Training", color: "bg-purple-100 text-purple-800", posts: 156 },
      { id: 4, name: "Nutrition", color: "bg-orange-100 text-orange-800", posts: 142 },
      { id: 5, name: "Development", color: "bg-pink-100 text-pink-800", posts: 128 },
      { id: 6, name: "Health & Safety", color: "bg-red-100 text-red-800", posts: 115 }
    ],
    featuredMembers: [
      {
        id: 1,
        name: "Ayesha Khan",
        role: "Pediatric Nurse",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 89,
        likes: 423,
        isOnline: true
      },
      {
        id: 2,
        name: "Fatima Ahmed",
        role: "Child Nutritionist",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 67,
        likes: 298,
        isOnline: false
      },
      {
        id: 3,
        name: "Sara Johnson",
        role: "Sleep Consultant",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face&auto=format",
        posts: 54,
        likes: 356,
        isOnline: true
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
        tags: ["colic", "newborn", "crying"]
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
        tags: ["vaccinations", "health", "doctor"]
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
        tags: ["breastfeeding", "support", "success"]
      },
      {
        id: 4,
        author: {
          name: "Amna Sheikh",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face&auto=format",
          role: "Nutrition Expert"
        },
        category: "Nutrition",
        title: "Homemade baby food recipes for 6+ months",
        content: "Starting solids? Here are some easy, nutritious recipes that my babies loved. All ingredients are locally available and budget-friendly!",
        timestamp: "2 days ago",
        likes: 89,
        comments: 34,
        views: 567,
        isLiked: true,
        isBookmarked: true,
        tags: ["nutrition", "babyfood", "recipes"]
      }
    ],
    recentActivities: [
      {
        id: 1,
        user: "Fatima Ali",
        action: "commented on your post",
        target: "Sleep training tips",
        timestamp: "30 minutes ago",
        avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop&crop=face&auto=format"
      },
      {
        id: 2,
        user: "Community",
        action: "You earned the",
        target: "Helper Badge",
        timestamp: "2 hours ago",
        avatar: "https://images.unsplash.com/photo-1560250056-07ba64664864?w=100&h=100&fit=crop&crop=face&auto=format"
      },
      {
        id: 3,
        user: "Sana Khan",
        action: "liked your comment on",
        target: "Vaccination schedule",
        timestamp: "4 hours ago",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face&auto=format"
      }
    ]
  };

  const filters = [
    { key: "all", label: "All Posts" },
    { key: "popular", label: "Popular" },
    { key: "recent", label: "Recent" },
    { key: "following", label: "Following" }
  ];

  const handleLikePost = (postId: number) => {
    // In a real app, this would update the backend
    console.log("Liked post:", postId);
  };

  const handleBookmarkPost = (postId: number) => {
    // In a real app, this would update the backend
    console.log("Bookmarked post:", postId);
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // In a real app, this would send to backend
      console.log("Creating post:", newPost);
      setNewPost("");
    }
  };

  const PostCard = ({ post }: { post: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
            <p className="text-sm text-gray-600">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{post.timestamp}</span>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          post.category === "Newborn Care" ? "bg-blue-100 text-blue-800" :
          post.category === "Breastfeeding" ? "bg-green-100 text-green-800" :
          post.category === "Health & Safety" ? "bg-red-100 text-red-800" :
          post.category === "Nutrition" ? "bg-orange-100 text-orange-800" :
          "bg-purple-100 text-purple-800"
        }`}>
          {post.category}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6 text-gray-500">
          <button 
            onClick={() => handleLikePost(post.id)}
            className={`flex items-center space-x-1 transition-colors ${
              post.isLiked ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-500">
          <Eye className="w-4 h-4" />
          <span className="text-sm">{post.views}</span>
          <button 
            onClick={() => handleBookmarkPost(post.id)}
            className={`p-1 transition-colors ${
              post.isBookmarked ? "text-yellow-600" : "hover:text-yellow-600"
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-start space-x-3 py-3">
      <img
        src={activity.avatar}
        alt={activity.user}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
          <span className="font-medium text-blue-600">{activity.target}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600 mt-2">
                Connect with other mothers, share experiences, and get support
              </p>
            </div>
            <button className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">{communityData.stats.totalMembers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-semibold text-green-600">{communityData.stats.onlineMembers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts Today</span>
                  <span className="font-semibold">{communityData.stats.postsToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Discussions</span>
                  <span className="font-semibold">{communityData.stats.activeDiscussions}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-3">
                {communityData.categories.map((category) => (
                  <div key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.posts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Members */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Members</h3>
              <div className="space-y-4">
                {communityData.featuredMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{member.posts}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Share your experience or ask a question..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Discussion</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Support</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Advice</span>
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeFilter === filter.key
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search community..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  />
                </div>
              </div>
            </div>

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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
              <div className="space-y-1">
                {communityData.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Be kind and supportive to other mothers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Share experiences, not medical advice</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Respect different parenting choices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Celebrate each other's successes</span>
                </li>
              </ul>
            </div>

            {/* Quick Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Resources</h3>
              <div className="space-y-3">
                <Link to="/emergency-contacts" className="block p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  Emergency Contacts
                </Link>
                <Link to="/local-support" className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  Local Support Groups
                </Link>
                <Link to="/expert-advice" className="block p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  Expert Q&A Sessions
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