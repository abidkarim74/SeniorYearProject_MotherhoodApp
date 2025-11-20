import { useState } from "react";
import { Lock } from "lucide-react";

const Settings = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // TODO: integrate with backend reset-password endpoint
    console.log("Password Reset Form Submitted:", form);
    alert("Password reset request submitted!");
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Reset Password Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Current Password */}
            <div>
              <label className="font-medium text-gray-700">Current Password</label>
              <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="currentPassword"
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="font-medium text-gray-700">New Password</label>
              <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-medium text-gray-700">Confirm Password</label>
              <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Save New Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
