
import { useState } from "react";
import { Link } from "react-router-dom";
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
  Syringe,  // Changed from Vaccines to Syringe
  MoreVertical
} from "lucide-react";

const Children = () => {
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Ali Ahmed",
      age: "2 years, 3 months",
      birthDate: "2021-09-15",
      gender: "Male",
      weight: "12.5 kg",
      height: "88 cm",
      lastCheckup: "2024-01-15",
      nextVaccination: "2024-03-01",
      growthStatus: "good",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format",
      milestones: {
        achieved: 8,
        total: 12
      },
      upcomingVaccines: 2
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      age: "6 months",
      birthDate: "2023-08-10",
      gender: "Female",
      weight: "7.2 kg",
      height: "65 cm",
      lastCheckup: "2024-01-20",
      nextVaccination: "2024-02-15",
      growthStatus: "excellent",
      avatar: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=150&h=150&fit=crop&crop=face&auto=format",
      milestones: {
        achieved: 5,
        total: 8
      },
      upcomingVaccines: 1
    },
    {
      id: 3,
      name: "Omar Ahmed",
      age: "4 years",
      birthDate: "2020-02-20",
      gender: "Male",
      weight: "16.8 kg",
      height: "102 cm",
      lastCheckup: "2024-01-10",
      nextVaccination: "2024-06-15",
      growthStatus: "normal",
      avatar: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face&auto=format",
      milestones: {
        achieved: 10,
        total: 15
      },
      upcomingVaccines: 0
    }
  ]);

  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleDeleteChild = (childId: number) => {
    setChildren(children.filter(child => child.id !== childId));
    setActiveMenu(null);
  };

  const toggleMenu = (childId: number) => {
    setActiveMenu(activeMenu === childId ? null : childId);
  };

  const getGrowthStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "normal":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const ChildCard = ({ child }: { child: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={child.avatar}
            alt={child.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
            <p className="text-gray-600">{child.age} • {child.gender}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGrowthStatusColor(child.growthStatus)}`}>
              {child.growthStatus.charAt(0).toUpperCase() + child.growthStatus.slice(1)} Growth
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
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Weight className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-semibold text-gray-900">{child.weight}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Ruler className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Height</p>
            <p className="font-semibold text-gray-900">{child.height}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
          <Cake className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Milestones</p>
            <p className="font-semibold text-gray-900">
              {child.milestones.achieved}/{child.milestones.total}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
          <Syringe className="w-5 h-5 text-orange-600" /> {/* Changed to Syringe */}
          <div>
            <p className="text-sm text-gray-600">Vaccines Due</p>
            <p className="font-semibold text-gray-900">{child.upcomingVaccines}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Birth Date:</span>
          <span className="font-medium">{new Date(child.birthDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Last Checkup:</span>
          <span className="font-medium">{new Date(child.lastCheckup).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Next Vaccination:</span>
          <span className="font-medium">
            {child.nextVaccination ? new Date(child.nextVaccination).toLocaleDateString() : "None scheduled"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Growth Percentile:</span>
          <span className="font-medium">75th</span>
        </div>
      </div>

      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <Link
          to={`/child/${child.id}/growth`}
          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Growth
        </Link>
        <Link
          to={`/child/${child.id}/vaccinations`}
          className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Vaccinations
        </Link>
        <Link
          to={`/child/${child.id}/milestones`}
          className="flex-1 bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Milestones
        </Link>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <Baby className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No children added yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Start by adding your first child's profile to track their growth, vaccinations, and milestones.
      </p>
      <Link
        to="/add-child"
        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Your First Child
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
              <p className="text-gray-600 mt-2">
                Manage your children's profiles and track their development
              </p>
            </div>
            <Link
              to="/add-child"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Child
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Children</p>
                <p className="text-2xl font-bold text-gray-900">{children.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Baby className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Vaccinations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.reduce((acc, child) => acc + child.upcomingVaccines, 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Syringe className="w-6 h-6 text-green-600" /> {/* Changed to Syringe */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Milestones Achieved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.reduce((acc, child) => acc + child.milestones.achieved, 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Checkup</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/vaccinations"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                    <Syringe className="w-6 h-6 text-green-600" /> {/* Changed to Syringe */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Vaccination Schedule</h3>
                    <p className="text-sm text-gray-600 mt-1">View and manage all vaccinations</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/growth-tracking"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Growth Tracking</h3>
                    <p className="text-sm text-gray-600 mt-1">Monitor growth charts and percentiles</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/milestones"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <Heart className="w-6 h-6 text-purple-600" />
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