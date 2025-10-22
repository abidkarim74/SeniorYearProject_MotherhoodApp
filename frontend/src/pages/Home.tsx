import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Baby, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Users, 
  Heart,
  ArrowUp,
  ArrowDown,
  Clock,
  MessageCircle
} from "lucide-react";

const Home = () => {
  const [activeChild, setActiveChild] = useState(0);

  // Mock data for the dashboard
  const mockData = {
    mother: {
      name: "Ayesha Khan",
      childrenCount: 2,
      upcomingAppointments: 3,
      unreadMessages: 5
    },
    children: [
      {
        id: 1,
        name: "Ali Ahmed",
        age: "2 years, 3 months",
        birthDate: "2021-09-15",
        weight: "12.5 kg",
        height: "88 cm",
        lastCheckup: "2024-01-15",
        nextVaccination: "2024-03-01",
        growthStatus: "good",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format"
      },
      {
        id: 2,
        name: "Fatima Ahmed",
        age: "6 months",
        birthDate: "2023-08-10",
        weight: "7.2 kg",
        height: "65 cm",
        lastCheckup: "2024-01-20",
        nextVaccination: "2024-02-15",
        growthStatus: "excellent",
        avatar: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=150&h=150&fit=crop&crop=face&auto=format"
      }
    ],
    upcomingVaccinations: [
      {
        id: 1,
        childName: "Fatima Ahmed",
        vaccine: "PCV Booster",
        date: "2024-02-15",
        daysLeft: 5,
        status: "upcoming"
      },
      {
        id: 2,
        childName: "Ali Ahmed",
        vaccine: "MMR Second Dose",
        date: "2024-03-01",
        daysLeft: 20,
        status: "upcoming"
      }
    ],
    growthMetrics: {
      weight: {
        current: 12.5,
        previous: 12.2,
        trend: "up",
        change: 0.3
      },
      height: {
        current: 88,
        previous: 86,
        trend: "up",
        change: 2
      },
      milestones: {
        achieved: 8,
        total: 12,
        percentage: 67
      }
    },
    recentActivities: [
      {
        id: 1,
        childName: "Ali Ahmed",
        activity: "Weight measurement recorded",
        time: "2 hours ago",
        type: "measurement"
      },
      {
        id: 2,
        childName: "Fatima Ahmed",
        activity: "Vaccination reminder sent",
        time: "5 hours ago",
        type: "reminder"
      },
      {
        id: 3,
        childName: "Ali Ahmed",
        activity: "New forum post in Parenting Tips",
        time: "1 day ago",
        type: "community"
      }
    ],
    communityStats: {
      forumPosts: 12,
      replies: 23,
      friends: 8
    }
  };

  const currentChild = mockData.children[activeChild];

  // Updated StatCard component with optional trend and change props
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    change, 
    color = "blue" 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    trend?: "up" | "down"; 
    change?: number; 
    color?: string; 
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              {trend === "up" ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{change} {title.includes("Weight") ? "kg" : title.includes("Height") ? "cm" : ""}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          color === "blue" ? "bg-blue-50" :
          color === "green" ? "bg-green-50" :
          color === "purple" ? "bg-purple-50" :
          "bg-orange-50"
        }`}>
          <Icon className={`w-6 h-6 ${
            color === "blue" ? "text-blue-600" :
            color === "green" ? "text-green-600" :
            color === "purple" ? "text-purple-600" :
            "text-orange-600"
          }`} />
        </div>
      </div>
    </div>
  );

  const VaccineCard = ({ vaccine }: { vaccine: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{vaccine.vaccine}</h4>
          <p className="text-sm text-gray-600 mt-1">{vaccine.childName}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(vaccine.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {vaccine.daysLeft} days
          </span>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-start space-x-3 py-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {activity.childName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {activity.activity}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {activity.time}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {mockData.mother.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your parenting dashboard for today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Children"
            value={mockData.mother.childrenCount}
            icon={Baby}
            color="blue"
          />
          <StatCard
            title="Upcoming Vaccinations"
            value={mockData.mother.upcomingAppointments}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Community Messages"
            value={mockData.mother.unreadMessages}
            icon={MessageCircle}
            color="purple"
          />
          <StatCard
            title="Milestones Completed"
            value={`${mockData.growthMetrics.milestones.achieved}/${mockData.growthMetrics.milestones.total}`}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Children & Growth */}
          <div className="lg:col-span-2 space-y-8">
            {/* Children Profiles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6">
                  {mockData.children.map((child, index) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveChild(index)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        activeChild === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{child.name}</p>
                        <p className="text-sm text-gray-600">{child.age}</p>
                      </div>
                    </button>
                  ))}
                  <Link
                    to="/add-child"
                    className="flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Baby className="w-6 h-6 text-gray-400" />
                    <span className="ml-2 text-gray-600">Add Child</span>
                  </Link>
                </div>

                {/* Current Child Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {currentChild.name}'s Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{currentChild.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{currentChild.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{currentChild.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Checkup:</span>
                        <span className="font-medium">
                          {new Date(currentChild.lastCheckup).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Growth Metrics
                    </h3>
                    <div className="space-y-4">
                      <StatCard
                        title="Weight"
                        value={`${mockData.growthMetrics.weight.current} kg`}
                        // trend={mockData.growthMetrics.weight.trend}
                        change={mockData.growthMetrics.weight.change}
                        icon={TrendingUp}
                        color="green"
                      />
                      <StatCard
                        title="Height"
                        value={`${mockData.growthMetrics.height.current} cm`}
                        // trend={mockData.growthMetrics.height.trend}
                        change={mockData.growthMetrics.height.change}
                        icon={TrendingUp}
                        color="blue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Vaccinations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Vaccinations
                </h2>
                <Link
                  to="/vaccinations"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockData.upcomingVaccinations.map((vaccine) => (
                    <VaccineCard key={vaccine.id} vaccine={vaccine} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activities & Community */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-1">
                  {mockData.recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Community
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Forum Posts</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {mockData.communityStats.forumPosts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Replies Received</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {mockData.communityStats.replies}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="text-gray-700">Community Friends</span>
                    </div>
                    <span className="font-semibold text-purple-600">
                      {mockData.communityStats.friends}
                    </span>
                  </div>
                </div>
                <Link
                  to="/community"
                  className="block w-full mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;