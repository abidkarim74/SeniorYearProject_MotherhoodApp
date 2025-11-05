import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/motherbaby.jpg';

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
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string | boolean): string | null => {
    switch (name) {
      case 'email':
        if (!value.toString().trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()))
          return 'Please enter a valid email address';
        return null;
      case 'password':
        if (!value.toString().trim()) return 'Password is required';
        if (value.toString().length < 6) return 'Password must be at least 6 characters';
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};
    (Object.keys(formData) as Array<keyof LoginFormData>).forEach((key) => {
      if (key !== 'rememberMe') {
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
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof LoginErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) setError(null);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, fieldValue);
    if (fieldError) setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched = { email: true, password: true, rememberMe: true };
    setTouched(allTouched);
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await postRequest('/auth/login', formData);
      if (formData.rememberMe) localStorage.setItem('rememberMe', 'true');
      setAccessToken(response);
      navigate('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ec] to-[#f8cdda] px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 md:gap-[3cm]">
        {/* Left Image */}
        <div className="flex-shrink-0 flex items-center justify-center mb-8 md:mb-0">
          <div className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-lg border-4 border-[#f8cdda]">
            <img
              src={MotherBaby}
              alt="Mother and baby illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Login Box */}
        <div className="bg-[#fdf6ec] rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 border border-[#f5d6cb]">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e2b]">Welcome Back</h2>
            <p className="text-[#7a5d55] mt-2 text-sm md:text-base">Please sign in to your account</p>
          </div>

          {error && (
            <div className="bg-[#fde2e4] border border-[#fbcfe8] text-[#a4161a] px-4 py-3 rounded-xl mb-6 shadow-sm">
              <div className="flex items-center text-sm md:text-base">
                <svg
                  className="w-5 h-5 mr-2"
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
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5a3e36] mb-2">
                Email
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
                className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] focus:border-transparent transition-all duration-200 text-sm md:text-base ${
                  errors.email && touched.email ? 'border-red-300' : 'border-[#d8b4a0]'
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5a3e36] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                required
                className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] focus:border-transparent transition-all duration-200 text-sm md:text-base ${
                  errors.password && touched.password ? 'border-red-300' : 'border-[#d8b4a0]'
                }`}
              />
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    formData.rememberMe ? 'bg-[#f8cdda] border-[#f8cdda]' : 'border-[#d8b4a0]'
                  }`}
                >
                  {formData.rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[#5a3e36] text-sm">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-[#e5989b] hover:text-[#c85c5c] text-sm font-medium transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#f8cdda] to-[#fbcfe8] text-[#4b2e2b] py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fbcfe8] focus:ring-offset-2 disabled:opacity-50 text-sm md:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-[#4b2e2b] rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[#7a5d55] text-sm md:text-base">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-[#e5989b] hover:text-[#c85c5c] font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
