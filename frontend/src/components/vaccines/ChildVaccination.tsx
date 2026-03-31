import { useEffect, useState } from "react";
import { postRequest } from "../../api/requests";
import type { RequiredVaccination } from "../../interfaces/VaccinationInterfaces";
import {
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Plus,
} from "lucide-react";

interface ChildInfo {
  child_id: string;
  fullname: string;
  onClose: () => void;
  age: number;
}

const ChildVaccination = ({ child_id, age, onClose }: ChildInfo) => {
  const [vaccinations, setVaccinations] = useState<RequiredVaccination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);
  const [recordingDates, setRecordingDates] = useState<Record<string, string>>({});
  const [recording, setRecording] = useState<Record<string, boolean>>({});

  // const { user } = useAuth();

  useEffect(() => {
    const fetchRequiredVaccines = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Age: ", age);
        const response = await postRequest('/vaccines/required-vaccines/' + child_id, { 'child_age': age });
        setVaccinations(response || []);
      } catch (err: any) {
        setError('Something went wrong! Please try again or contact help center!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequiredVaccines();
  }, [child_id, age]);

  const getVaccinationStatus = (vaccine: RequiredVaccination) => {
    const childAgeInDays = age * 365; // Assuming age is in years
    if (childAgeInDays < vaccine.min_days_age) return "upcoming";
    if (childAgeInDays <= vaccine.max_days_age) return "due";
    return "overdue";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "due": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      case "upcoming": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "due": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertCircle className="w-4 h-4" />;
      case "upcoming": return <Calendar className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const handleDateChange = (vaccineId: string, date: string) => {
    setRecordingDates(prev => ({ ...prev, [vaccineId]: date }));
  };

  const handleRecordVaccine = async (vaccineId: string) => {
    const date = recordingDates[vaccineId];
    if (!date) {
      alert("Please select a date first!");
      return;
    }

    // Find the vaccine details to get schedule_id
    const vaccine = vaccinations.find(v => v.vaccine_id === vaccineId);
    if (!vaccine) {
      alert("Vaccine not found!");
      return;
    }

    try {
      setRecording(prev => ({ ...prev, [vaccineId]: true }));

      // Call your record create endpoint
       await postRequest(`/vaccines/create-record/${child_id}`, {
        given_date: date,
        vaccine_id: vaccineId,
        child_id: child_id,
        schedule_id: vaccine.schedule_id || null // Include schedule_id if available
      });

      alert("Vaccine recorded successfully!");

      // Clear the date input
      setRecordingDates(prev => ({ ...prev, [vaccineId]: "" }));

      // Optionally refresh the required vaccines list
      const updatedVaccines = await postRequest('/vaccines/required-vaccines/' + child_id, { 'child_age': age });
      setVaccinations(updatedVaccines || []);

    } catch (error: any) {
      console.error("Error recording vaccine:", error);
      alert(error.response?.data?.detail || "Failed to record vaccine. Please try again.");
    } finally {
      setRecording(prev => ({ ...prev, [vaccineId]: false }));
    }
  };

  const calculateDueWindow = (vaccine: RequiredVaccination) => {
    const minMonths = Math.floor(vaccine.min_days_age / 30);
    const maxMonths = Math.floor(vaccine.max_days_age / 30);
    return `${minMonths} - ${maxMonths} months`;
  };

  // Mobile responsive function for status display
  const getStatusText = (status: string) => {
    switch (status) {
      case "due": return "Due";
      case "overdue": return "Overdue";
      case "upcoming": return "Upcoming";
      default: return "Completed";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#e5989b] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading vaccination schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-[300px] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Vaccinations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#e5989b] text-white rounded-lg hover:bg-[#d88a8d] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-[#fff9f9] h-full py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header with Close Button */}
        <div className="mb-6 md:mb-8">
          {/* Stats Summary - Responsive Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
                {vaccinations.filter(v => getVaccinationStatus(v) === "due").length}
              </div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium mt-1">Due</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-700">
                {vaccinations.filter(v => getVaccinationStatus(v) === "overdue").length}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600 font-medium mt-1">Overdue</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">
                {vaccinations.filter(v => getVaccinationStatus(v) === "upcoming").length}
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Vaccination List */}
        <div className="space-y-3 md:space-y-4">
          {vaccinations.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No Vaccinations Required</h3>
              <p className="text-sm md:text-base text-gray-600">All vaccinations are up to date!</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            vaccinations.map((vaccine) => {
              const status = getVaccinationStatus(vaccine);
              const isExpanded = expandedVaccine === vaccine.vaccine_id;

              return (
                <div
                  key={vaccine.vaccine_id}
                  className="bg-white rounded-lg md:rounded-2xl shadow-md md:shadow-lg border border-gray-200 overflow-hidden hover:shadow-lg md:hover:shadow-xl transition-all duration-300"
                >
                  {/* Vaccine Header - Mobile Optimized */}
                  <div
                    className="p-4 md:p-6 cursor-pointer"
                    onClick={() => setExpandedVaccine(isExpanded ? null : vaccine.vaccine_id)}
                  >
                    <div className="flex items-start md:items-center justify-between">
                      <div className="flex items-start md:items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ${vaccine.is_mandatory
                            ? "bg-gradient-to-br from-red-100 to-red-50 border border-red-200"
                            : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
                          }`}>
                          <Shield className={`w-5 h-5 md:w-6 md:h-6 ${vaccine.is_mandatory ? "text-red-600" : "text-blue-600"
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                              {vaccine.vaccine_name}
                            </h3>
                            {vaccine.is_mandatory && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full whitespace-nowrap">
                                MANDATORY
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs md:text-sm text-gray-600">Dose #{vaccine.dose_num}</span>
                            <span className="text-xs md:text-sm text-[#e5989b] font-medium">
                              {calculateDueWindow(vaccine)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 md:space-x-4 ml-2">
                        {/* Status badge - simplified on mobile */}
                        <span className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span className="capitalize">{getStatusText(status)}</span>
                        </span>
                        <span className={`sm:hidden inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Responsive Layout */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Vaccine Information */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Info className="w-4 h-4 md:w-5 md:h-5 text-[#e5989b]" />
                            <h4 className="text-sm md:text-base font-semibold text-gray-900">Vaccine Details</h4>
                          </div>
                          <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">{vaccine.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-xs md:text-sm text-gray-700">
                                <span className="font-medium">Protects against:</span> {vaccine.protect_against}
                              </span>
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              <span className="font-medium">Status:</span> {status === "overdue" ? " Urgent action needed" :
                                status === "due" ? "Ready to administer" :
                                  "⏰ Scheduled for future"}
                            </div>
                          </div>
                        </div>

                        {/* Record Vaccination Form */}
                        <div className="bg-gradient-to-br from-[#fceaea] to-[#f8d8d8] rounded-lg md:rounded-xl p-4">
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#e5989b]" />
                            <span>Record This Vaccine</span>
                          </h4>

                          <div className="space-y-3 md:space-y-4">
                            <div>
                              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                Date Administered
                              </label>
                              <input
                                type="date"
                                value={recordingDates[vaccine.vaccine_id] || ""}
                                onChange={(e) => handleDateChange(vaccine.vaccine_id, e.target.value)}
                                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:border-[#e5989b] focus:ring-2 focus:ring-[#e5989b]/20 focus:outline-none transition-all"
                                max={new Date().toISOString().split('T')[0]}
                              />
                            </div>

                            <button
                              onClick={() => handleRecordVaccine(vaccine.vaccine_id)}
                              disabled={recording[vaccine.vaccine_id] || !recordingDates[vaccine.vaccine_id]}
                              className={`w-full flex items-center justify-center space-x-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all ${recording[vaccine.vaccine_id] || !recordingDates[vaccine.vaccine_id]
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white hover:shadow-lg hover:scale-[1.02]"
                                }`}
                            >
                              {recording[vaccine.vaccine_id] ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm md:text-base">Recording...</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                  <span className="text-sm md:text-base">Record Vaccination</span>
                                </>
                              )}
                            </button>

                            {status === "overdue" && (
                              <div className="text-xs md:text-sm text-red-600 bg-red-50 p-2 md:p-3 rounded-lg border border-red-200">
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                                <span className="font-medium">This vaccine is overdue!</span> Please administer as soon as possible.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default ChildVaccination;