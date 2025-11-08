import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api/requests";
import { Baby, Upload, X, Heart, Sparkles } from "lucide-react";

const AddChild = () => {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    date_of_birth: "",
    profile_pic: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, profile_pic: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstname || !formData.lastname || !formData.gender || !formData.date_of_birth) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData, profile_pic: avatarPreview || "" };
      await postRequest("/child/create", payload);
      
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fceaea] to-[#f9eae8] py-2 flex items-center justify-center px-2">
      {/* Background decorative elements */}
      <div className="fixed top-10 left-10 opacity-10">
        <Heart className="w-20 h-20 text-[#e5989b]" />
      </div>
      <div className="fixed bottom-10 right-10 opacity-10">
        <Baby className="w-24 h-24 text-[#e5989b]" />
      </div>
      <div className="fixed top-20 right-20 opacity-5">
        <Sparkles className="w-16 h-16 text-[#e5989b]" />
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-4xl border border-[#f3d3d0]/50 relative overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Add New Child</h1>
            <p className="text-white/80 text-sm">Welcome your little one to Nurtura</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Avatar and Personal Info */}
              <div className="flex-1 space-y-6">
                {/* Avatar Upload Section */}
                <div className="text-center">
                  <div className="relative inline-block group">
                    <div className={`w-32 h-32 rounded-2xl border-3 border-dashed transition-all duration-300 overflow-hidden shadow-lg ${
                      avatarPreview 
                        ? 'border-[#e5989b] bg-white' 
                        : 'border-[#e5989b]/30 bg-gradient-to-br from-[#fceaea] to-[#f9eae8] hover:border-[#e5989b] hover:shadow-xl'
                    }`}>
                      {avatarPreview ? (
                        <>
                          <img
                            src={avatarPreview}
                            alt="Child avatar"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeAvatar}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg hover:scale-110"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                          <Baby className="w-12 h-12 text-[#e5989b] mb-2" />
                          <span className="text-xs text-[#e5989b] font-medium">Add Photo</span>
                        </div>
                      )}
                    </div>
                    
                    <label className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-4 py-2.5 rounded-xl font-medium cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange("firstname", e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:border-[#e5989b] transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400 text-gray-800 font-medium"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:border-[#e5989b] transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400 text-gray-800 font-medium"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="flex-1 space-y-6">
                {/* Additional Information */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Additional Details
                  </h3>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:border-[#e5989b] transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white text-gray-800 font-medium appearance-none cursor-pointer pr-10"
                        required
                      >
                        <option value="" className="text-gray-400">Select Gender</option>
                        <option value="Male" className="text-gray-800">Male</option>
                        <option value="Female" className="text-gray-800">Female</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:border-[#e5989b] transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white text-gray-800 font-medium cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Quick Tips
                    </h4>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Use a clear, recent photo for best results</li>
                      <li>• Ensure all required fields are filled</li>
                      <li>• You can update this information later</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                  loading
                    ? "bg-gradient-to-r from-[#e5989b]/70 to-[#d88a8d]/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#e5989b] to-[#d88a8d] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    <span>Create Child Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your child's information is safe and secure with us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChild;