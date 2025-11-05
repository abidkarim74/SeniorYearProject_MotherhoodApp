import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api/requests";
import { useAuth } from "../context/authContext";
import { Baby, Upload, X } from "lucide-react";

const AddChild = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
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
      await postRequest("/child/create", payload, accessToken);
      alert("Child created successfully!");
      navigate("/children");
    } catch (err) {
      console.error(err);
      alert("Failed to create child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9eae8] py-8 flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#f3d3d0]">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#e5989b]">
          Add New Child
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="text-center">
            <div className="relative inline-block w-24 h-24 rounded-full bg-gray-100 border-2 border-[#e5989b] overflow-hidden shadow-sm">
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
                    className="absolute -top-2 -right-2 bg-[#e5989b] text-white rounded-full p-1 hover:bg-[#d97f83] transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Baby className="w-12 h-12 text-[#e5989b] m-auto mt-6" />
              )}
            </div>

            <label className="mt-2 inline-flex items-center text-sm text-[#e5989b] cursor-pointer hover:underline">
              <Upload className="w-4 h-4 mr-1" /> Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) => handleInputChange("firstname", e.target.value)}
              className="w-full px-3 py-2 border border-[#f1b8b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastname}
              onChange={(e) => handleInputChange("lastname", e.target.value)}
              className="w-full px-3 py-2 border border-[#f1b8b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-[#f1b8b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
              className="w-full px-3 py-2 border border-[#f1b8b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-colors shadow-md ${
              loading
                ? "bg-[#e5989b]/70 cursor-not-allowed"
                : "bg-[#e5989b] hover:bg-[#d97f83]"
            }`}
          >
            {loading ? "Creating..." : "Create Child"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChild;
