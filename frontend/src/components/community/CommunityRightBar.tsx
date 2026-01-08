import { Trophy, Heart, Flame, TrendingUp } from "lucide-react";

const CommunityRightSidebar = () => {
  // Top contributors data with total likes
  const topContributors = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      role: "Pediatrician",
      likes: 142, // Total likes
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      username: "@milec",
      role: "Parent",
      likes: 1876, // Total likes
      note: "Twins", // Additional note without number
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      username: "@emmar",
      role: "Child Psychologist",
      likes: 156, // Total likes
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Wilson",
      username: "@davidw",
      role: "Experienced Dad",
      likes: 87, // Total likes
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
  ];

  // Trending topics data
  const trendingTopics = [
    { id: 1, name: "Sleep Training", posts: 245, trend: "up" },
    { id: 2, name: "Vaccination Tips", posts: 189, trend: "up" },
    { id: 3, name: "Potty Training", posts: 167, trend: "stable" },
    { id: 4, name: "Healthy Snacks", posts: 134, trend: "up" },
    { id: 5, name: "Screen Time", posts: 98, trend: "down" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-4 xl:space-y-5 pb-6">
      {/* Top Contributors Card - Smaller version */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="px-3 sm:px-4 py-2 lg:py-1.5 xl:py-2 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-xs xl:text-sm flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-[#e5989b]" />
                <span className="truncate">Top Contributors</span>
              </h3>
              <p className="text-xs lg:text-[11px] xl:text-xs text-gray-600 mt-0.5 truncate">Most active community members</p>
            </div>
          </div>
        </div>
        
        <div className="p-2.5 sm:p-3 lg:p-2 xl:p-3">
          <div className="space-y-2 sm:space-y-3 lg:space-y-2 xl:space-y-2.5">
            {topContributors.map((contributor) => (
              <div 
                key={contributor.id} 
                className="flex items-start gap-1.5 sm:gap-2.5 lg:gap-1.5 xl:gap-2 p-1.5 sm:p-2.5 lg:p-1.5 xl:p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-100"
              >
                {/* Avatar - Smaller sizing */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={contributor.avatar} 
                      alt={contributor.name} 
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full border border-white shadow-xs object-cover"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* User Info - Smaller text sizing */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-xs xl:text-sm group-hover:text-[#e5989b] transition-colors truncate">
                        {contributor.name}
                      </h4>
                      <p className="text-xs lg:text-[11px] xl:text-xs text-gray-500 truncate">{contributor.username}</p>
                    </div>
                    {/* Likes display - Smaller */}
                    <div className="flex items-center gap-0.5 text-gray-600">
                      <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 flex-shrink-0 text-red-400" />
                      <span className="text-xs lg:text-[11px] xl:text-xs font-medium">{contributor.likes}</span>
                    </div>
                  </div>
                  
                  {/* Role & Additional Info - Smaller */}
                  <div className="mt-1 sm:mt-1.5 lg:mt-1 xl:mt-1.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="inline-block px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 lg:px-1.5 lg:py-0.5 xl:px-2 xl:py-0.5 bg-gradient-to-r from-[#fff6f6] to-[#fceaea] text-[#e5989b] text-xs lg:text-[11px] xl:text-xs font-medium rounded-full border border-[#e5989b]/20 truncate max-w-full">
                      {contributor.role}
                    </span>
                    {contributor.note && (
                      <p className="text-xs lg:text-[11px] xl:text-xs text-gray-600">
                        {contributor.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button - Smaller */}
          <button className="w-full mt-2.5 sm:mt-3 lg:mt-2 xl:mt-3 py-1.5 sm:py-2 lg:py-1.5 xl:py-2 text-center text-xs lg:text-[11px] xl:text-xs text-[#e5989b] font-semibold hover:text-[#d88a8d] transition-colors rounded-lg hover:bg-gradient-to-r hover:from-[#fff6f6] hover:to-[#fceaea] border border-[#e5989b]/30 hover:border-[#e5989b]/50">
            View All Contributors →
          </button>
        </div>
      </div>

      {/* Trending Topics Card - Original sizing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="px-3 sm:px-4 py-2.5 lg:py-2 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg lg:text-sm xl:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-[#e5989b]" />
                <span className="truncate">Trending Topics</span>
              </h3>
              <p className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-600 mt-0.5 truncate">What parents are talking about</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 lg:p-3 xl:p-4">
          <div className="space-y-2 sm:space-y-3 lg:space-y-1.5 xl:space-y-2.5">
            {trendingTopics.map((topic) => (
              <div 
                key={topic.id} 
                className="flex items-center justify-between p-2 sm:p-3 lg:p-1.5 xl:p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-2 xl:gap-3 min-w-0">
                  {/* Topic Icon - Responsive sizing */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-[#fff1f1] to-[#fceaea] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <span className="text-sm sm:text-lg lg:text-sm xl:text-lg font-bold text-[#e5989b]">#</span>
                  </div>
                  
                  {/* Topic Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-sm xl:text-base group-hover:text-[#e5989b] transition-colors truncate">
                      {topic.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-1 xl:gap-2 mt-0.5">
                      <span className="text-xs lg:text-xs xl:text-sm text-gray-500">{topic.posts} posts</span>
                      <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-1.5 lg:py-0.5 xl:px-2 xl:py-0.5 rounded-full text-xs lg:text-xs xl:text-sm font-medium ${
                        topic.trend === 'up' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : topic.trend === 'down' 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-gray-50 text-gray-700 border border-gray-100'
                      }`}>
                        <TrendingUp className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 ${topic.trend === 'down' ? 'transform rotate-180' : ''}`} />
                        <span className="hidden sm:inline lg:hidden xl:inline">
                          {topic.trend === 'up' ? 'Trending' : topic.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                        <span className="sm:hidden lg:inline xl:hidden">
                          {topic.trend === 'up' ? '↑' : topic.trend === 'down' ? '↓' : '→'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Join Button - Responsive behavior */}
                <div className="flex items-center">
                  <button className="hidden lg:inline-flex items-center text-xs lg:text-xs xl:text-sm bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm opacity-0 group-hover:opacity-100">
                    Join
                  </button>
                  
                  {/* Mobile join indicator */}
                  <div className="lg:hidden">
                    <div className="w-2 h-2 rounded-full bg-[#e5989b] opacity-70"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Explore More Button */}
          <button className="w-full mt-3 sm:mt-4 lg:mt-3 xl:mt-4 py-1.5 sm:py-2.5 lg:py-1.5 xl:py-2.5 text-center text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-700 font-medium hover:text-[#e5989b] transition-colors rounded-lg hover:bg-gray-50 border border-gray-200 hover:border-[#e5989b]/30">
            Explore More Topics
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default CommunityRightSidebar;