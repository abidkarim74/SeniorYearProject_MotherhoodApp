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
  Search
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
        location: "City Children's Hospital"
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
        location: "Community Health Center"
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
        location: "City Children's Hospital"
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
        location: "Community Health Center"
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
        location: "City Children's Hospital"
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
        location: "Community Health Center"
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
    { key: "all", label: "All Vaccinations", count: vaccinationData.stats.total },
    { key: "upcoming", label: "Upcoming", count: vaccinationData.stats.upcoming },
    { key: "completed", label: "Completed", count: vaccinationData.stats.completed },
    { key: "overdue", label: "Overdue", count: vaccinationData.stats.overdue }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "upcoming":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "scheduled":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
        return "bg-blue-100 text-blue-800";
      case "seasonal":
        return "bg-green-100 text-green-800";
      case "recommended":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVaccinations = vaccinationData.vaccinations.filter(vaccine => {
    const matchesFilter = activeFilter === "all" || vaccine.status === activeFilter;
    const matchesSearch = vaccine.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaccine.childName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const VaccinationCard = ({ vaccine }: { vaccine: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor(vaccine.status).split(' ')[1]}`}>
            {getStatusIcon(vaccine.status)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{vaccine.vaccine}</h3>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <Baby className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{vaccine.childName}</span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(vaccine.category)}`}>
                {vaccine.category.charAt(0).toUpperCase() + vaccine.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vaccine.status)}`}>
            {vaccine.status.charAt(0).toUpperCase() + vaccine.status.slice(1)}
          </span>
          {vaccine.status === "upcoming" && (
            <p className="text-sm text-gray-600 mt-1">{vaccine.daysLeft} days left</p>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{vaccine.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Due Date:</span>
          <span className="font-medium">{new Date(vaccine.dueDate).toLocaleDateString()}</span>
        </div>
        {vaccine.administeredDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Administered:</span>
            <span className="font-medium">{new Date(vaccine.administeredDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Doctor:</span>
          <span className="font-medium">{vaccine.doctor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{vaccine.location}</span>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        {vaccine.status === "upcoming" && (
          <>
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center">
              <Bell className="w-4 h-4 mr-2" />
              Set Reminder
            </button>
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              Mark Completed
            </button>
          </>
        )}
        {vaccine.status === "completed" && (
          <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </button>
        )}
        <button className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
          Reschedule
        </button>
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
              <h1 className="text-3xl font-bold text-gray-900">Vaccinations</h1>
              <p className="text-gray-600 mt-2">
                Manage and track your children's vaccination schedules
              </p>
            </div>
            <button className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-5 h-5 mr-2" />
              Add Vaccination
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vaccinations</p>
                <p className="text-2xl font-bold text-gray-900">{vaccinationData.stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{vaccinationData.stats.upcoming}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{vaccinationData.stats.completed}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{vaccinationData.stats.overdue}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vaccinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
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
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Syringe className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccinations found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "Try adjusting your search terms" : "No vaccinations match the selected filter"}
              </p>
              <button className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-5 h-5 mr-2" />
                Add New Vaccination
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vaccination Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/vaccination-schedule"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Vaccination Schedule</h3>
                  <p className="text-sm text-gray-600 mt-1">View complete immunization timeline</p>
                </div>
              </div>
            </Link>

            <Link
              to="/vaccine-info"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                  <Syringe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Vaccine Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Learn about each vaccine and its importance</p>
                </div>
              </div>
            </Link>

            <Link
              to="/reminders"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reminder Settings</h3>
                  <p className="text-sm text-gray-600 mt-1">Configure vaccination reminders</p>
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