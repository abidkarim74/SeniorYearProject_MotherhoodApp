import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRequest, deleteRequest, putRequest } from "../api/requests";
import { 
  Syringe, 
  Calendar, 
  CheckCircle, 
  Clock,
  Search,
  Plus,
  Baby,
  Trash2,
  Edit2,
  X,
  Save
} from "lucide-react";

const Vaccinations = () => {
  const { accessToken } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [vaccineOptions, setVaccineOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date_given: "", status: "" });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenData, vaccineOptionsData] = await Promise.all([
          getRequest("/user-profile/get-children"),
          getRequest("/vaccination-options/all")
        ]);
        
        setChildren(childrenData || []);
        setVaccineOptions(vaccineOptionsData || []);

        // Fetch vaccinations for each child
        const vaccinationPromises = (childrenData || []).map(async (child: any) => {
          try {
            const records = await getRequest(`/vaccination-records/child/${child.id}`);
            return records.map((record: any) => ({
              ...record,
              childName: `${child.firstname} ${child.lastname}`
            }));
          } catch (error) {
            console.error(`Error fetching vaccinations for child ${child.id}:`, error);
            return [];
          }
        });

        const vaccinationsByChild = await Promise.all(vaccinationPromises);
        setVaccinations(vaccinationsByChild.flat());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const getVaccineName = (vaccineId: string) => {
    const vaccine = vaccineOptions.find(v => v.id === vaccineId);
    return vaccine?.vaccine_name || "Unknown Vaccine";
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "PENDING": return "from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
      case "GIVEN": return "from-green-100 to-green-200 text-green-800 border-green-300";
      case "MISSED": return "from-red-100 to-red-200 text-red-800 border-red-300";
      default: return "from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusUpper = status?.toUpperCase();
    return statusUpper === "GIVEN" ? "Given" : 
           statusUpper === "PENDING" ? "Pending" : 
           statusUpper === "MISSED" ? "Missed" : status;
  };

  const handleDelete = async (recordId: string, vaccineName: string) => {
    if (!window.confirm(`Are you sure you want to delete the ${vaccineName} vaccination record?`)) {
      return;
    }

    try {
      await deleteRequest(`/vaccination-records/delete/${recordId}`);
      setVaccinations(prev => prev.filter(v => v.id !== recordId));
      alert("Vaccination record deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting vaccination:", error);
      alert(`Failed to delete vaccination: ${error.response?.data?.detail || error.message}`);
    }
  };

  const startEdit = (vaccine: any) => {
    setEditingId(vaccine.id);
    setEditForm({
      date_given: vaccine.date_given || "",
      status: vaccine.status?.toUpperCase() || "PENDING"
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ date_given: "", status: "" });
  };

  const saveEdit = async (recordId: string) => {
    try {
      const updateData: any = {
        status: editForm.status
      };

      // Only include date_given if it's not empty, otherwise send null
      if (editForm.date_given && editForm.date_given.trim() !== "") {
        updateData.date_given = editForm.date_given;
      } else {
        updateData.date_given = null;
      }

      const updated = await putRequest(`/vaccination-records/update/${recordId}`, updateData);
      
      // Update local state
      setVaccinations(prev => prev.map(v => 
        v.id === recordId ? { ...v, ...updated } : v
      ));
      
      setEditingId(null);
      alert("Vaccination record updated successfully!");
    } catch (error: any) {
      console.error("Error updating vaccination:", error);
      alert(`Failed to update vaccination: ${error.response?.data?.detail || error.message}`);
    }
  };

  const filteredVaccinations = vaccinations.filter(vaccine => {
    const vaccineName = getVaccineName(vaccine.vaccine_id).toLowerCase();
    const childName = vaccine.childName?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return vaccineName.includes(search) || childName.includes(search);
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

  const VaccinationCard = ({ vaccine }: { vaccine: any }) => {
    const vaccineName = getVaccineName(vaccine.vaccine_id);
    const isEditing = editingId === vaccine.id;
    
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Syringe className="w-5 h-5 text-[#e5989b]" />
              <h3 className="text-lg font-semibold text-gray-900">{vaccineName}</h3>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date Given</label>
              <input
                type="date"
                value={editForm.date_given}
                onChange={(e) => setEditForm({ ...editForm, date_given: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] outline-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="GIVEN">Given</option>
                <option value="MISSED">Missed</option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => saveEdit(vaccine.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Syringe className="w-5 h-5 text-[#e5989b]" />
                <h3 className="text-lg font-semibold text-gray-900">{vaccineName}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Baby className="w-4 h-4" />
                <span>{vaccine.childName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Dose {vaccine.dose_num} • {vaccine.date_given || "Date not set"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r border ${getStatusColor(vaccine.status)}`}>
                {getStatusLabel(vaccine.status)}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(vaccine)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit vaccination record"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(vaccine.id, vaccineName)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete vaccination record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#fff6f6]">
        Loading vaccinations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vaccination Records</h1>
            <p className="text-gray-600">Track and manage your children's vaccinations</p>
          </div>
          <Link
            to="/add-vaccination"
            className="inline-flex items-center bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Vaccination
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Vaccinations" 
            value={vaccinations.length} 
            icon={Syringe} 
            color="from-blue-100 to-blue-200" 
          />
          <StatCard 
            title="Pending" 
            value={vaccinations.filter(v => v.status?.toUpperCase() === "PENDING").length} 
            icon={Clock} 
            color="from-yellow-100 to-yellow-200" 
          />
          <StatCard 
            title="Given" 
            value={vaccinations.filter(v => v.status?.toUpperCase() === "GIVEN").length} 
            icon={CheckCircle} 
            color="from-green-100 to-green-200" 
          />
          <StatCard 
            title="Children" 
            value={children.length} 
            icon={Baby} 
            color="from-purple-100 to-purple-200" 
          />
        </div>


        {/* Vaccination Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVaccinations.length > 0 ? (
            filteredVaccinations.map(vaccine => (
              <VaccinationCard key={vaccine.id} vaccine={vaccine} />
            ))
          ) : (
            <div className="col-span-2 text-center py-20 bg-white rounded-2xl shadow-md">
              <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No vaccination records found</p>
              <p className="text-gray-400 text-sm mt-2">Add your first vaccination record to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;