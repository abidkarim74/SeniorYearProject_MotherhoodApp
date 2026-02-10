import { useState, type ChangeEvent, type FormEvent } from "react";
import { postRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import MotherBaby from "../assets/motherbaby.jpg";

import { Eye, EyeOff, Heart, AlertCircle, Check, Smartphone } from "lucide-react";
import UnAuthHeader from "../components/UnAuthHeader";


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
    <div className="min-h-screen flex flex-col">
      <UnAuthHeader />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left side - Image/Info Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#fff5f7] items-center justify-center p-12">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e5989b]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d88a8d]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Circular Image */}
            <div className="w-64 h-64 rounded-full border-8 border-white shadow-xl overflow-hidden mb-8 relative">
              <img
                src={MotherBaby}
                alt="Mother and Baby"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex items-center justifying-center gap-3 mb-6 justify-center">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Heart className="w-7 h-7 text-[#e5989b]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Nurtura</h2>
              </div>

              <h1 className="text-3xl font-bold mb-6 leading-tight text-gray-900">
                Your Compassionate<br />Parenting Companion
              </h1>

              <p className="text-gray-600 text-lg mb-10">
                Join thousands of parents who trust Nurtura to guide them through every precious moment of their child's early years.
              </p>

              <div className="space-y-4 text-left inline-block">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#e5989b]" />
                  </div>
                  <span className="text-gray-700 font-medium">AI-powered health insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#e5989b]" />
                  </div>
                  <span className="text-gray-700 font-medium">Personalized developmental tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#e5989b]" />
                  </div>
                  <span className="text-gray-700 font-medium">Supportive community of parents</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Hero Section - Shows on small screens */}
        <div className="lg:hidden relative min-h-[300px] bg-[#fff5f7] flex items-center justify-center">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#e5989b]/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 h-full flex flex-col justify-center p-6 text-center">

            <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden mb-6">
              <img
                src={MotherBaby}
                alt="Mother and Baby"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="max-w-md mx-auto relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#e5989b]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Nurtura</h2>
              </div>

              <h1 className="text-2xl font-bold mb-3 text-gray-900">
                Your Parenting Companion
              </h1>

              <p className="text-gray-600 text-sm mb-6">
                Sign in to continue your parenting journey
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm bg-white rounded-full px-4 py-2 border border-blue-50 text-gray-700 shadow-sm">
                  <Check className="w-3 h-3 text-[#e5989b]" />
                  <span>AI Health Insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white rounded-full px-4 py-2 border border-blue-50 text-gray-700 shadow-sm">
                  <Smartphone className="w-3 h-3 text-[#e5989b]" />
                  <span>On all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#fff6f6] via-[#fef2f2] to-[#fceaea] p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 relative lg:-mt-4">
              {/* Decorative elements - hidden on smallest screens */}
              <div className="absolute -top-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-bl from-[#e5989b]/5 to-transparent rounded-full opacity-50 hidden sm:block"></div>

              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 sm:border-3 border-white shadow-md bg-white p-0.5">
                  <img
                    src={MotherBaby}
                    alt="Mother and baby"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="text-center mb-6 pt-4 sm:pt-6">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                  Welcome back
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Sign in to continue your parenting journey
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg mb-4 flex items-center gap-2 text-xs sm:text-sm">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
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
                    placeholder="you@example.com"
                    required
                    className={`w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${errors.email && touched.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]"
                      }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
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
                      className={`w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base pr-12 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${errors.password && touched.password
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded-md mr-2 flex items-center justify-center transition-all duration-200 ${formData.rememberMe
                        ? "bg-[#e5989b] border-[#e5989b]"
                        : "border-gray-300 group-hover:border-[#e5989b] bg-white"
                        }`}
                    >
                      {formData.rememberMe && (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-[#e5989b] hover:text-[#d88a8d] font-medium transition-colors duration-200 hover:underline text-right"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-xs sm:text-sm">
                  New to Nurtura?{" "}
                  <a
                    href="/signup"
                    className="text-[#e5989b] hover:text-[#d88a8d] font-semibold transition-colors duration-200 hover:underline"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>

            {/* Mobile-only features */}
            <div className="mt-6 text-center lg:hidden">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-[#e5989b]" />
                  </div>
                  <p className="text-xs text-gray-600">AI Health Insights</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#e5989b]" />
                  </div>
                  <p className="text-xs text-gray-600">Progress Tracking</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                Your parenting journey, beautifully supported on any device
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;