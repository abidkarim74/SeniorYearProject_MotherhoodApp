import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/motherbaby.jpg';
import Family from '../assets/fam.jpg';
import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';
import { Eye, EyeOff, Heart, AlertCircle, Check, Smartphone } from 'lucide-react';
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
        if (value !== formData.password) return "Passwords don't match";
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

      if (err) {
        newErrors[key] = err;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof SignupFormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));

    if (error) setError(null);

    if (touched[fieldName]) {
      const fieldValue = type === 'checkbox' ? checked : value;

      const fieldError = validateField(fieldName, fieldValue);

      if (fieldError) {
        setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));

      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
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
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allTouched = (Object.keys(formData) as Array<keyof SignupFormData>).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});

    setTouched(allTouched);

    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { confirmPassword, agreeToTerms, ...submitData } = formData;

      const response = await postRequest('/auth/signup', submitData);
      setIsSuccess(true);

      setAccessToken(response.access_token);
      setUser(response.user);

      navigate("/");

    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);

      } else {
        setError("Network error!")
      }

    } finally {
      setLoading(false);
    }
  };

  const getPasswordRequirements = () => {
    const password = formData.password;
    return [
      { text: 'At least 6 characters', met: password.length >= 6 },
      { text: 'One lowercase letter', met: /(?=.*[a-z])/.test(password) },
      { text: 'One uppercase letter', met: /(?=.*[A-Z])/.test(password) },
      { text: 'One number', met: /(?=.*\d)/.test(password) },
    ];
  };

  const getError = (fieldName: keyof SignupFormData): string | undefined => {
    return errors[fieldName];
  };

  const isTouched = (fieldName: keyof SignupFormData): boolean => {
    return touched[fieldName] || false;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff6f6] via-[#fef2f2] to-[#fceaea]">
        <UnAuthHeader />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 w-full max-w-xs sm:max-w-sm md:max-w-md p-6 sm:p-8 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#e5989b]/10 to-[#d88a8d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#e5989b]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Welcome to Nurtura!</h2>
            <p className="text-gray-600 text-xs mb-6">Your account has been created successfully. Redirecting you...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UnAuthHeader />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left side - Image/Info Section */}
        <div
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Family})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/30" />

          <div className="relative z-10 flex flex-col justify-center p-8 xl:p-12 text-white">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Nurtura</h2>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                Begin Your Parenting<br />Journey With Us
              </h1>

              <p className="text-white/90 text-base md:text-lg mb-6 md:mb-10">
                Join thousands of parents who trust Nurtura to guide them through every precious moment of their child's early years.
              </p>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <span className="text-white/95 text-sm md:text-base">AI-powered health insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <span className="text-white/95 text-sm md:text-base">Personalized developmental tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <span className="text-white/95 text-sm md:text-base">Supportive community of parents</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-6 h-6 md:w-8 md:h-8 bg-[#e5989b] rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Mobile Hero Section - Shows on small screens */}
        <div className="lg:hidden relative min-h-[280px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Family})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" />

          <div className="relative z-10 h-full flex flex-col justify-center p-6 text-white">
            <div className="max-w-md mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">Nurtura</h2>
              </div>

              <h1 className="text-xl font-bold mb-3">
                Begin Your Parenting Journey
              </h1>

              <p className="text-white/95 text-xs mb-4">
                Create your account and start your parenting journey
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-2">
                <div className="flex items-center gap-2 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Check className="w-2.5 h-2.5" />
                  <span>AI Health Insights</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>On all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#fff6f6] via-[#fef2f2] to-[#fceaea] p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7 relative">
              {/* Decorative elements - hidden on smallest screens */}
              <div className="absolute -top-5 -right-5 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-[#e5989b]/5 to-transparent rounded-full opacity-50 hidden sm:block"></div>

              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white p-0.5">
                  <img
                    src={MotherBaby}
                    alt="Mother and baby"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="text-center mb-5 pt-3">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  Create Your Account
                </h1>
                <p className="text-gray-600 text-xs">
                  Join our community of supportive parents
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['firstname', 'lastname'] as Array<keyof SignupFormData>).map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        {field === 'firstname' ? 'First Name' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field] as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field === 'firstname' ? 'John' : 'Doe'}
                        className={`w-full px-3 py-2 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${getError(field) && isTouched(field)
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]'
                          }`}
                      />
                      {getError(field) && isTouched(field) && (
                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {getError(field)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jane123"
                    className={`w-full px-3 py-2 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${getError('username') && isTouched('username')
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]'
                      }`}
                  />
                  {getError('username') && isTouched('username') && (
                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {getError('username')}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    className={`w-full px-3 py-2 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${getError('email') && isTouched('email')
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]'
                      }`}
                  />
                  {getError('email') && isTouched('email') && (
                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {getError('email')}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter password"
                        className={`w-full px-3 py-2 pr-10 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${getError('password') && isTouched('password')
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 hover:bg-gray-50 rounded-lg"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                    {getError('password') && isTouched('password') && (
                      <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {getError('password')}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm password"
                        className={`w-full px-3 py-2 pr-10 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${getError('confirmPassword') && isTouched('confirmPassword')
                            ? 'border-red-300 focus:ring-red-200'
                            : formData.confirmPassword && formData.confirmPassword === formData.password
                              ? 'border-green-300 focus:ring-green-200'
                              : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b] hover:border-[#e5989b]'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 hover:bg-gray-50 rounded-lg"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                    {getError('confirmPassword') && isTouched('confirmPassword') && (
                      <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {getError('confirmPassword')}
                      </p>
                    )}
                    {formData.confirmPassword && formData.confirmPassword === formData.password && (
                      <p className="text-green-600 text-xs mt-0.5 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        Passwords match
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Password Requirements:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {getPasswordRequirements().map((req, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          {req.met ? (
                            <Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-2.5 h-2.5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 pt-1">
                  <div className="flex items-center h-4 mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-3.5 h-3.5 border-2 rounded focus:ring-1 focus:ring-[#e5989b]/20 ${getError('agreeToTerms') && isTouched('agreeToTerms')
                          ? 'border-red-300'
                          : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium underline">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>
                {getError('agreeToTerms') && isTouched('agreeToTerms') && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {getError('agreeToTerms')}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none text-sm mt-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      Create Account
                    </span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-5 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-xs">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-[#e5989b] hover:text-[#d88a8d] font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </div>

            {/* Mobile-only features */}
            <div className="mt-5 text-center lg:hidden">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                  <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-[#e5989b]" />
                  </div>
                  <p className="text-[10px] text-gray-600">AI Health Insights</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                  <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-[#e5989b]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#e5989b]" />
                  </div>
                  <p className="text-[10px] text-gray-600">Progress Tracking</p>
                </div>
              </div>
              <p className="text-gray-500 text-[10px]">
                Your parenting journey, beautifully supported on any device
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;