import { useParams } from "react-router-dom";
import type { MotherProfile } from "../interfaces/ProfileInterfaces";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getRequest, putRequest } from "../api/requests";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Droplets,
  Clock,
  Edit,
  Shield,
  Heart,
  Baby,
  Eye
} from "lucide-react";
import MotherProfileUpdate from "../components/MotherProfileUpdate";
import useFileHandler from "../hooks/useFileHandler";
import useImageUpload from "../hooks/useImageUpload";


const UserProfile = () => {
  const { accessToken, user } = useAuth();
  const params = useParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mother, setMother] = useState<MotherProfile | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { selectedFile, previewUrl, handleFileChange } = useFileHandler();
  const { imageUrl, isLoading: uploading, uploadImage, progress, error: uploadError } = useImageUpload();


  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return;

    setMother(prev => prev ? { ...prev, profile_pic: uploadedUrl } : prev);

    try {
      await putRequest(`/user-profile/update`, {
        id: user?.id,
        profile_pic: uploadedUrl,
      });

      console.log("Profile picture updated successfully");
      fetch_mother_data(); // refresh profile data
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };




  const fetch_mother_data = async () => {
    setLoading(true);
    try {
      const response = await getRequest('/user-profile/mother/' + params.id);
      console.log("Fetched mother:", response);
      setMother(response);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetch_mother_data();
    }
  }, [accessToken, params.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAccountDuration = (createdAt: string) => {
    if (!createdAt) return 'N/A';
    const created = new Date(createdAt);
    const today = new Date();
    const months = (today.getFullYear() - created.getFullYear()) * 12 + 
                  (today.getMonth() - created.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    // Refresh the data after successful update
    fetch_mother_data();
  };

  const isOwnProfile = params.id === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-2">Error loading profile</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetch_mother_data}
            className="mt-4 px-6 py-2 bg-[#e5989b] text-white rounded-xl hover:bg-[#d88a8d] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!mother) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">No profile data found</p>
          <button 
            onClick={fetch_mother_data}
            className="mt-4 px-6 py-2 bg-[#e5989b] text-white rounded-xl hover:bg-[#d88a8d] transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Profile with blur effect when update modal is open */}
      <div className={`min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] pt-0 pb-4 transition-all duration-300 ${
        showUpdateModal ? 'blur-sm pointer-events-none' : ''
      }`}>
        <div className="max-w-6xl mx-auto px-3">
          {/* Header - Shows different badge based on profile type */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border shadow-sm mb-3 ${
              isOwnProfile 
                ? "border-[#e5989b]/20 text-gray-600" 
                : "border-blue-200 text-blue-600"
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                isOwnProfile ? "bg-[#e5989b]" : "bg-blue-500"
              }`}></div>
              <span className="text-sm">
                {isOwnProfile ? "My Profile" : "Viewing Profile"}
              </span>
            </div>
          </div>

          {/* Main Profile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-2">
                {/* Profile Header */}
                <div className={`px-4 py-6 text-white text-center ${
                  isOwnProfile 
                    ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d]" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}>
                  <div className="relative inline-block">
                    <img
                      src={previewUrl || mother.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={`${mother.firstname} ${mother.lastname}`}
                      className="w-28 h-28 rounded-xl object-cover border-4 border-white/20 shadow-lg mx-auto"
                    />


                    {isOwnProfile && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center cursor-pointer border-2 border-white">
                        <input 
                          type="file" 
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                        />
                        <Edit className="w-4 h-4 text-white" />
                      </label>
                    )}
                  </div>

                  
                  <h2 className="text-xl font-bold mt-3 mb-1">
                    {mother.firstname} {mother.lastname}
                    {!isOwnProfile && (
                      <span className="ml-2 text-sm font-normal opacity-90">
                        (Other User)
                      </span>
                    )}
                  </h2>
                  <p className="text-white/80 text-sm">@{mother.username}</p>
                  
                  {/* Conditional Edit Button */}
                  {isOwnProfile ? (
                    <button 
                      onClick={() => setShowUpdateModal(true)}
                      className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2 transition-all duration-300 border border-white/30 mx-auto text-sm"
                    >
                      <Edit className="w-3 h-3" />
                      <span className="font-medium">Edit Profile</span>
                    </button>
                  ) : (
                    <div className="mt-3 text-xs text-white/70">
                      Viewing other user's profile
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="p-4">
                  <div className="space-y-3">
                    <StatItem 
                      icon={Users}
                      label="Children"
                      value={mother.number_of_children || 0}
                      color={isOwnProfile ? "text-blue-600" : "text-blue-500"}
                      bgColor={isOwnProfile ? "bg-blue-50" : "bg-blue-50"}
                      isOwnProfile={isOwnProfile}
                    />
                    <StatItem 
                      icon={Calendar}
                      label="Age"
                      value={`${calculateAge(mother.date_of_birth)} years`}
                      color={isOwnProfile ? "text-green-600" : "text-green-500"}
                      bgColor={isOwnProfile ? "bg-green-50" : "bg-green-50"}
                      isOwnProfile={isOwnProfile}
                    />
                    <StatItem 
                      icon={Droplets}
                      label="Blood Type"
                      value={mother.blood_type || 'Not specified'}
                      color={isOwnProfile ? "text-red-600" : "text-red-500"}
                      bgColor={isOwnProfile ? "bg-red-50" : "bg-red-50"}
                      isOwnProfile={isOwnProfile}
                    />
                    <StatItem 
                      icon={Clock}
                      label="Member Since"
                      value={getAccountDuration(mother.account_created_at)}
                      color={isOwnProfile ? "text-purple-600" : "text-purple-500"}
                      bgColor={isOwnProfile ? "bg-purple-50" : "bg-purple-50"}
                      isOwnProfile={isOwnProfile}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`px-4 py-3 border-b ${
                  isOwnProfile 
                    ? "bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-[#e5989b]/20" 
                    : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                }`}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className={`w-4 h-4 ${
                      isOwnProfile ? "text-[#e5989b]" : "text-blue-500"
                    }`} />
                    Personal Information
                    {!isOwnProfile && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        (Read-only)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard 
                      icon={Mail}
                      label="Email Address"
                      value={mother.email}
                      description="Primary contact email"
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={Phone}
                      label="Phone Number"
                      value={mother.phone_number || 'Not provided'}
                      description="Contact number"
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={Calendar}
                      label="Date of Birth"
                      value={formatDate(mother.date_of_birth)}
                      description={`${calculateAge(mother.date_of_birth)} years old`}
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={Heart}
                      label="Blood Type"
                      value={mother.blood_type || 'Not specified'}
                      description="Medical information"
                      valueColor={mother.blood_type ? (isOwnProfile ? "text-red-600" : "text-red-500") : "text-gray-500"}
                      isOwnProfile={isOwnProfile}
                    />
                  </div>
                </div>
              </div>

              {/* Location Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`px-4 py-3 border-b ${
                  isOwnProfile 
                    ? "bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-[#e5989b]/20" 
                    : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                }`}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${
                      isOwnProfile ? "text-[#e5989b]" : "text-blue-500"
                    }`} />
                    Location Information
                    {!isOwnProfile && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        (Read-only)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard 
                      icon={MapPin}
                      label="Address"
                      value={mother.address || 'Not provided'}
                      description="Street address"
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={MapPin}
                      label="City"
                      value={mother.city || 'Not provided'}
                      description="City of residence"
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={MapPin}
                      label="Country"
                      value={mother.country || 'Not provided'}
                      description="Country of residence"
                      isOwnProfile={isOwnProfile}
                    />
                    <InfoCard 
                      icon={Clock}
                      label="Account Created"
                      value={formatDate(mother.account_created_at)}
                      description={`${getAccountDuration(mother.account_created_at)} ago`}
                      isOwnProfile={isOwnProfile}
                    />
                  </div>
                </div>
              </div>

              {/* Family Overview Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`px-4 py-3 border-b ${
                  isOwnProfile 
                    ? "bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-[#e5989b]/20" 
                    : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                }`}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Baby className={`w-4 h-4 ${
                      isOwnProfile ? "text-[#e5989b]" : "text-blue-500"
                    }`} />
                    Family Overview
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <OverviewCard 
                      icon={Users}
                      value={mother.number_of_children || 0}
                      label="Children"
                      description="Registered in system"
                      gradient={isOwnProfile ? "from-blue-500 to-blue-600" : "from-blue-400 to-blue-500"}
                    />
                    <OverviewCard 
                      icon={Calendar}
                      value={calculateAge(mother.date_of_birth)}
                      label="Mother's Age"
                      description="Years old"
                      gradient={isOwnProfile ? "from-green-500 to-green-600" : "from-green-400 to-green-500"}
                    />
                    <OverviewCard 
                      icon={Clock}
                      value={getAccountDuration(mother.account_created_at)}
                      label="Account Age"
                      description="Active member"
                      gradient={isOwnProfile ? "from-purple-500 to-purple-600" : "from-purple-400 to-purple-500"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal  && (
        <MotherProfileUpdate
          motherData={mother}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

// Reusable Stat Item Component with isOwnProfile prop
const StatItem = ({ 
  icon: Icon, 
  label, 
  value, 
  color,
  bgColor,
  isOwnProfile
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  isOwnProfile: boolean;
}) => (
  <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
    isOwnProfile 
      ? "border-gray-100 hover:border-[#e5989b]/30" 
      : "border-gray-100 hover:border-blue-300"
  }`}>
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-base font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Reusable Info Card Component with isOwnProfile prop
const InfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  description,
  valueColor = "text-gray-900",
  isOwnProfile
}: {
  icon: any;
  label: string;
  value: string;
  description?: string;
  valueColor?: string;
  isOwnProfile: boolean;
}) => (
  <div className={`bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border transition-all duration-300 hover:shadow-md ${
    isOwnProfile 
      ? "border-gray-200 hover:border-[#e5989b]/30" 
      : "border-gray-200 hover:border-blue-300"
  }`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        isOwnProfile ? "bg-[#fceaea]" : "bg-blue-50"
      }`}>
        <Icon className={`w-4 h-4 ${
          isOwnProfile ? "text-[#e5989b]" : "text-blue-500"
        }`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className={`text-base font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
    {description && (
      <p className="text-xs text-gray-500 bg-white/50 rounded px-1 py-0.5">
        {description}
      </p>
    )}
  </div>
);

// Reusable Overview Card Component
const OverviewCard = ({ 
  icon: Icon, 
  value, 
  label, 
  description,
  gradient
}: {
  icon: any;
  value: string | number;
  label: string;
  description: string;
  gradient: string;
}) => (
  <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
  </div>
);

export default UserProfile;