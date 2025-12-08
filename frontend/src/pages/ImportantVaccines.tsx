// ImportantVaccines.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRequest } from "../api/requests";
import {
  Shield,
  Syringe,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Baby,
  Clock,
  X,
  BookOpen,
} from "lucide-react";

// Type definitions based on the API response
interface VaccinationScheduleResponse {
  id: string;
  dose_num: number;
  min_age_days: number;
  max_age_days: number;
  vaccine_id: string;
}

interface VaccineWithSchedulesResponse {
  vaccine_id: string;
  vaccine_name: string;
  description: string | null;
  protect_against: string | null;
  doses_needed: number;
  is_mandatory: boolean;
  total_schedules: number;
  schedules: VaccinationScheduleResponse[];
}

const ImportantVaccines: React.FC = () => {
  const { accessToken } = useAuth();
  const [vaccines, setVaccines] = useState<VaccineWithSchedulesResponse[]>([]);
  const [filteredVaccines, setFilteredVaccines] = useState<VaccineWithSchedulesResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterMandatory, setFilterMandatory] = useState<boolean>(false);
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch all vaccines
  useEffect(() => {
    const fetchAllVaccines = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRequest("/vaccines/all");
        setVaccines(data || []);
        setFilteredVaccines(data || []);
      } catch (err: any) {
        console.error("Error fetching vaccines:", err);
        setError("Failed to load vaccine information. Please try again.");
        setVaccines([]);
        setFilteredVaccines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVaccines();
  }, [accessToken]);

  // Apply filters whenever search term or mandatory filter changes
  useEffect(() => {
    let filtered = [...vaccines];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(vaccine =>
        vaccine.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.protect_against?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply mandatory filter
    if (filterMandatory) {
      filtered = filtered.filter(vaccine => vaccine.is_mandatory);
    }

    setFilteredVaccines(filtered);
  }, [vaccines, searchTerm, filterMandatory]);

  // Format age in days to readable format
  const formatAge = (days: number): string => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (remainingDays > 0 || parts.length === 0) parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  // Toggle vaccine expansion
  const toggleVaccineExpansion = (vaccineId: string) => {
    setExpandedVaccine(expandedVaccine === vaccineId ? null : vaccineId);
  };

  // Calculate schedule summary
  const getScheduleSummary = (schedules: VaccinationScheduleResponse[]): string => {
    if (schedules.length === 0) return "No schedule information";
    
    const sortedSchedules = [...schedules].sort((a, b) => a.dose_num - b.dose_num);
    const firstDose = sortedSchedules[0];
    const lastDose = sortedSchedules[sortedSchedules.length - 1];
    
    return `${schedules.length} dose${schedules.length > 1 ? 's' : ''} • ${formatAge(firstDose.min_age_days)} to ${formatAge(lastDose.max_age_days)}`;
  };

  // Stats calculation
  const stats = {
    totalVaccines: vaccines.length,
    mandatoryVaccines: vaccines.filter(v => v.is_mandatory).length,
    optionalVaccines: vaccines.filter(v => !v.is_mandatory).length,
    totalDoses: vaccines.reduce((sum, v) => sum + v.total_schedules, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5989b] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading vaccine information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/vaccinations"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Important Vaccines
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Complete guide to childhood immunizations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{stats.totalVaccines} vaccines</span>
              </div>
              <Link
                to="/vaccinations"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#fceaea] text-[#e5989b] rounded-xl hover:bg-[#f8e1e1] transition-colors text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Vaccines</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalVaccines}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mandatory</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.mandatoryVaccines}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Optional</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.optionalVaccines}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Doses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDoses}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Syringe className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vaccines by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] outline-none shadow-sm text-sm sm:text-base"
              />
            </div>

            {/* Desktop Filter Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setFilterMandatory(!filterMandatory)}
                className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 ${
                  filterMandatory
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Mandatory Only
              </button>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {showMobileFilter && (
            <div className="sm:hidden mt-3 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Filters</span>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mandatory Only</span>
                  <button
                    onClick={() => setFilterMandatory(!filterMandatory)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      filterMandatory ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        filterMandatory ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterMandatory(false);
                    setShowMobileFilter(false);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Showing <span className="font-semibold">{filteredVaccines.length}</span> of{" "}
            <span className="font-semibold">{stats.totalVaccines}</span> vaccines
            {searchTerm && (
              <span>
                {" "}matching "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
            {filterMandatory && <span className="ml-2 text-red-600">(Mandatory only)</span>}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Vaccines List */}
        {filteredVaccines.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {filteredVaccines.map((vaccine) => (
              <div
                key={vaccine.vaccine_id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Vaccine Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                        vaccine.is_mandatory ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          vaccine.is_mandatory ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {vaccine.vaccine_name}
                          </h3>
                          {vaccine.is_mandatory ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Mandatory
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Recommended
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {vaccine.doses_needed} dose{vaccine.doses_needed > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {vaccine.description && (
                          <p className="text-sm sm:text-base text-gray-600 mb-3">
                            {vaccine.description}
                          </p>
                        )}
                        
                        {vaccine.protect_against && (
                          <div className="flex items-start gap-2 mb-3">
                            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Protects against:</span> {vaccine.protect_against}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{getScheduleSummary(vaccine.schedules)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => toggleVaccineExpansion(vaccine.vaccine_id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {expandedVaccine === vaccine.vaccine_id ? 'Hide Schedule' : 'View Schedule'}
                      </span>
                      {expandedVaccine === vaccine.vaccine_id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Schedule Details */}
                {expandedVaccine === vaccine.vaccine_id && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 sm:p-6 bg-gray-50">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                        Vaccination Schedule
                      </h4>
                      
                      <div className="space-y-4">
                        {vaccine.schedules
                          .sort((a, b) => a.dose_num - b.dose_num)
                          .map((schedule) => (
                            <div
                              key={schedule.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-50 rounded-lg">
                                    <Syringe className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      Dose {schedule.dose_num}
                                    </h5>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Baby className="w-3 h-3" />
                                        <span>Earliest: {formatAge(schedule.min_age_days)}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Clock className="w-3 h-3" />
                                        <span>Deadline: {formatAge(schedule.max_age_days)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Timeline visualization */}
                                <div className="flex-1 max-w-md">
                                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      style={{
                                        width: '100%',
                                      }}
                                    />
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-full" />
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Birth</span>
                                    <span>Schedule</span>
                                    <span>Max Age</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // No Results Found
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              No vaccines found
            </h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              {searchTerm || filterMandatory
                ? "Try adjusting your search or filter criteria"
                : "No vaccine information available"}
            </p>
            {(searchTerm || filterMandatory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterMandatory(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Educational Footer */}
        {filteredVaccines.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Info className="w-12 h-12 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  About Childhood Vaccinations
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Vaccines are essential for protecting children from serious diseases. Follow the recommended schedule 
                  to ensure your child receives all necessary immunizations at the right time. Consult with your 
                  healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportantVaccines;