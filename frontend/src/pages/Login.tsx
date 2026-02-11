import { useState, type ChangeEvent, type FormEvent } from "react";
import { postRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import MotherBaby from "../assets/motherbaby.jpg";
import Family from "../assets/fam.jpg";
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
    <div className="min-h-screen flex flex-col">
      <UnAuthHeader />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left side - Image/Info Section (~55% width) */}
        <div
          className="hidden lg:flex lg:w-[55%] relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Family})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col justify-center p-8 xl:p-10 text-white">
            <div className="max-w-md mx-auto transform transition-all duration-500">
              <div className="flex items-center gap-3 mb-6 transition-all duration-500">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-500 hover:bg-white/25">
                  <Heart className="w-5 h-5 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110" />
                </div>
                <h2 className="text-2xl md:text-2xl font-bold transition-all duration-500">Nurtura</h2>
              </div>

              <h1 className="text-3xl md:text-3xl font-bold mb-4 leading-tight transition-all duration-500">
                Your Compassionate
                <br />
                Parenting Companion
              </h1>

              <p className="text-white/90 text-base md:text-base mb-6 transition-all duration-500">
                Join thousands of parents who trust Nurtura to guide them through every precious moment of their child's early years.
              </p>

              <div className="space-y-3 transition-all duration-500">
                <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
                  <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                    <Check className="w-3 h-3 md:w-3 md:h-3 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-white/95 text-base transition-all duration-300">AI-powered health insights</span>
                </div>
                <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
                  <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                    <Check className="w-3 h-3 md:w-3 md:h-3 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-white/95 text-base transition-all duration-300">Personalized developmental tracking</span>
                </div>
                <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
                  <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                    <Check className="w-3 h-3 md:w-3 md:h-3 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-white/95 text-base transition-all duration-300">Supportive community of parents</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-6 h-6 md:w-7 md:h-7 bg-[#e5989b] rounded-full opacity-20 animate-pulse transition-all duration-1000"></div>
          </div>
        </div>

        {/* Mobile Hero Section - Shows on small screens */}
        <div
          className="lg:hidden relative min-h-[220px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Family})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" />

          <div className="relative z-10 h-full flex flex-col justify-center p-4 text-white">
            <div className="max-w-md mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">Nurtura</h2>
              </div>

              <h1 className="text-lg font-bold mb-3">
                Your Compassionate Parenting Companion
              </h1>

              <p className="text-white/95 text-xs mb-4">
                Sign in to continue your parenting journey
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Check className="w-2.5 h-2.5" />
                  <span>AI Health Insights</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>On all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form (~45% width and slightly smaller) */}
        <div className="flex-1 lg:w-[45%] flex items-center justify-center bg-gradient-to-br from-[#fff6f6] via-[#fef2f2] to-[#fceaea] p-4 sm:p-6 md:p-8 transition-all duration-500">
          <div className="w-full max-w-xs sm:max-w-sm transition-all duration-500">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 relative transition-all duration-500 hover:shadow-xl hover:scale-[1.005]">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-bl from-[#e5989b]/5 to-transparent rounded-full opacity-50 hidden sm:block transition-all duration-700 animate-pulse"></div>

              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 transition-all duration-500 hover:-top-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 border-white shadow bg-white p-0.5 transition-all duration-500 hover:shadow-md">
                  <img
                    src={MotherBaby}
                    alt="Mother and baby"
                    className="w-full h-full object-cover rounded-md transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              <div className="text-center mb-4 pt-5 transition-all duration-500">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-1 transition-all duration-500">
                  Welcome back
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm transition-all duration-500">
                  Sign in to continue your parenting journey
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center gap-2 text-xs transition-all duration-300">
                  <AlertCircle className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-500" noValidate>
                <div className="space-y-1.5 transition-all duration-500">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 transition-all duration-500"
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
                    className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e5989b]/20 focus:border-[#e5989b] transition-all duration-300 placeholder-gray-400 hover:border-[#e5989b]/50 ${
                      errors.email && touched.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1 transition-all duration-300">
                      <AlertCircle className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 transition-all duration-500">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-700 transition-all duration-500"
                  >
                    Password
                  </label>
                  <div className="relative transition-all duration-500">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      required
                      className={`w-full px-3 py-2 text-xs pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e5989b]/20 focus:border-[#e5989b] transition-all duration-300 placeholder-gray-400 hover:border-[#e5989b]/50 ${
                        errors.password && touched.password
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 p-0.5 hover:bg-gray-50 rounded-md"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1 transition-all duration-300">
                      <AlertCircle className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 transition-all duration-500">
                  <label className="flex items-center cursor-pointer group transition-all duration-300">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-3.5 h-3.5 border rounded-sm mr-1.5 flex items-center justify-center transition-all duration-300 ${
                        formData.rememberMe
                          ? "bg-[#e5989b] border-[#e5989b] group-hover:bg-[#d88a8d] group-hover:border-[#d88a8d]"
                          : "border-gray-300 group-hover:border-[#e5989b] bg-white"
                      }`}
                    >
                      {formData.rememberMe && (
                        <Check className="w-2 h-2 text-white transition-transform duration-300" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-[#e5989b] hover:text-[#d88a8d] font-medium transition-all duration-300 hover:underline text-right"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-2.5 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none text-xs active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-1.5 transition-all duration-300">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 transition-all duration-300"> 
                      <Heart className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-4 border-t border-gray-100 transition-all duration-500">
                <p className="text-gray-600 text-xs transition-all duration-500">
                  New to Nurtura?{" "}
                  <a
                    href="/signup"
                    className="text-[#e5989b] hover:text-[#d88a8d] font-medium transition-all duration-300 hover:underline text-xs"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>

            {/* Mobile-only features */}
            <div className="mt-6 text-center lg:hidden transition-all duration-500">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                  <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-[#e5989b]/10 flex items-center justify-center transition-all duration-300 hover:bg-[#e5989b]/20">
                    <Heart className="w-4 h-4 text-[#e5989b] transition-transform duration-300 hover:scale-110" />
                  </div>
                  <p className="text-xs text-gray-600">AI Health Insights</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                  <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-[#e5989b]/10 flex items-center justify-center transition-all duration-300 hover:bg-[#e5989b]/20">
                    <Check className="w-4 h-4 text-[#e5989b] transition-transform duration-300 hover:scale-110" />
                  </div>
                  <p className="text-xs text-gray-600">Progress Tracking</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs transition-all duration-500">
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