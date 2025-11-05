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
  MessageCircle
} from "lucide-react";

const Home = () => {
  const { accessToken, user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch children on mount
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
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    change?: number;
  }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && change !== undefined && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-[#fceaea]">
          <Icon className="w-6 h-6 text-[#e5989b]" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff6f6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back,{" "}
            <span className="text-[#e5989b]">{user.firstname}</span>!
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s your parenting dashboard for today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="My Children" value={children.length || 0} icon={Baby} />
          <StatCard title="Upcoming Vaccinations" value={3} icon={Calendar} />
          <StatCard title="Community Messages" value={5} icon={MessageCircle} />
          <StatCard title="Milestones Completed" value="8/12" icon={TrendingUp} />
        </div>

        {/* Children Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-[#fceaea] rounded-t-xl">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Children
                </h2>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6 overflow-x-auto">
                  {children.map((child, index) => (
                    <Link
                      key={index}
                      to={`/childdetail/${child.id}`}
                      onClick={() => setActiveChild(index)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        activeChild === index
                          ? "border-[#e5989b] bg-[#fff1f1]"
                          : "border-gray-200 hover:border-[#e5989b]/60"
                      }`}
                    >
                      <img
                        src={
                          child.profile_pic ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={`${child.firstname} ${child.lastname}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {child.firstname} {child.lastname}
                        </p>
                        <p className="text-sm text-gray-600">{child.gender}</p>
                      </div>
                    </Link>
                  ))}

                  <Link
                    to="/add-child"
                    className="flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed border-[#e5989b]/50 hover:border-[#e5989b] hover:bg-[#fff1f1] transition-all"
                  >
                    <Baby className="w-6 h-6 text-[#e5989b]" />
                    <span className="ml-2 text-[#e5989b] font-medium">
                      Add Child
                    </span>
                  </Link>
                </div>

                {/* Active Child Details */}
                {children.length > 0 && currentChild && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#fff6f6] p-5 rounded-lg border border-[#e5989b]/20">
                      <h3 className="text-lg font-semibold text-[#e5989b] mb-4">
                        {currentChild.firstname} {currentChild.lastname}’s
                        Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-700">
                          <span>Gender:</span>
                          <span className="font-medium">
                            {currentChild.gender}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Date of Birth:</span>
                          <span className="font-medium">
                            {new Date(
                              currentChild.date_of_birth
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="bg-[#fff6f6] p-5 rounded-lg border border-[#e5989b]/20">
                      <h3 className="text-lg font-semibold text-[#e5989b] mb-4">
                        Health Overview
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span className="font-medium">
                            {currentChild.height || "N/A"} cm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="font-medium">
                            {currentChild.weight || "N/A"} kg
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar (Activities) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#e5989b] mb-4">
                Recent Notifications
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-[#e5989b]" />
                  <span>Vaccination reminder in 2 days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-[#e5989b]" />
                  <span>Growth chart updated</span>
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
