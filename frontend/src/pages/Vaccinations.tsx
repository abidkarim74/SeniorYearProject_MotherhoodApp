import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { getRequest } from "../api/requests";
import ChildVaccinationModal from "../components/ChildVaccinationModal";
import { Link } from "react-router-dom";

import {
  Search,
  Baby,
  Shield,
  Clock,
  AlertCircle,
  CheckSquare,
  Calendar,
  Eye,
  Filter,
  X,
} from "lucide-react";

// Type Definitions
interface VaccineDoseInfo {
  dose_num: number;
  dose_name: string;
  schedule_id: string;
  min_age_days: number;
  max_age_days: number | null;
  child_current_age_days: number;
  is_age_eligible: boolean;
}

interface PendingVaccine {
  vaccine_id: string;
  vaccine_name: string;
  description: string | null;
  protect_against: string | null;
  is_mandatory: boolean;
  doses_needed: number;
  dose_info: VaccineDoseInfo;
}

interface ChildData {
  child_id: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  age_days: number;
  total_pending_vaccines: number;
  pending_vaccines?: PendingVaccine[];
}

interface PendingVaccinesResponse {
  total_children: number;
  total_pending_vaccines: number;
  children: ChildData[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subtitle?: string;
}

interface ChildCardProps {
  child: ChildData;
  hasPending: boolean;
  onViewVaccines: (child: ChildData) => void;
}

const Vaccinations: React.FC = () => {
  const { accessToken } = useAuth();

  const [pendingData, setPendingData] = useState<PendingVaccinesResponse>({
    total_children: 0,
    total_pending_vaccines: 0,
    children: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "uptodate"
  >("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Modal state
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch pending vaccines data
  useEffect(() => {
    const fetchPendingVaccines = async () => {
      try {
        setLoading(true);
        const data = await getRequest("/vaccines/pending");
        setPendingData(
          data || {
            total_children: 0,
            total_pending_vaccines: 0,
            children: [],
          }
        );
      } catch (error) {
        console.error("Error fetching pending vaccines:", error);
        setPendingData({
          total_children: 0,
          total_pending_vaccines: 0,
          children: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVaccines();
  }, [accessToken]);

  // Refresh function
  const refreshPendingVaccines = async () => {
    try {
      const data = await getRequest("/vaccines/pending");
      setPendingData(
        data || {
          total_children: 0,
          total_pending_vaccines: 0,
          children: [],
        }
      );
    } catch (error) {
      console.error("Error refreshing pending vaccines:", error);
    }
  };

  // Handle when a vaccine is recorded
  const handleVaccineRecorded = async (
    childId: string,
    vaccineId: string,
    scheduleId: string
  ) => {
    // Optimistically update UI
    setPendingData((prevData) => {
      const updatedChildren = prevData.children.map((child) => {
        if (child.child_id === childId) {
          // Filter out the recorded vaccine from this child's pending vaccines
          const updatedPendingVaccines =
            child.pending_vaccines?.filter(
              (vaccine) =>
                !(
                  vaccine.vaccine_id === vaccineId &&
                  vaccine.dose_info.schedule_id === scheduleId
                )
            ) || [];

          return {
            ...child,
            pending_vaccines: updatedPendingVaccines,
            total_pending_vaccines: updatedPendingVaccines.length,
          };
        }
        return child;
      });

      // Recalculate totals
      const totalPendingVaccines = updatedChildren.reduce(
        (total, child) => total + child.total_pending_vaccines,
        0
      );

      return {
        ...prevData,
        children: updatedChildren,
        total_pending_vaccines: totalPendingVaccines,
      };
    });

    // Refresh from server to ensure consistency
    setTimeout(() => {
      refreshPendingVaccines();
    }, 500);
  };

  // Filter children based on search and status
  const filterChildren = (childrenList: ChildData[]): ChildData[] => {
    let filtered = childrenList;

    // Apply status filter
    if (filterStatus === "pending") {
      filtered = filtered.filter((child) => child.total_pending_vaccines > 0);
    } else if (filterStatus === "uptodate") {
      filtered = filtered.filter((child) => child.total_pending_vaccines === 0);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((child) => {
        const fullName = `${child.firstname} ${child.lastname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  };

  // Get filtered children
  const filteredChildren = filterChildren(pendingData.children);

  // Open modal with child's pending vaccines
  const openChildModal = (child: ChildData) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  // Close modal
  const closeChildModal = () => {
    setIsModalOpen(false);
    setSelectedChild(null);
    // Refresh data when modal closes
    refreshPendingVaccines();
  };

  // Calculate summary stats
  const stats = {
    totalChildren: pendingData.total_children,
    totalPendingVaccines: pendingData.total_pending_vaccines,
    childrenWithPendingCount: pendingData.children.filter(
      (c) => c.total_pending_vaccines > 0
    ).length,
    childrenUpToDateCount: pendingData.children.filter(
      (c) => c.total_pending_vaccines === 0
    ).length,
    vaccinesDueSoon: pendingData.children.reduce((total, child) => {
      return (
        total +
        (child.pending_vaccines?.filter((vaccine) => {
          if (!vaccine.dose_info.max_age_days) return false;
          const daysUntilMax = vaccine.dose_info.max_age_days - child.age_days;
          return daysUntilMax <= 7 && daysUntilMax > 0;
        }).length || 0)
      );
    }, 0),
  };

  // Format age display
  const formatAge = (days: number): string => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (remainingDays > 0 || parts.length === 0)
      parts.push(`${remainingDays}d`);

    return parts.join(" ");
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stat card component
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    subtitle,
  }) => (
    <div
      className={`${bgColor} rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );

  // Child card component
  const ChildCard: React.FC<ChildCardProps> = ({
    child,
    hasPending,
    onViewVaccines,
  }) => {
    // Calculate if any vaccine is urgent (within 7 days)
    const hasUrgentVaccine = child.pending_vaccines?.some((vaccine) => {
      if (!vaccine.dose_info.max_age_days) return false;
      const daysUntilMax = vaccine.dose_info.max_age_days - child.age_days;
      return daysUntilMax <= 7 && daysUntilMax > 0;
    });

    // Calculate if any vaccine is overdue
    const hasOverdueVaccine = child.pending_vaccines?.some((vaccine) => {
      if (!vaccine.dose_info.max_age_days) return false;
      const daysUntilMax = vaccine.dose_info.max_age_days - child.age_days;
      return daysUntilMax < 0;
    });

    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${
                    hasOverdueVaccine
                      ? "bg-red-50"
                      : hasUrgentVaccine
                      ? "bg-orange-50"
                      : hasPending
                      ? "bg-yellow-50"
                      : "bg-green-50"
                  }`}
                >
                  <Baby
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      hasOverdueVaccine
                        ? "text-red-600"
                        : hasUrgentVaccine
                        ? "text-orange-600"
                        : hasPending
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
                {child.total_pending_vaccines > 0 && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {child.total_pending_vaccines}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {child.firstname} {child.lastname}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {formatAge(child.age_days)} old
                  </span>
                  <span className="hidden sm:inline text-sm text-gray-500">
                    •
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 truncate">
                    Born {formatDate(child.date_of_birth)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hasOverdueVaccine && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      Overdue
                    </span>
                  )}
                  {hasUrgentVaccine && !hasOverdueVaccine && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Urgent
                    </span>
                  )}
                  {hasPending && !hasUrgentVaccine && !hasOverdueVaccine && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {child.total_pending_vaccines} pending
                    </span>
                  )}
                  {!hasPending && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Up to date
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-end sm:block">
              {hasPending && (
                <button
                  onClick={() => onViewVaccines(child)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View Vaccines</span>
                  <span className="inline sm:hidden">View</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5989b] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading vaccination data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main page with blur effect when modal is open */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isModalOpen ? "blur-md" : ""
        }`}
      >
        <div className="bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}

            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Children's Vaccinations
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Track and manage immunization records for your children
                  </p>
                </div>

                <Link
                  to="/important-vaccines"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm sm:text-base font-medium w-full sm:w-auto group"
                >
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  Important Vaccines
                </Link>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard
                title="Total Children"
                value={stats.totalChildren}
                icon={Baby}
                color="bg-blue-100 text-blue-600"
                bgColor="bg-white"
              />
              <StatCard
                title="Pending Vaccines"
                value={stats.totalPendingVaccines}
                icon={Clock}
                color="bg-yellow-100 text-yellow-600"
                bgColor="bg-white"
                subtitle="Currently due"
              />
              <StatCard
                title="Children with Pending"
                value={stats.childrenWithPendingCount}
                icon={AlertCircle}
                color="bg-orange-100 text-orange-600"
                bgColor="bg-white"
                subtitle="Need attention"
              />
              <StatCard
                title="Due Soon"
                value={stats.vaccinesDueSoon}
                icon={Calendar}
                color="bg-red-100 text-red-600"
                bgColor="bg-white"
                subtitle="Within 7 days"
              />
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search children by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] outline-none shadow-sm text-sm sm:text-base"
                  />
                </div>

                {/* Desktop Filter Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2.5 rounded-xl transition-colors ${
                      filterStatus === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2.5 rounded-xl transition-colors ${
                      filterStatus === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus("uptodate")}
                    className={`px-4 py-2.5 rounded-xl transition-colors ${
                      filterStatus === "uptodate"
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Up to Date
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
                    <span className="font-medium text-gray-900">
                      Filter by Status
                    </span>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setShowMobileFilter(false);
                      }}
                      className={`px-4 py-2.5 rounded-lg text-left ${
                        filterStatus === "all"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All Children
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("pending");
                        setShowMobileFilter(false);
                      }}
                      className={`px-4 py-2.5 rounded-lg text-left ${
                        filterStatus === "pending"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      With Pending Vaccines
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("uptodate");
                        setShowMobileFilter(false);
                      }}
                      className={`px-4 py-2.5 rounded-lg text-left ${
                        filterStatus === "uptodate"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Up to Date
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredChildren.length}</span>{" "}
                of{" "}
                <span className="font-semibold">
                  {pendingData.total_children}
                </span>{" "}
                children
                {searchTerm && (
                  <span>
                    {" "}
                    matching "
                    <span className="font-semibold">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Children List */}
            {filteredChildren.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {filteredChildren.map((child) => (
                  <ChildCard
                    key={child.child_id}
                    child={child}
                    hasPending={child.total_pending_vaccines > 0}
                    onViewVaccines={openChildModal}
                  />
                ))}
              </div>
            ) : (
              // No Results Found
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  No children found
                </h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "There are no children in the system yet"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Empty State - No Children */}
            {pendingData.total_children === 0 && !loading && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                <Baby className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  No children found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  There are no children in the system yet
                </p>
              </div>
            )}

            {/* All Caught Up Message */}
            {pendingData.total_children > 0 &&
              pendingData.total_pending_vaccines === 0 &&
              filterStatus !== "pending" && (
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-200">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <CheckSquare className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Great News! 🎉
                      </h3>
                      <p className="text-gray-600 mb-4">
                        All your children are up-to-date with their vaccinations
                        based on their current ages.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Child Vaccination Modal */}
      {selectedChild && selectedChild.pending_vaccines && (
        <ChildVaccinationModal
          isOpen={isModalOpen}
          onClose={closeChildModal}
          child={selectedChild}
          vaccines={selectedChild.pending_vaccines}
          onVaccineRecorded={handleVaccineRecorded}
        />
      )}
    </>
  );
};

export default Vaccinations;
