import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/motherbaby.jpg';
import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

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
      setTimeout(() => navigate('/'), 2000);
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
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8 lg:gap-16">
        {/* Left Image Section */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#e5989b]/30">
            <img
              src={MotherBaby}
              alt="Mother and baby illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-[#e5989b]/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join Nurtura and start tracking your child's journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['firstname', 'lastname'] as Array<keyof SignupFormData>).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === 'firstname' ? 'First Name' : 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] as string}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field === 'firstname' ? 'John' : 'Doe'}
                    className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                      getError(field) && isTouched(field) 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                    }`}
                  />
                  {getError(field) && isTouched(field) && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {getError(field)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane123"
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                  getError('username') && isTouched('username') 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                }`}
              />
              {getError('username') && isTouched('username') && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {getError('username')}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                  getError('email') && isTouched('email') 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                }`}
              />
              {getError('email') && isTouched('email') && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {getError('email')}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                    getError('password') && isTouched('password') 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-[#e5989b]/20 focus:border-[#e5989b]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 space-y-2">
                  {getPasswordRequirements().map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {getError('password') && isTouched('password') && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {getError('password')}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {getError('confirmPassword') && isTouched('confirmPassword') && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {getError('confirmPassword')}
                </p>
              )}
              {formData.confirmPassword && formData.confirmPassword === formData.password && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-5 h-5 rounded border-2 mt-0.5 focus:ring-2 focus:ring-[#e5989b]/20 ${
                  getError('agreeToTerms') && isTouched('agreeToTerms') 
                    ? 'border-red-300 text-red-600' 
                    : 'border-gray-300 text-[#e5989b]'
                }`}
              />
              <span className="text-sm text-gray-600">
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
              className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-[#e5989b] hover:text-[#d88a8d] font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;