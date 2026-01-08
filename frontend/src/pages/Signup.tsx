import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/motherbaby.jpg';
import Family from '../assets/fam.jpg';
import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';
import { Eye, EyeOff, CheckCircle, XCircle, Heart } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

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
    
    // Real-time validation for touched fields
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
      
      setAccessToken(response);
      setTimeout(() => window.location.assign('/'));

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
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

  // Helper function to safely access errors
  const getError = (fieldName: keyof SignupFormData): string | undefined => {
    return errors[fieldName];
  };

  // Helper function to safely check if field is touched
  const isTouched = (fieldName: keyof SignupFormData): boolean => {
    return touched[fieldName] || false;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6f6] to-[#fceaea] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center border border-[#e5989b]/20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Welcome to Nurtura! Redirecting you to the home page...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#e5989b] h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="flex-1 max-w-md w-full md:mr-10">
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
                Join{' '}
                <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
                  Nurtura
                </span>
              </h1>
              <p className="text-gray-600 text-sm">
                Create your account and start your parenting journey
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['firstname', 'lastname'] as Array<keyof SignupFormData>).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === 'firstname' ? 'First Name' : 'Last Name'} *
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field] as string}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={field === 'firstname' ? 'John' : 'Doe'}
                      className={`w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                        getError(field) && isTouched(field) 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                      }`}
                    />
                    {getError(field) && isTouched(field) && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {getError(field)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="jane123"
                  className={`w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    getError('username') && isTouched('username') 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                  }`}
                />
                {getError('username') && isTouched('username') && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {getError('username')}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    getError('email') && isTouched('email') 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                  }`}
                />
                {getError('email') && isTouched('email') && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {getError('email')}
                  </p>
                )}
              </div>

              {/* Password Fields - Single line on large screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                        getError('password') && isTouched('password') 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {getError('password') && isTouched('password') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {getError('password')}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm your password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                        getError('confirmPassword') && isTouched('confirmPassword') 
                          ? 'border-red-300 focus:ring-red-200' 
                          : formData.confirmPassword && formData.confirmPassword === formData.password
                          ? 'border-green-300 focus:ring-green-200'
                          : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {getError('confirmPassword') && isTouched('confirmPassword') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {getError('confirmPassword')}
                    </p>
                  )}
                  {formData.confirmPassword && formData.confirmPassword === formData.password && (
                    <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Password Requirements - Show below on all screen sizes */}
              {formData.password && (
                <div className="mt-2 space-y-1 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-1">Password Requirements:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {getPasswordRequirements().map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300 flex-shrink-0" />
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
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-4 h-4 rounded border-2 mt-0.5 focus:ring-2 focus:ring-[#e5989b]/20 ${
                    getError('agreeToTerms') && isTouched('agreeToTerms') 
                      ? 'border-red-300 text-red-600' 
                      : 'border-gray-300 text-[#e5989b]'
                  }`}
                />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium underline">
                    Privacy Policy
                  </a>
                </span>
              </div>
              {getError('agreeToTerms') && isTouched('agreeToTerms') && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {getError('agreeToTerms')}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Create Account
                  </div>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-[#e5989b] hover:text-[#d88a8d] font-semibold transition-colors duration-200"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;