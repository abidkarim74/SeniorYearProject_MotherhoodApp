import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRequest } from "../api/requests";
import { 
  Syringe, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Plus,
  Baby
} from "lucide-react";

const Vaccinations = () => {
  const { accessToken, user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all children first
  useEffect(() => {
    const fetchChildrenAndVaccinations = async () => {
      try {
        const childrenData = await getRequest("/user-profile/get-children");
        setChildren(childrenData || []);

        // Fetch vaccinations for each child
        const vaccinationPromises = (childrenData || []).map(async (child: any) => {
          const records = await getRequest(`/vaccination-records/child/${child.id}`);
          // Attach child's name for easier rendering
          return records.map((record: any) => ({
            ...record,
            childName: `${child.firstname} ${child.lastname}`
          }));
        });

        const vaccinationsByChild = await Promise.all(vaccinationPromises);
        // Flatten array of arrays
        setVaccinations(vaccinationsByChild.flat());
      } catch (error) {
        console.error("Error fetching vaccinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildrenAndVaccinations();
  }, [accessToken]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200";
      case "given": return "from-green-100 to-green-200 text-green-800 border-green-200";
      case "missed": return "from-red-100 to-red-200 text-red-800 border-red-200";
      default: return "from-gray-100 to-gray-200 text-gray-800 border-gray-200";
    }
  };

  const filteredVaccinations = vaccinations.filter(vaccine => {
    const matchesFilter = activeFilter === "all" || vaccine.status.toLowerCase() === activeFilter;
    const matchesSearch = vaccine.vaccine_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vaccine.childName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  const VaccinationCard = ({ vaccine }: { vaccine: any }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vaccine.vaccine_id}</h3>
          <p className="text-sm text-gray-500">{vaccine.childName}</p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(vaccine.status)}`}>
          {vaccine.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm">
        Dose: {vaccine.dose_num} • Date Given: {vaccine.date_given || "N/A"}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#fff6f6]">
        Loading vaccinations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff6f6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vaccination Schedule</h1>
          <Link
            to="/add-vaccination"
            className="inline-flex items-center bg-[#e5989b] text-white px-4 py-2 rounded-xl hover:bg-[#d88a8d] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Vaccination
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Vaccinations" value={vaccinations.length} icon={Syringe} color="from-blue-100 to-blue-200" />
          <StatCard title="Pending" value={vaccinations.filter(v => v.status === "Pending").length} icon={Clock} color="from-yellow-100 to-yellow-200" />
          <StatCard title="Given" value={vaccinations.filter(v => v.status === "Given").length} icon={CheckCircle} color="from-green-100 to-green-200" />
          <StatCard title="Children" value={children.length} icon={Baby} color="from-purple-100 to-purple-200" />
        </div>

        {/* Vaccination List */}
        <div className="space-y-4">
          {filteredVaccinations.length > 0 ? (
            filteredVaccinations.map(vaccine => (
              <VaccinationCard key={vaccine.id} vaccine={vaccine} />
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">No vaccinations found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;