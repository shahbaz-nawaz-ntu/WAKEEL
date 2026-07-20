// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaSpinner, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const LAWYER_IMAGE = "/images/lawyer.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('✅ Password reset link sent!');
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={LAWYER_IMAGE}
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
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

          <button
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4 group text-xs"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          {!isSubmitted ? (
            <>
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-white">Forgot Password</h2>
                <p className="text-white/50 text-xs mt-1">
                  Enter your email to receive a reset link
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white px-3 py-2.5 rounded-xl text-xs mb-3 flex items-start gap-2">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

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
                      placeholder="Enter your registered email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-3">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-green-400 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Check Your Email</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                We've sent a reset link to <br />
                <span className="text-[#BBE1FA] font-medium">{email}</span>
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-medium transition-all duration-300 border border-white/20 text-sm"
              >
                Back to Sign In
              </button>
            </div>
          )}

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

export default ForgotPassword;