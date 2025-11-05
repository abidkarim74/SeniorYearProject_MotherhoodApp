import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postRequest } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MotherBaby from '../assets/motherbaby.jpg';
import { type SignupFormData, type SignupErrors } from '../interfaces/AuthInterfaces';

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

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const validateField = (name: string, value: string | boolean): string | null => {
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
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError(null);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, val);
    if (fieldError) setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    setLoading(true);
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ec] to-[#f8cdda] px-4 py-8">
        <div className="bg-[#fffaf5] rounded-2xl shadow-xl w-full max-w-md p-8 text-center border border-[#f5d6cb]">
          <h2 className="text-2xl font-bold text-[#4b2e2b] mb-2">Account Created Successfully!</h2>
          <p className="text-[#7a5d55] mb-6">Redirecting you to the home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ec] to-[#f8cdda] px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl md:gap-[3cm] gap-8">
        {/* Left circular image (responsive) */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-lg border-4 border-[#f8cdda]">
            <img
              src={MotherBaby}
              alt="Mother and baby illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Signup box */}
        <div className="bg-[#fdf6ec] rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-[#f5d6cb]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4b2e2b]">Create Account</h2>
            <p className="text-[#7a5d55] mt-2">Join us by filling in your details below</p>
          </div>

          {error && (
            <div className="bg-[#fde2e4] border border-[#fbcfe8] text-[#a4161a] px-4 py-3 rounded-xl mb-6 shadow-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['firstname', 'lastname'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[#5a3e36] mb-2">
                    {field === 'firstname' ? 'First Name' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field as keyof SignupFormData] as string}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field === 'firstname' ? 'John' : 'Doe'}
                    className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] ${
                      errors[field] && touched[field] ? 'border-red-300' : 'border-[#d8b4a0]'
                    }`}
                  />
                  {errors[field] && touched[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#5a3e36] mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane123"
                className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] ${
                  errors.username && touched.username ? 'border-red-300' : 'border-[#d8b4a0]'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#5a3e36] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] ${
                  errors.email && touched.email ? 'border-red-300' : 'border-[#d8b4a0]'
                }`}
              />
            </div>

            {/* Password + Confirm Password */}
            {['password', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#5a3e36] mb-2">
                  {field === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  name={field}
                  value={formData[field as keyof SignupFormData] as string}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={field === 'password' ? 'Enter your password' : 'Confirm password'}
                  className={`w-full px-4 py-3 border rounded-xl bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#f8cdda] ${
                    errors[field] && touched[field] ? 'border-red-300' : 'border-[#d8b4a0]'
                  }`}
                />
              </div>
            ))}

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-5 h-5 rounded border-[#f5d6cb] accent-[#f8cdda]"
              />
              <span className="text-sm text-[#5a3e36]">
                I agree to the{' '}
                <a href="#" className="text-[#e5989b] hover:text-[#c85c5c] underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#e5989b] hover:text-[#c85c5c] underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#f8cdda] to-[#fbcfe8] text-[#4b2e2b] py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fbcfe8] focus:ring-offset-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a5d55] mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-[#e5989b] hover:text-[#c85c5c] font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
