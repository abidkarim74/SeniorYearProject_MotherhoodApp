import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Baby, 
  Camera, 
  Calendar, 
  Scale, 
  Ruler,
  ArrowLeft,
  Plus,
  Upload,
  X
} from "lucide-react";

const AddChild = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthWeight: "",
    birthHeight: "",
    
    // Step 2: Medical Information
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    specialNeeds: "",
    
    // Step 3: Additional Details
    relationship: "Mother",
    notes: ""
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
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    console.log("Child data:", formData);
    alert("Child profile created successfully!");
    navigate("/children");
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const isStep1Valid = () => {
    return formData.name && formData.gender && formData.birthDate;
  };

  const isStep2Valid = () => {
    return true; // Medical info is optional
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <span className={`text-sm font-medium ${
            step >= 1 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Basic Info
          </span>
        </div>
        
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div 
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: step >= 2 ? '100%' : step === 1 ? '0%' : '50%' }}
          ></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className={`text-sm font-medium ${
            step >= 2 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Medical Info
          </span>
        </div>
        
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div 
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: step >= 3 ? '100%' : '0%' }}
          ></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <span className={`text-sm font-medium ${
            step >= 3 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Additional
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/children"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Children
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-blue-100">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Child</h1>
              <p className="text-gray-600 mt-1">
                Create a profile to track your child's growth and development
              </p>
            </div>
          </div>
        </div>

        <ProgressBar />

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
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
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter child's full name"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Birth Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => handleInputChange("birthTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Birth Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Birth Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.birthWeight}
                        onChange={(e) => handleInputChange("birthWeight", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                        placeholder="0.0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Birth Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Birth Height
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.birthHeight}
                        onChange={(e) => handleInputChange("birthHeight", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Medical Info
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Medical Information */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => handleInputChange("bloodType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Relationship
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => handleInputChange("relationship", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Grandparent">Grandparent</option>
                    </select>
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Allergies
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List any known allergies (food, medication, environmental)"
                  />
                </div>

                {/* Medical Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any existing medical conditions or diagnoses"
                  />
                </div>

                {/* Special Needs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Needs or Requirements
                  </label>
                  <textarea
                    value={formData.specialNeeds}
                    onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special care requirements or accommodations needed"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Additional Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>
              
              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any other important information about your child..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can add milestones, preferences, or any special memories here.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Name:</span>
                      <p className="font-medium">{formData.name || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Gender:</span>
                      <p className="font-medium">{formData.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Birth Date:</span>
                      <p className="font-medium">
                        {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700">Blood Type:</span>
                      <p className="font-medium">{formData.bloodType || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Child Profile
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            All information is stored securely and can be updated at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddChild;