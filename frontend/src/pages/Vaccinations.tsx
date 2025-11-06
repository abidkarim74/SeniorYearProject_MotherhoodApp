import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Syringe, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Filter,
  Download,
  Bell,
  Plus,
  Baby,
  Search,
  TrendingUp,
  Users,
  FileText,
  Shield,
  Zap
} from "lucide-react";

const Vaccinations = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for vaccinations
  const vaccinationData = {
    children: [
      {
        id: 1,
        name: "Ali Ahmed",
        age: "2 years, 3 months",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format"
      },
      {
        id: 2,
        name: "Fatima Ahmed",
        age: "6 months",
        avatar: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=150&h=150&fit=crop&crop=face&auto=format"
      }
    ],
    vaccinations: [
      {
        id: 1,
        childId: 2,
        childName: "Fatima Ahmed",
        vaccine: "PCV Booster (Pneumococcal)",
        date: "2024-02-15",
        dueDate: "2024-02-15",
        status: "upcoming",
        daysLeft: 5,
        category: "routine",
        description: "Protects against pneumococcal diseases including pneumonia, meningitis, and bloodstream infections",
        administeredDate: null,
        doctor: "Dr. Sarah Khan",
        location: "City Children's Hospital",
        importance: "high"
      },
      {
        id: 2,
        childId: 1,
        childName: "Ali Ahmed",
        vaccine: "MMR Second Dose (Measles, Mumps, Rubella)",
        date: "2024-03-01",
        dueDate: "2024-03-01",
        status: "upcoming",
        daysLeft: 20,
        category: "routine",
        description: "Protects against measles, mumps, and rubella viruses",
        administeredDate: null,
        doctor: "Dr. Ahmed Raza",
        location: "Community Health Center",
        importance: "high"
      },
      {
        id: 3,
        childId: 2,
        childName: "Fatima Ahmed",
        vaccine: "Rotavirus Third Dose",
        date: "2024-01-10",
        dueDate: "2024-01-10",
        status: "completed",
        daysLeft: 0,
        category: "routine",
        description: "Protects against rotavirus gastroenteritis",
        administeredDate: "2024-01-10",
        doctor: "Dr. Sarah Khan",
        location: "City Children's Hospital",
        importance: "medium"
      },
      {
        id: 4,
        childId: 1,
        childName: "Ali Ahmed",
        vaccine: "Hepatitis A First Dose",
        date: "2023-12-15",
        dueDate: "2023-12-15",
        status: "completed",
        daysLeft: 0,
        category: "routine",
        description: "Protects against hepatitis A virus",
        administeredDate: "2023-12-15",
        doctor: "Dr. Ahmed Raza",
        location: "Community Health Center",
        importance: "medium"
      },
      {
        id: 5,
        childId: 2,
        childName: "Fatima Ahmed",
        vaccine: "Influenza (Seasonal Flu)",
        date: "2024-04-01",
        dueDate: "2024-04-01",
        status: "scheduled",
        daysLeft: 45,
        category: "seasonal",
        description: "Annual flu vaccine to protect against seasonal influenza",
        administeredDate: null,
        doctor: "Dr. Sarah Khan",
        location: "City Children's Hospital",
        importance: "medium"
      },
      {
        id: 6,
        childId: 1,
        childName: "Ali Ahmed",
        vaccine: "Typhoid Conjugate Vaccine",
        date: "2023-11-20",
        dueDate: "2023-11-20",
        status: "completed",
        daysLeft: 0,
        category: "recommended",
        description: "Protects against typhoid fever",
        administeredDate: "2023-11-20",
        doctor: "Dr. Ahmed Raza",
        location: "Community Health Center",
        importance: "low"
      }
    ],
    stats: {
      total: 6,
      upcoming: 3,
      completed: 3,
      overdue: 0
    }
  };

  const filters = [
    { key: "all", label: "All Vaccinations", count: vaccinationData.stats.total, icon: Syringe },
    { key: "upcoming", label: "Upcoming", count: vaccinationData.stats.upcoming, icon: Clock },
    { key: "completed", label: "Completed", count: vaccinationData.stats.completed, icon: CheckCircle },
    { key: "overdue", label: "Overdue", count: vaccinationData.stats.overdue, icon: AlertTriangle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-100 to-green-200 text-green-800 border-green-200";
      case "upcoming":
        return "from-blue-100 to-blue-200 text-blue-800 border-blue-200";
      case "scheduled":
        return "from-purple-100 to-purple-200 text-purple-800 border-purple-200";
      case "overdue":
        return "from-red-100 to-red-200 text-red-800 border-red-200";
      default:
        return "from-gray-100 to-gray-200 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "upcoming":
        return <Clock className="w-5 h-5" />;
      case "scheduled":
        return <Calendar className="w-5 h-5" />;
      case "overdue":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "routine":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
      case "seasonal":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
      case "recommended":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">High Priority</span>;
      case "medium":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Medium Priority</span>;
      case "low":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Low Priority</span>;
      default:
        return null;
    }
  };

  const filteredVaccinations = vaccinationData.vaccinations.filter(vaccine => {
    const matchesFilter = activeFilter === "all" || vaccine.status === activeFilter;
    const matchesSearch = vaccine.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaccine.childName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatCard = ({ title, value, icon: Icon, description, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-gray-700" />
        </div>
      </div>
    </div>
  );

  const VaccinationCard = ({ vaccine }: { vaccine: any }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(vaccine.status).split(' ')[0]} ${getStatusColor(vaccine.status).split(' ')[1]}`}>
            {getStatusIcon(vaccine.status)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#e5989b] transition-colors">
                {vaccine.vaccine}
              </h3>
              {getImportanceBadge(vaccine.importance)}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Baby className="w-4 h-4" />
                <span className="text-sm font-medium">{vaccine.childName}</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(vaccine.category)}`}>
                {vaccine.category.charAt(0).toUpperCase() + vaccine.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(vaccine.status)}`}>
            {getStatusIcon(vaccine.status)}
            <span className="ml-1">{vaccine.status.charAt(0).toUpperCase() + vaccine.status.slice(1)}</span>
          </span>
          {vaccine.status === "upcoming" && (
            <p className="text-sm text-blue-600 font-medium mt-2">{vaccine.daysLeft} days left</p>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">{vaccine.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Due Date:</span>
          <span className="font-semibold text-gray-900">{new Date(vaccine.dueDate).toLocaleDateString()}</span>
        </div>
        {vaccine.administeredDate && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Administered:</span>
            <span className="font-semibold text-green-600">{new Date(vaccine.administeredDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Doctor:</span>
          <span className="font-semibold text-gray-900">{vaccine.doctor}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Location:</span>
          <span className="font-semibold text-gray-900">{vaccine.location}</span>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-100">
        {vaccine.status === "upcoming" && (
          <>
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center justify-center">
              <Bell className="w-5 h-5 mr-2" />
              Set Reminder
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
              Mark Completed
            </button>
          </>
        )}
        {vaccine.status === "completed" && (
          <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
        )}
        <button className="px-6 py-3 text-gray-600 hover:text-[#e5989b] transition-colors font-medium border border-gray-300 hover:border-[#e5989b] rounded-xl">
          Reschedule
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5989b]/20 shadow-sm mb-4">
            <div className="w-2 h-2 bg-[#e5989b] rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Vaccination Tracker</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Vaccination{" "}
            <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
              Schedule
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Track and manage your children's immunization schedule to keep them protected and healthy.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Vaccinations" 
            value={vaccinationData.stats.total} 
            icon={Syringe}
            color="from-blue-100 to-blue-200"
            description="All immunizations"
          />
          <StatCard 
            title="Upcoming" 
            value={vaccinationData.stats.upcoming} 
            icon={Clock}
            color="from-yellow-100 to-yellow-200"
            description="Next 30 days"
          />
          <StatCard 
            title="Completed" 
            value={vaccinationData.stats.completed} 
            icon={CheckCircle}
            color="from-green-100 to-green-200"
            description="Fully immunized"
          />
          <StatCard 
            title="Overdue" 
            value={vaccinationData.stats.overdue} 
            icon={AlertTriangle}
            color="from-red-100 to-red-200"
            description="Require attention"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeFilter === filter.key
                        ? "bg-white text-[#e5989b] shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vaccinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] w-full md:w-80 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Vaccinations List */}
        <div className="space-y-6">
          {filteredVaccinations.length > 0 ? (
            filteredVaccinations.map((vaccine) => (
              <VaccinationCard key={vaccine.id} vaccine={vaccine} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Syringe className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No vaccinations found</h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm ? "Try adjusting your search terms" : "No vaccinations match the selected filter"}
              </p>
              <button className="inline-flex items-center bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-8 py-4 rounded-2xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-lg">
                <Plus className="w-6 h-6 mr-3" />
                Add New Vaccination
              </button>
            </div>
          )}
        </div>

        {/* Quick Resources */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Vaccination Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/vaccination-schedule"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Vaccination Schedule</h3>
                  <p className="text-gray-600 mt-2">View complete immunization timeline for all ages</p>
                </div>
              </div>
            </Link>

            <Link
              to="/vaccine-info"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Vaccine Information</h3>
                  <p className="text-gray-600 mt-2">Learn about each vaccine and its importance</p>
                </div>
              </div>
            </Link>

            <Link
              to="/reminders"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                  <Bell className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Reminder Settings</h3>
                  <p className="text-gray-600 mt-2">Configure vaccination reminders and alerts</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;