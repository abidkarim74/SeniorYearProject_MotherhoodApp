import { 
  Users, 
  MessageSquare, 
  Bookmark, 
  TrendingUp, 
  Calendar,
  Star,
  Shield,
  ChevronRight,
  Home,
  Heart,
  Zap,
  Clock
} from "lucide-react";

const CommunityLeftSidebar = () => {
  // Dummy data for online users
  const onlineUsers = [
    { id: 1, name: "Alex Morgan", role: "Mom of 2", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face", isActive: true },
    { id: 2, name: "James Wilson", role: "Dad", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", isActive: true },
    { id: 3, name: "Sophia Lee", role: "Pediatric Nurse", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", isActive: false },
    { id: 4, name: "Robert Kim", role: "Parent Coach", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", isActive: true },
    { id: 5, name: "Emma Davis", role: "Mom of Twins", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", isActive: true },
  ];

  // Dummy data for popular categories
  const popularCategories = [
    { id: 1, name: "New Parents", posts: 245, icon: <Home className="w-4 h-4" />, color: "text-pink-600" },
    { id: 2, name: "Toddler Tips", posts: 189, icon: <Zap className="w-4 h-4" />, color: "text-blue-600" },
    { id: 3, name: "Health & Safety", posts: 167, icon: <Shield className="w-4 h-4" />, color: "text-green-600" },
    { id: 4, name: "Nutrition", posts: 134, icon: <Heart className="w-4 h-4" />, color: "text-orange-600" },
    { id: 5, name: "Sleep Training", posts: 98, icon: <Clock className="w-4 h-4" />, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#e5989b]" />
          Community Stats
        </h3>
        
        <div className="space-y-3">
          {/* Online Users */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#fff6f6]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#fceaea]">
                <Users className="w-4 h-4 text-[#e5989b]" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Online Now</p>
                <p className="text-sm font-bold text-gray-900">124</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                  />
                  {user.isActive && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Posts */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#fff6f6]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#fceaea]">
                <MessageSquare className="w-4 h-4 text-[#e5989b]" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Posts Today</p>
                <p className="text-sm font-bold text-gray-900">5,678</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>

          {/* Total Users */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#fff6f6]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#fceaea]">
                <Users className="w-4 h-4 text-[#e5989b]" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Members</p>
                <p className="text-sm font-bold text-gray-900">42.8K</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
              ↗ Growing
            </span>
          </div>
        </div>
      </div>

      {/* Saved Posts Button */}
      <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border border-[#e5989b]/20 rounded-xl hover:shadow-md transition-all group">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/80 group-hover:bg-white transition-colors">
            <Bookmark className="w-5 h-5 text-[#e5989b]" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-gray-900 text-sm">Saved Posts</h4>
            <p className="text-xs text-gray-600">24 saved items</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#e5989b] group-hover:translate-x-1 transition-transform" />
      </button>

     
    </div>
  );
};

export default CommunityLeftSidebar;