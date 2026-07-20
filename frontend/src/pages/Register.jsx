// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaSpinner, 
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaPhone,
  FaBuilding,
  FaArrowRight,
  FaSignInAlt
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const LAWYER_IMAGE = "/images/lawyer.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attorney',
    phone: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register } = useAuth();

  // ✅ ALLOWED EMAILS
  const ALLOWED_EMAILS = [
    'aqsasaher5995@gmail.com',
    'hr.callbackcrew@gmail.com',
    'admin@jurisflow.com'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // ✅ CHECK: Sirf allowed emails register kar sakte hain
    if (!ALLOWED_EMAILS.includes(formData.email.toLowerCase())) {
      setError('Registration is currently restricted. Only authorized emails can register.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      setIsLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      company: formData.company,
    });

    if (result.success) {
      setSuccessMessage('✅ Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={LAWYER_IMAGE}
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 mb-3">
              <GiScales className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Juris<span className="text-[#BBE1FA]">Flow</span>
            </h1>
            <p className="text-[10px] text-white/40 font-semibold tracking-[0.2em] uppercase mt-1">
              Legal Case Management
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-white/40 text-sm mt-1">Registration is restricted to authorized users</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white px-4 py-3.5 rounded-xl text-sm mb-5 flex items-start gap-2">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-white px-4 py-3.5 rounded-xl text-sm mb-5 flex items-start gap-2">
              <span className="text-base flex-shrink-0">✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                placeholder="Enter your email address"
                required
              />
              <p className="text-[10px] text-white/30 mt-1">
                ⚠️ Only authorized emails can register
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all appearance-none"
                >
                  <option value="attorney" className="text-[#1B262C]">Attorney</option>
                  <option value="paralegal" className="text-[#1B262C]">Paralegal</option>
                  <option value="client" className="text-[#1B262C]">Client</option>
                  <option value="admin" className="text-[#1B262C]">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Company <span className="text-white/40 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                placeholder="Law Firm Name"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/30 bg-white/10 text-[#BBE1FA] focus:ring-[#BBE1FA]/30 focus:ring-2 focus:outline-none transition-all flex-shrink-0"
                />
                <span className="text-sm text-white/50 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-[#BBE1FA] hover:text-white transition-colors font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-[#BBE1FA] hover:text-white transition-colors font-medium">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0F4C75]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="text-[#BBE1FA] hover:text-white font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-white/20">
              © {new Date().getFullYear()} JurisFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;