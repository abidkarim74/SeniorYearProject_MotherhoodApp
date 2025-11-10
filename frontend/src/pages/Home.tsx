import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRequest } from "../api/requests";
import {
  Baby,
  Calendar,
  TrendingUp,
  Bell,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Plus,
  Heart,
  Syringe,
  Users
} from "lucide-react";

const Home = () => {
  const { accessToken, user } = useAuth();

  console.log("User: ", user);

  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await getRequest("/user-profile/get-children");
        setChildren(response || []);
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [accessToken]);

  const currentChild = children[activeChild];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    change,
    description,
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    change?: number;
    description?: string;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mb-2 truncate">{description}</p>
          )}
          {trend && change !== undefined && (
            <div
              className={`flex items-center text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{change}%</span>
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#fceaea] to-[#f8d8d8] group-hover:from-[#f8d8d8] group-hover:to-[#fceaea] transition-all duration-300 flex-shrink-0 ml-2">
          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#e5989b]" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff6f6]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5989b]/20 shadow-sm mb-3">
            <div className="w-1.5 h-1.5 bg-[#e5989b] rounded-full animate-pulse mr-1.5"></div>
            <span className="text-xs sm:text-sm text-gray-600">Parenting Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
              {user?.firstname}
            </span>
            !
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            Here's your parenting dashboard for today. Track your children's growth and milestones in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard 
            title="My Children" 
            value={children.length || 0} 
            icon={Baby}
            description="Total registered"
          />
          <StatCard 
            title="Upcoming Vaccinations" 
            value={3} 
            icon={Syringe}
            description="Next 30 days"
            trend="up"
            change={12}
          />
          <StatCard 
            title="Community Messages" 
            value={5} 
            icon={MessageCircle}
            description="Unread messages"
          />
          <StatCard 
            title="Milestones Completed" 
            value="8/12" 
            icon={TrendingUp}
            description="This month"
            trend="up"
            change={25}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Children Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* My Children Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#e5989b]" />
                    My Children
                  </h2>
                  <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                    {children.length} registered
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
                  {children.map((child, index) => (
                    <div
                      key={child.id}
                      onClick={() => setActiveChild(index)}
                      className={`bg-gradient-to-br rounded-xl sm:rounded-2xl p-3 border-2 transition-all duration-300 hover:shadow-lg group cursor-pointer ${
                        activeChild === index
                          ? "from-[#fff1f1] to-[#fceaea] border-[#e5989b] shadow-md"
                          : "from-white to-gray-50 border-gray-200 hover:border-[#e5989b]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              child.profile_pic ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={`${child.firstname} ${child.lastname}`}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm group-hover:text-[#e5989b] transition-colors">
                            {child.firstname} {child.lastname}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs text-gray-600 capitalize">{child.gender}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600 truncate">
                              {child.date_of_birth ? 
                                new Date(child.date_of_birth).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 
                                'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Child Card */}
                  <Link
                    to="/add-child"
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 border-2 border-dashed border-gray-300 hover:border-[#e5989b] hover:from-[#fff1f1] hover:to-[#fceaea] transition-all duration-300 group flex items-center justify-center min-h-[72px]"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform duration-300">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-[#e5989b] font-medium text-xs">Add Child</span>
                    </div>
                  </Link>
                </div>

                {/* Active Child Details */}
                {children.length > 0 && currentChild && (
                  <div className="bg-gradient-to-br from-[#fff6f6] to-[#fceaea] rounded-xl sm:rounded-2xl p-4 border border-[#e5989b]/20 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#e5989b] flex-shrink-0" />
                        <span className="truncate">{currentChild.firstname}'s Profile</span>
                      </h3>
                      <Link 
                        to={`/child-detail/${currentChild.id}`}
                        className="text-xs text-[#e5989b] font-medium hover:text-[#d88a8d] transition-colors flex-shrink-0 text-right"
                      >
                        View Full Profile →
                      </Link>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Profile Picture Section */}
                      <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                        <div className="relative">
                          <img
                            src={
                              currentChild.profile_pic ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={`${currentChild.firstname} ${currentChild.lastname}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 text-sm truncate max-w-[100px] sm:max-w-[120px]">
                            {currentChild.firstname}
                          </h4>
                          <p className="text-xs text-gray-600 capitalize">{currentChild.gender}</p>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center py-1 border-b border-[#e5989b]/10">
                              <span className="text-xs text-gray-600 font-medium">Date of Birth</span>
                              <span className="text-xs text-gray-900 font-semibold text-right">
                                {new Date(currentChild.date_of_birth).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-[#e5989b]/10">
                              <span className="text-xs text-gray-600 font-medium">Age</span>
                              <span className="text-xs text-gray-900 font-semibold">
                                {Math.floor((new Date().getTime() - new Date(currentChild.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-[#e5989b]/10">
                              <span className="text-xs text-gray-600 font-medium">Status</span>
                              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-3 flex gap-1.5">
                          <Link
                            to={`/childdetail/${currentChild.id}/growth`}
                            className="flex-1 text-center bg-white border border-[#e5989b]/20 rounded-lg py-1.5 px-2 text-xs font-medium text-[#e5989b] hover:bg-[#e5989b] hover:text-white transition-all duration-300 min-w-0 truncate"
                          >
                            Growth
                          </Link>
                          <Link
                            to={`/childdetail/${currentChild.id}/vaccinations`}
                            className="flex-1 text-center bg-white border border-[#e5989b]/20 rounded-lg py-1.5 px-2 text-xs font-medium text-[#e5989b] hover:bg-[#e5989b] hover:text-white transition-all duration-300 min-w-0 truncate"
                          >
                            Vaccinations
                          </Link>
                          <Link
                            to={`/childdetail/${currentChild.id}/milestones`}
                            className="flex-1 text-center bg-white border border-[#e5989b]/20 rounded-lg py-1.5 px-2 text-xs font-medium text-[#e5989b] hover:bg-[#e5989b] hover:text-white transition-all duration-300 min-w-0 truncate"
                          >
                            Milestones
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Notifications Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#e5989b]" />
                  Recent Notifications
                </h3>
              </div>
              <div className="p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Syringe className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Vaccination Reminder</p>
                      <p className="text-xs text-gray-600 mt-0.5">Upcoming vaccination in 2 days</p>
                      <p className="text-xs text-blue-600 mt-0.5">Due: Mar 15, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 p-2 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Growth Update</p>
                      <p className="text-xs text-gray-600 mt-0.5">Growth chart has been updated</p>
                      <p className="text-xs text-green-600 mt-0.5">New measurements recorded</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 p-2 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Checkup Scheduled</p>
                      <p className="text-xs text-gray-600 mt-0.5">Next checkup in 1 week</p>
                      <p className="text-xs text-purple-600 mt-0.5">Mar 20, 2024 at 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-3 text-center text-xs text-[#e5989b] font-medium hover:text-[#d88a8d] transition-colors py-1.5">
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/vaccinations"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 text-center hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:shadow-md group"
                  >
                    <Syringe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-900">Vaccinations</span>
                  </Link>
                  <Link
                    to="/growth"
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 text-center hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:shadow-md group"
                  >
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-900">Growth Track</span>
                  </Link>
                  <Link
                    to="/milestones"
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 text-center hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:shadow-md group"
                  >
                    <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-900">Milestones</span>
                  </Link>
                  <Link
                    to="/community"
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 text-center hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200 hover:shadow-md group"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-900">Community</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;