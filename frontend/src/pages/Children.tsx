import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRequest } from "../api/requests";
import { 
  Baby, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  TrendingUp,
  Heart,
  Weight,
  Ruler,
  Cake,
  Syringe,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const Children = () => {
  const { accessToken, user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

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

  const handleDeleteChild = (childId: number) => {
    setChildren(children.filter(child => child.id !== childId));
    setActiveMenu(null);
  };

  const toggleMenu = (childId: number) => {
    setActiveMenu(activeMenu === childId ? null : childId);
  };

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

  const getGrowthStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "good":
        return "text-[#e5989b] bg-[#fceaea] border-[#e5989b]/20";
      case "normal":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const ChildCard = ({ child }: { child: any }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={
              child.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={`${child.firstname} ${child.lastname}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#e5989b]/20"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {child.firstname} {child.lastname}
            </h3>
            <p className="text-gray-600">{child.age || "N/A"} • {child.gender}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGrowthStatusColor(child.growthStatus || "normal")}`}>
              {(child.growthStatus || "normal").charAt(0).toUpperCase() + (child.growthStatus || "normal").slice(1)} Growth
            </span>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => toggleMenu(child.id)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {activeMenu === child.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Growth Chart
                </button>
                <button 
                  onClick={() => handleDeleteChild(child.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 p-3 bg-[#f0f7ff] rounded-lg border border-[#e5989b]/10">
          <Weight className="w-5 h-5 text-[#e5989b]" />
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-semibold text-gray-900">{child.weight || "N/A"} kg</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-[#f0f8f4] rounded-lg border border-[#e5989b]/10">
          <Ruler className="w-5 h-5 text-[#e5989b]" />
          <div>
            <p className="text-sm text-gray-600">Height</p>
            <p className="font-semibold text-gray-900">{child.height || "N/A"} cm</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-[#f8f0fb] rounded-lg border border-[#e5989b]/10">
          <Cake className="w-5 h-5 text-[#e5989b]" />
          <div>
            <p className="text-sm text-gray-600">Milestones</p>
            <p className="font-semibold text-gray-900">
              {child.milestones?.achieved || 0}/{child.milestones?.total || 0}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-[#fff4e6] rounded-lg border border-[#e5989b]/10">
          <Syringe className="w-5 h-5 text-[#e5989b]" />
          <div>
            <p className="text-sm text-gray-600">Vaccines Due</p>
            <p className="font-semibold text-gray-900">{child.upcomingVaccines || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Birth Date:</span>
          <span className="font-medium">
            {child.date_of_birth ? new Date(child.date_of_birth).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Last Checkup:</span>
          <span className="font-medium">
            {child.lastCheckup ? new Date(child.lastCheckup).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Next Vaccination:</span>
          <span className="font-medium">
            {child.nextVaccination ? new Date(child.nextVaccination).toLocaleDateString() : "None scheduled"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Growth Percentile:</span>
          <span className="font-medium">{child.growthPercentile || "N/A"}</span>
        </div>
      </div>

      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <Link
          to={`/child/${child.id}/growth`}
          className="flex-1 bg-[#e5989b] text-white text-center py-2 px-4 rounded-lg hover:bg-[#d88a8d] transition-colors text-sm font-medium"
        >
          View Growth
        </Link>
        <Link
          to={`/child/${child.id}/vaccinations`}
          className="flex-1 bg-[#e5989b] text-white text-center py-2 px-4 rounded-lg hover:bg-[#d88a8d] transition-colors text-sm font-medium"
        >
          Vaccinations
        </Link>
        <Link
          to={`/child/${child.id}/milestones`}
          className="flex-1 bg-[#e5989b] text-white text-center py-2 px-4 rounded-lg hover:bg-[#d88a8d] transition-colors text-sm font-medium"
        >
          Milestones
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#fff6f6]">
        Loading your children...
      </div>
    );
  }

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#fceaea] flex items-center justify-center">
        <Baby className="w-12 h-12 text-[#e5989b]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No children added yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Start by adding your first child's profile to track their growth, vaccinations, and milestones.
      </p>
      <Link
        to="/add-child"
        className="inline-flex items-center bg-[#e5989b] text-white px-6 py-3 rounded-lg hover:bg-[#d88a8d] transition-colors font-medium"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Your First Child
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff6f6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Children, <span className="text-[#e5989b]">{user?.firstname}</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your children's profiles and track their development
              </p>
            </div>
            <Link
              to="/add-child"
              className="inline-flex items-center bg-[#e5989b] text-white px-6 py-3 rounded-lg hover:bg-[#d88a8d] transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Child
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Children" 
            value={children.length} 
            icon={Baby} 
          />
          <StatCard 
            title="Upcoming Vaccinations" 
            value={children.reduce((acc, child) => acc + (child.upcomingVaccines || 0), 0)} 
            icon={Syringe} 
          />
          <StatCard 
            title="Milestones Achieved" 
            value={children.reduce((acc, child) => acc + (child.milestones?.achieved || 0), 0)} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Next Checkup" 
            value={new Date().toLocaleDateString()} 
            icon={Calendar} 
          />
        </div>

        {/* Children List */}
        <div className="space-y-6">
          {children.length > 0 ? (
            children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Quick Actions */}
        {children.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-[#e5989b] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/vaccinations"
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#fceaea] group-hover:bg-[#f8d8d8] transition-colors">
                    <Syringe className="w-6 h-6 text-[#e5989b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Vaccination Schedule</h3>
                    <p className="text-sm text-gray-600 mt-1">View and manage all vaccinations</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/growth-tracking"
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#fceaea] group-hover:bg-[#f8d8d8] transition-colors">
                    <TrendingUp className="w-6 h-6 text-[#e5989b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Growth Tracking</h3>
                    <p className="text-sm text-gray-600 mt-1">Monitor growth charts and percentiles</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/milestones"
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#fceaea] group-hover:bg-[#f8d8d8] transition-colors">
                    <Heart className="w-6 h-6 text-[#e5989b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Development Milestones</h3>
                    <p className="text-sm text-gray-600 mt-1">Track developmental progress</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default Children;