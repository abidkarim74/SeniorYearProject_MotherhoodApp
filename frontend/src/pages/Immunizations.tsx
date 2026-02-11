import { useState, useEffect } from "react";
import { getRequest } from "../api/requests";
import ChildVaccination from "../components/vaccines/ChildVaccination";
import { Syringe, ChevronDown, ChevronUp, BookOpen, X, Info, Shield } from "lucide-react";

// Interfaces
import type { ChildMini } from "../interfaces/ChildrenInterfaces";
import type { VaccineUserView } from "../interfaces/VaccinationInterfaces";

const Immunizations = () => {
    const [children, setChildren] = useState<ChildMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChild, setExpandedChild] = useState<string | null>(null);

    // New state for View All Vaccines
    const [showAllVaccines, setShowAllVaccines] = useState(false);
    const [allVaccines, setAllVaccines] = useState<VaccineUserView[]>([]);
    const [loadingVaccines, setLoadingVaccines] = useState(false);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await getRequest("/user-profile/get-children");
                setChildren(response || []);
                // Automatically expand the first child if there are any
                if (response && response.length > 0) {
                    setExpandedChild(response[0].id);
                }
            } catch (error) {
                console.error("Error fetching children:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    const fetchAllVaccines = async () => {
        try {
            setLoadingVaccines(true);
            const response = await getRequest("/vaccines/fetch-all");
            setAllVaccines(response || []);
        } catch (error) {
            console.error("Error fetching all vaccines:", error);
        } finally {
            setLoadingVaccines(false);
        }
    };

    const handleOpenAllVaccines = () => {
        setShowAllVaccines(true);
        if (allVaccines.length === 0) {
            fetchAllVaccines();
        }
    };

    const calculateAgeInDays = (birthDate: string) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - birth.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const toggleChild = (childId: string) => {
        setExpandedChild(expandedChild === childId ? null : childId);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#fff6f6]">
                Loading immunizations data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f7] via-white to-[#f0f9ff] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-2xl shadow-lg">
                                <Syringe className="w-8 h-8 text-white" />
                            </div>
                            Immunizations Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600 ml-16 max-w-2xl">
                            Track and manage vaccination schedules for all your children in one place
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAllVaccines}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-[#e5989b] text-[#e5989b] rounded-xl hover:bg-[#fceaea] transition-all font-medium shadow-sm hover:shadow-md"
                    >
                        <BookOpen className="w-5 h-5" />
                        View All Vaccines
                    </button>
                </div>

                <div className="space-y-6">
                    {children.length > 0 ? (
                        children.map((child) => {
                            const ageInDays = calculateAgeInDays(child.date_of_birth);
                            const isExpanded = expandedChild === child.id;

                            return (
                                <div
                                    key={child.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#e5989b]/20 shadow-lg' : 'hover:shadow-md'}`}
                                >
                                    <div
                                        onClick={() => toggleChild(child.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-gray-50/50 to-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={child.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                                    alt={`${child.firstname} ${child.lastname}`}
                                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {child.firstname} {child.lastname}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <span className="bg-[#fceaea] text-[#e5989b] px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                                                        {Math.floor(ageInDays / 365)}Y {Math.floor((ageInDays % 365) / 30)}M
                                                    </span>
                                                    DOB: {new Date(child.date_of_birth).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-gray-100 rounded-full transition-transform duration-300 transform group-hover:bg-gray-200">
                                            {isExpanded ? (
                                                <ChevronUp className="w-6 h-6 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-600" />
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="p-4 bg-gray-50/30">
                                                <ChildVaccination
                                                    child_id={child.id}
                                                    fullname={`${child.firstname} ${child.lastname}`}
                                                    age={ageInDays}
                                                    onClose={() => toggleChild(child.id)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Syringe className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Please add a child profile first to track their immunizations.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* All Vaccines Modal */}
            {showAllVaccines && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#e5989b]/10 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-[#e5989b]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Vaccine Library</h2>
                                    <p className="text-sm text-gray-500">Comprehensive list of all available vaccines</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAllVaccines(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {loadingVaccines ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="w-12 h-12 border-4 border-[#e5989b] border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500">Fetching vaccine library...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {allVaccines.map((vaccine) => (
                                        <div key={vaccine.vaccine_option_id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900">{vaccine.vaccine_name}</h3>
                                                        {vaccine.is_mandatory && (
                                                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100 flex items-center gap-1">
                                                                <Shield className="w-3 h-3 fill-current" /> Mandatory
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{vaccine.vaccine_description}</p>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                                            <Info className="w-3.5 h-3.5 mr-1" />
                                                            {vaccine.doses_needed} Dose{vaccine.doses_needed !== 1 ? 's' : ''} Required
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Schedules */}
                                            {vaccine.schedules && vaccine.schedules.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Vaccination Schedule</h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {vaccine.schedules.map((schedule) => (
                                                            <div key={schedule.dose_num} className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                                                                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-200 mr-2 shadow-sm">
                                                                    {schedule.dose_num}
                                                                </span>
                                                                <div className="text-xs">
                                                                    <span className="text-gray-500">Age:</span>
                                                                    <span className="font-semibold text-gray-900 ml-1">
                                                                        {Math.floor(schedule.min_days_age / 30)} - {Math.floor(schedule.max_days_age / 30)} months
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {allVaccines.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">No vaccines found in the library.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                            <button
                                onClick={() => setShowAllVaccines(false)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Immunizations;
