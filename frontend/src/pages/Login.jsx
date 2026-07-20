// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const LAWYER_IMAGE = "/images/lawyer.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const { login } = useAuth();

  // Handle social login callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Social login error:', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    setIsResetLoading(true);
    setError('');
    setResetMessage('');
    
    try {
      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResetMessage('✅ Password reset link sent!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsResetLoading(false);
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <GiScales className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Juris<span className="text-[#BBE1FA]">Flow</span>
              </h1>
              <p className="text-[9px] text-white/50 font-semibold tracking-[0.15em] uppercase text-center">
                Legal Case Management
              </p>
            </div>
          </div>

          {/* Welcome */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-white">Welcome Back</h2>
            <p className="text-white/50 text-xs mt-1">Sign in to your account</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white px-3 py-2.5 rounded-xl text-xs mb-3 flex items-start gap-2">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {resetMessage && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-white px-3 py-2.5 rounded-xl text-xs mb-3 flex items-start gap-2">
              <span className="text-base flex-shrink-0">✅</span>
              <span>{resetMessage}</span>
            </div>
          )}

          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-white/40 text-xs" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white/70">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] text-[#BBE1FA] hover:text-white transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-white/40 text-xs" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-[#BBE1FA] focus:ring-[#BBE1FA]/30 focus:ring-2 focus:outline-none transition-all"
                    />
                    <span className="text-xs text-white/60">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div className="text-center mb-3">
                <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                <p className="text-xs text-white/50">Enter your email to receive a reset link</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-white/40 text-xs" />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-[#BBE1FA] focus:ring-2 focus:ring-[#BBE1FA]/20 focus:outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetLoading}
                className="w-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isResetLoading ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setResetEmail('');
                }}
                className="w-full text-xs text-white/50 hover:text-white transition-colors text-center"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

          {/* ============================================
              ✅ CREATE ACCOUNT LINK REMOVED
          ============================================ */}

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-[9px] text-white/20">
              © {new Date().getFullYear()} JurisFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;