import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Logo from '../assets/motherbaby.jpg';

import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';
import { Eye, EyeOff, Heart, AlertCircle, Check } from 'lucide-react';
import UnAuthHeader from '../components/UnAuthHeader';

const Signup = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const validateField = (name: keyof SignupFormData, value: string | boolean): string | null => {
    switch (name) {
      case 'firstname':
        if (!value.toString().trim()) return 'First name is required';
        if (value.toString().length < 2) return 'First name must be at least 2 characters';
        return null;
      case 'lastname':
        if (!value.toString().trim()) return 'Last name is required';
        if (value.toString().length < 2) return 'Last name must be at least 2 characters';
        return null;
      case 'username':
        if (!value.toString().trim()) return 'Username is required';
        if (value.toString().length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value.toString()))
          return 'Username can only contain letters, numbers, and underscores';
        return null;
      case 'email':
        if (!value.toString().trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()))
          return 'Please enter a valid email address';
        return null;
      case 'password':
        return validatePassword(value.toString());
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords don\'t match';
        return null;
      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};
    (Object.keys(formData) as Array<keyof SignupFormData>).forEach((key) => {
      const val = formData[key];
      const err = validateField(key, val as string | boolean);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof SignupFormData;
    setFormData((prev) => ({ ...prev, [fieldName]: type === 'checkbox' ? checked : value }));
    if (error) setError(null);
    if (touched[fieldName]) {
      const fieldValue = type === 'checkbox' ? checked : value;
      const fieldError = validateField(fieldName, fieldValue);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
      } else {
        setErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
      }
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof SignupFormData;
    const fieldValue = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldError = validateField(fieldName, fieldValue);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched = (Object.keys(formData) as Array<keyof SignupFormData>).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(allTouched);
    if (!validateForm()) { setError('Please fix the errors above'); return; }
    setLoading(true);
    setError(null);
    try {
      const { confirmPassword, agreeToTerms, ...submitData } = formData;
      const response = await postRequest('/auth/signup', submitData);
      setIsSuccess(true);
      setAccessToken(response);
      setTimeout(() => window.location.assign('/'));
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Network error!');
      }
    } finally {
      setLoading(false);
    }
  };

  const getError = (fieldName: keyof SignupFormData): string | undefined => errors[fieldName];
  const isTouched = (fieldName: keyof SignupFormData): boolean => touched[fieldName] || false;

  if (isSuccess) {
    return (
      <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#fce4ec' }}>
        <div className="fixed top-0 left-0 right-0 z-20">
          <UnAuthHeader />
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10 mt-16 lg:mt-20 px-4">
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Nurtura!</h2>
            <p className="text-gray-600 text-sm mb-6">Your account has been created successfully. Redirecting you...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fce4ec' }}>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <UnAuthHeader />
      </div>

      {/* Main content */}
      <div className="relative z-10 mt-16 lg:mt-20 flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-8">
          <div className="flex flex-1 flex-col lg:flex-row">

            {/* Left side - Logo only (updated to match login styling) */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
              <div className="w-64 h-64 xl:w-80 xl:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={Logo}
                  alt="Nurtura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="flex-1 flex items-center justify-center lg:justify-end px-4 lg:px-8 xl:px-16">
              <div className="w-full max-w-[380px] lg:mr-16">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-6 relative">
                  <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-bl from-white/30 to-transparent rounded-full opacity-50 hidden sm:block"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-white/30 to-transparent rounded-full opacity-50 hidden sm:block"></div>

                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white/90 p-0.5">
                      <div className="w-full h-full bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-md flex items-center justify-center">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4 pt-6">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Create Account</h1>
                    <p className="text-gray-600 text-xs">Join our community of supportive parents</p>
                  </div>

                  {error && (
                    <div className="bg-[#dc143c]/10 border border-[#dc143c]/30 text-[#dc143c] px-3 py-2 rounded-lg mb-4 flex items-center gap-1.5 text-xs">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      {(['firstname', 'lastname'] as Array<keyof SignupFormData>).map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">
                            {field === 'firstname' ? 'First' : 'Last'}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={formData[field] as string}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={field === 'firstname' ? 'John' : 'Doe'}
                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                              getError(field) && isTouched(field)
                                ? 'border-[#dc143c] focus:ring-[#dc143c]/20'
                                : 'border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]'
                            }`}
                          />
                          {getError(field) && isTouched(field) && (
                            <p className="text-[#dc143c] text-xs mt-0.5 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" />
                              {getError(field)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="jane123"
                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                          getError('username') && isTouched('username')
                            ? 'border-[#dc143c] focus:ring-[#dc143c]/20'
                            : 'border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]'
                        }`}
                      />
                      {getError('username') && isTouched('username') && (
                        <p className="text-[#dc143c] text-xs mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {getError('username')}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="your@email.com"
                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                          getError('email') && isTouched('email')
                            ? 'border-[#dc143c] focus:ring-[#dc143c]/20'
                            : 'border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]'
                        }`}
                      />
                      {getError('email') && isTouched('email') && (
                        <p className="text-[#dc143c] text-xs mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {getError('email')}
                        </p>
                      )}
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="......"
                            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                              getError('password') && isTouched('password')
                                ? 'border-[#dc143c] focus:ring-[#dc143c]/20'
                                : 'border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {getError('password') && isTouched('password') && (
                          <p className="text-[#dc143c] text-xs mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            {getError('password')}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">Confirm</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="......"
                            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg bg-white/80 focus:outline-none focus:ring-1 transition-all duration-200 placeholder-gray-400 ${
                              getError('confirmPassword') && isTouched('confirmPassword')
                                ? 'border-[#dc143c] focus:ring-[#dc143c]/20'
                                : formData.confirmPassword && formData.confirmPassword === formData.password
                                  ? 'border-green-300 focus:ring-green-200'
                                  : 'border-gray-300 focus:ring-[#e5989b] focus:border-[#e5989b] hover:border-[#e5989b]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {formData.confirmPassword && formData.confirmPassword === formData.password && (
                      <p className="text-green-600 text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}

                    {/* Terms */}
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-3.5 h-3.5 mt-0.5 border-2 rounded focus:ring-1 focus:ring-[#e5989b]/20"
                      />
                      <span className="text-xs text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium">Terms</a>
                        {' '}&{' '}
                        <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium">Privacy</a>
                      </span>
                    </div>
                    {getError('agreeToTerms') && isTouched('agreeToTerms') && (
                      <p className="text-[#dc143c] text-xs flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {getError('agreeToTerms')}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#e5989b]/30 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <>
                          <Heart className="w-4 h-4" />
                          <span>Sign Up</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-3 border-t border-gray-200/50">
                    <p className="text-gray-600 text-xs">
                      Already have an account?{' '}
                      <a href="/login" className="text-[#e5989b] hover:text-[#d88a8d] font-semibold hover:underline">
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;