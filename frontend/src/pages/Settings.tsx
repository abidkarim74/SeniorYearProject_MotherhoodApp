import { useState } from "react";
import { Lock } from "lucide-react";
import { postRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "", // changed from currentPassword
    new_password: "", // changed from newPassword
    confirmPassword: "", // keep for frontend validation
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (form.new_password !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (form.password === form.new_password) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request data matching backend's ChangePassword model
      const requestData = {
        password: form.password, // current password
        new_password: form.new_password,
      };

      await postRequest("/auth/password-reset", requestData);
      
      // Show success popup
      setShowSuccess(true);
      
      // Reset form
      setForm({
        password: "",
        new_password: "",
        confirmPassword: "",
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: any) {
      console.error("Password reset failed:", err);
      // Check for specific error messages from backend
      if (err.response?.data?.detail === "Password is incorrect!") {
        setError("Current password is incorrect");
      } else if (err.response?.data?.detail === "User not found!") {
        setError("User session expired. Please log in again.");
      } else {
        setError(err.response?.data?.detail || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] px-6 py-10">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your password has been reset successfully. Redirecting to home...
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Reset Password Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="font-medium text-gray-700">Current Password</label>
              <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password" // changed from currentPassword
                  value={form.password}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Enter current password"
                  required
                  disabled={isLoading}
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
                  name="new_password" // changed from newPassword
                  value={form.new_password}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="font-medium text-gray-700">Confirm New Password</label>
              <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Re-enter new password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-4 rounded-xl text-lg font-medium shadow-lg transition-all ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                "Save New Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;