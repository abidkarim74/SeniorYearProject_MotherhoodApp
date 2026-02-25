import { useState, type ChangeEvent, type FormEvent } from "react";
import { postRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

import { Eye, EyeOff, Heart, AlertCircle, Check } from "lucide-react";
import UnAuthHeader from "../components/UnAuthHeader";

// Import the logo asset
import motherBabyLogo from "../assets/motherbaby.jpg";

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
  const { setAccessToken, setUser } = useAuth();
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

      setAccessToken(response.access_token);
      setUser(response.user);

      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Network error!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#fce4ec' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <UnAuthHeader />
      </div>

      {/* Main content */}
      <div className="flex-1 flex relative z-10 mt-16 lg:mt-20">
        
        {/* Left side - Centered Circle Logo */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="w-64 h-64 xl:w-80 xl:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={motherBabyLogo} 
              alt="Nurtura Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center lg:justify-end relative z-10 px-4 lg:px-8 xl:px-16">
          <div className="w-full max-w-[340px] lg:mr-16">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white/90 p-0.5">
                  <div className="w-full h-full bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-md flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-5 pt-6">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  Welcome back
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Sign in to continue
                </p>
              </div>

              {error && (
                <div className="bg-[#dc143c]/10 border border-[#dc143c]/30 text-[#dc143c] px-3 py-2 rounded-lg mb-4 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="huma@gmail.com"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                      errors.email && touched.email
                        ? "border-[#dc143c] focus:ring-[#dc143c]/20"
                        : "border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-[#dc143c] text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700">
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
                      placeholder="*********"
                      className={`w-full px-3 py-2.5 text-sm pr-10 border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                        errors.password && touched.password
                          ? "border-[#dc143c] focus:ring-[#dc143c]/20"
                          : "border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-[#dc143c] text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
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
                          : "border-gray-300 group-hover:border-[#e5989b] bg-white/80"
                      }`}
                    >
                      {formData.rememberMe && (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900">
                      Remember
                    </span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-[#e5989b] hover:text-[#d88a8d] font-medium hover:underline"
                  >
                    Forgot?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#e5989b]/30 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="text-gray-600 text-xs">
                  New to Nurtura?{" "}
                  <a
                    href="/signup"
                    className="text-[#e5989b] hover:text-[#d88a8d] font-semibold hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;