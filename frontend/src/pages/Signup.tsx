import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/fam.jpg';

import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';
import { Eye, EyeOff, Heart, AlertCircle, Check, Sparkles, Baby, Flower2 } from 'lucide-react';
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
      setAccessToken(response);
      setTimeout(() => window.location.assign('/'));
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

  const getError = (fieldName: keyof SignupFormData): string | undefined => {
    return errors[fieldName];
  };

  const isTouched = (fieldName: keyof SignupFormData): boolean => {
    return touched[fieldName] || false;
  };

  if (isSuccess) {
    return (
      <div className="h-screen flex flex-col relative overflow-hidden">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${MotherBaby})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
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
    <div className="min-h-screen flex flex-col relative">
      {/* Full background image with overlay - fixed */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${MotherBaby})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header - fixed */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <UnAuthHeader />
      </div>

      {/* Main content - scrollable */}
      <div className="relative z-10 mt-16 lg:mt-20 flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-8">
          <div className="flex flex-1 flex-col lg:flex-row">
            {/* Left side - Cute text section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 text-white">
              <div className="max-w-md space-y-6">
                {/* Floating hearts animation */}
                <div className="relative">
                  <div className="absolute -top-10 -left-10 animate-bounce opacity-60">
                    <Heart className="w-6 h-6 text-pink-300" fill="#f9a8d4" />
                  </div>
                  <div className="absolute top-20 -right-10 animate-pulse opacity-60">
                    <Heart className="w-8 h-8 text-pink-300" fill="#f9a8d4" />
                  </div>
                  <div className="absolute bottom-0 left-20 animate-float opacity-60">
                    <Heart className="w-5 h-5 text-pink-300" fill="#f9a8d4" />
                  </div>
                </div>

                {/* Main welcome message */}
                <div className="text-center lg:text-left space-y-4">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <h1 className="text-3xl font-bold">Join Nurtura</h1>
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>
                  
                  <p className="text-xl text-white/90 leading-relaxed">
                    Begin your beautiful parenting journey with us 🌸
                  </p>
                </div>

                {/* Cute quotes */}
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Baby className="w-5 h-5 text-pink-300 flex-shrink-0 mt-1" />
                    <p className="text-sm text-white/90">
                      "Every child begins the world anew."
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Flower2 className="w-5 h-5 text-pink-300 flex-shrink-0 mt-1" />
                    <p className="text-sm text-white/90">
                      "Motherhood: All love begins and ends there."
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Heart className="w-5 h-5 text-pink-300 flex-shrink-0 mt-1" fill="#f9a8d4" />
                    <p className="text-sm text-white/90">
                      "The most precious jewels you'll ever have around your neck are the arms of your children."
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-pink-300">Free</div>
                    <div className="text-xs text-white/80">Forever</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-pink-300">24/7</div>
                    <div className="text-xs text-white/80">Support</div>
                  </div>
                </div>

                {/* Sweet closing line */}
                <p className="text-sm text-white/70 italic mt-8 text-center">
                  Join thousands of happy parents today 💝
                </p>
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="flex-1 flex items-center justify-center lg:justify-end px-4 lg:px-8 xl:px-16">
              <div className="w-full max-w-[380px] lg:mr-16">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-6 relative">
                  {/* Decorative elements */}
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
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      Create Account
                    </h1>
                    <p className="text-gray-600 text-xs">
                      Join our community of supportive parents
                    </p>
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
                      <label className="block text-xs font-medium text-gray-700">
                        Email
                      </label>
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
                            placeholder="••••••"
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
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {getError('password') && isTouched('password') && (
                          <p className="text-[#dc143c] text-xs mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            {getError('password')}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Confirm
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="••••••"
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
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password match indicator */}
                    {formData.confirmPassword && formData.confirmPassword === formData.password && (
                      <p className="text-green-600 text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}

                    {/* Terms Checkbox */}
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
                        <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium">
                          Terms
                        </a>{' '}
                        &{' '}
                        <a href="#" className="text-[#e5989b] hover:text-[#d88a8d] font-medium">
                          Privacy
                        </a>
                      </span>
                    </div>
                    {getError('agreeToTerms') && isTouched('agreeToTerms') && (
                      <p className="text-[#dc143c] text-xs flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {getError('agreeToTerms')}
                      </p>
                    )}

                    {/* Submit Button */}
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

                  {/* Login Link */}
                  <div className="text-center mt-4 pt-3 border-t border-gray-200/50">
                    <p className="text-gray-600 text-xs">
                      Already have an account?{' '}
                      <a
                        href="/login"
                        className="text-[#e5989b] hover:text-[#d88a8d] font-semibold hover:underline"
                      >
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

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Signup;