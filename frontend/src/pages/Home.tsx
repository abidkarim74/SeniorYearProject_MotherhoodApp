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
  Clock,
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mb-2">{description}</p>
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
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#fceaea] to-[#f8d8d8] group-hover:from-[#f8d8d8] group-hover:to-[#fceaea] transition-all duration-300">
          <Icon className="w-7 h-7 text-[#e5989b]" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Welcome Section */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5989b]/20 shadow-sm mb-4">
            <div className="w-2 h-2 bg-[#e5989b] rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Parenting Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
              {user?.firstname}
            </span>
            !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Here's your parenting dashboard for today. Track your children's growth and milestones in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Children Section */}
          <div className="xl:col-span-2 space-y-8">
            {/* My Children Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#e5989b]" />
                    My Children
                  </h2>
                  <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                    {children.length} registered
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {/* Children Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {children.map((child, index) => (
                    <Link
                      key={child.id}
                      to={`/childdetail/${child.id}`}
                      onClick={() => setActiveChild(index)}
                      className={`bg-gradient-to-br rounded-2xl p-4 border-2 transition-all duration-300 hover:shadow-lg group ${
                        activeChild === index
                          ? "from-[#fff1f1] to-[#fceaea] border-[#e5989b] shadow-md"
                          : "from-white to-gray-50 border-gray-200 hover:border-[#e5989b]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={
                              child.profile_pic ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={`${child.firstname} ${child.lastname}`}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#e5989b] transition-colors">
                            {child.firstname} {child.lastname}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{child.gender}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {child.date_of_birth ? 
                                new Date(child.date_of_birth).toLocaleDateString() : 
                                'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Add Child Card */}
                  <Link
                    to="/add-child"
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-300 hover:border-[#e5989b] hover:from-[#fff1f1] hover:to-[#fceaea] transition-all duration-300 group flex items-center justify-center min-h-[88px]"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[#e5989b] font-medium text-sm">Add Child</span>
                    </div>
                  </Link>
                </div>

                {/* Active Child Details */}
                {children.length > 0 && currentChild && (
                  <div className="bg-gradient-to-br from-[#fff6f6] to-[#fceaea] rounded-2xl p-6 border border-[#e5989b]/20">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#e5989b]" />
                      {currentChild.firstname} {currentChild.lastname}'s Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-[#e5989b]/10">
                          <span className="text-gray-600 font-medium">Gender</span>
                          <span className="text-gray-900 font-semibold">{currentChild.gender}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#e5989b]/10">
                          <span className="text-gray-600 font-medium">Date of Birth</span>
                          <span className="text-gray-900 font-semibold">
                            {new Date(currentChild.date_of_birth).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-[#e5989b]/10">
                          <span className="text-gray-600 font-medium">Age</span>
                          <span className="text-gray-900 font-semibold">
                            {Math.floor((new Date().getTime() - new Date(currentChild.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#e5989b]/10">
                          <span className="text-gray-600 font-medium">Status</span>
                          <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Notifications Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#e5989b]" />
                  Recent Notifications
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Syringe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vaccination Reminder</p>
                      <p className="text-sm text-gray-600 mt-1">Upcoming vaccination in 2 days</p>
                      <p className="text-xs text-blue-600 mt-1">Due: March 15, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Growth Update</p>
                      <p className="text-sm text-gray-600 mt-1">Growth chart has been updated</p>
                      <p className="text-xs text-green-600 mt-1">New measurements recorded</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Checkup Scheduled</p>
                      <p className="text-sm text-gray-600 mt-1">Next checkup in 1 week</p>
                      <p className="text-xs text-purple-600 mt-1">March 20, 2024 at 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 text-center text-sm text-[#e5989b] font-medium hover:text-[#d88a8d] transition-colors py-2">
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/vaccinations"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:shadow-md group"
                  >
                    <Syringe className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Vaccinations</span>
                  </Link>
                  <Link
                    to="/growth"
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:shadow-md group"
                  >
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Growth Track</span>
                  </Link>
                  <Link
                    to="/milestones"
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:shadow-md group"
                  >
                    <Baby className="w-6 h-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Milestones</span>
                  </Link>
                  <Link
                    to="/community"
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200 hover:shadow-md group"
                  >
                    <Users className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Community</span>
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