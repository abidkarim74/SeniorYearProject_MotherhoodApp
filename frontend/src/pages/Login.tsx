import { useState, type ChangeEvent, type FormEvent } from "react";
import { postRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import MotherBaby from "../assets/motherbaby.jpg";
import Family from "../assets/fam.jpg";
import { Eye, EyeOff, Heart } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (
    name: string,
    value: string | boolean
  ): string | null => {
    switch (name) {
      case "email":
        if (!value.toString().trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()))
          return "Please enter a valid email address";
        return null;
      case "password":
        if (!value.toString().trim()) return "Password is required";
        if (value.toString().length < 6)
          return "Password must be at least 6 characters";
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};
    (Object.keys(formData) as Array<keyof LoginFormData>).forEach((key) => {
      if (key !== "rememberMe") {
        const value = formData[key];
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof LoginErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) setError(null);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, fieldValue);
    if (fieldError) setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched = { email: true, password: true, rememberMe: true };
    setTouched(allTouched);
    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await postRequest("/auth/login", formData);
      if (formData.rememberMe) localStorage.setItem("rememberMe", "true");
      setAccessToken(response);

      window.location.assign("/");

      
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea] px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-8 lg:gap-16">
        {/* Left Side - Family Image - Hidden on mobile */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={Family}
                alt="Happy family"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#e5989b] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#e5989b] rounded-full opacity-15 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -right-6 w-6 h-6 bg-[#e5989b] rounded-full opacity-25 animate-pulse delay-500"></div>
          </div>
        </div>

        <div className="flex-1 max-w-sm w-full md:mr-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-3 border-white shadow-md">
                <img
                  src={MotherBaby}
                  alt="Mother and baby"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center mb-6 pt-3">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
                  Nurtura
                </span>
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to continue your parenting journey
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  required
                  className={`w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.email && touched.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    required
                    className={`w-full px-3 py-2.5 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.password && touched.password
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center transition-all duration-200 ${
                      formData.rememberMe
                        ? "bg-[#e5989b] border-[#e5989b]"
                        : "border-gray-300 group-hover:border-[#e5989b]"
                    }`}
                  >
                    {formData.rememberMe && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-[#e5989b] hover:text-[#d88a8d] font-medium transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-[#e5989b] hover:text-[#d88a8d] font-semibold transition-colors duration-200"
                >
                  Create one here
                </a>
              </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;