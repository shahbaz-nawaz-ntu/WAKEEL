// src/pages/AuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaGavel } from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const AuthCallback = () => {
  const [status, setStatus] = useState('Processing...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');
    const error = params.get('error');

    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    if (error) {
      setStatus('❌ Login failed. Please try again.');
      setIsSuccess(false);
      setProgress(100);
      setTimeout(() => {
        window.location.href = '/login?error=' + error;
      }, 2000);
      return;
    }

    if (token) {
      try {
        // Store token
        localStorage.setItem('auth_token', token);
        
        // If user data is provided, use it
        if (userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // ✅ FIX: Use environment variable instead of hardcoded URL
          fetchUserData(token);
        }
        
        setStatus('✅ Login successful! Redirecting...');
        setIsSuccess(true);
        setProgress(100);
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } catch (err) {
        setStatus('❌ Invalid response. Please try again.');
        setIsSuccess(false);
        setProgress(100);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else {
      setStatus('❌ No response from server. Please try again.');
      setIsSuccess(false);
      setProgress(100);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    return () => clearInterval(interval);
  }, []);

  // ✅ FIX: Use environment variable for API URL
  const fetchUserData = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user.data));
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0F4C75] to-[#1a2a4a] relative overflow-hidden">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#3282B8]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0F4C75]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3282B8]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md transform perspective-1000">
        <div 
          className={`
            relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20
            transition-all duration-700 transform hover:scale-105 hover:rotate-y-3
            ${isSuccess ? 'shadow-green-500/20 border-green-500/30' : ''}
            ${status.includes('❌') ? 'shadow-red-500/20 border-red-500/30' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: isSuccess 
              ? '0 20px 60px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1)' 
              : status.includes('❌')
              ? '0 20px 60px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.1)'
              : '0 20px 60px rgba(50, 130, 184, 0.15)'
          }}
        >
          {/* 3D Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3282B8] via-[#0F4C75] to-[#3282B8] rounded-3xl blur-xl opacity-20 -z-10"></div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3282B8] to-[#0F4C75] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#3282B8]/30 border border-white/20 transform rotate-3 hover:rotate-6 transition-all duration-500">
              <GiScales className="text-white text-4xl" />
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`
              w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700
              ${!isSuccess && !status.includes('❌') 
                ? 'bg-gradient-to-br from-[#3282B8]/20 to-[#0F4C75]/20 border-4 border-[#3282B8]/30' 
                : isSuccess 
                ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-4 border-green-500/40 scale-110' 
                : 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-4 border-red-500/40 scale-110'
              }
            `}>
              {!isSuccess && !status.includes('❌') ? (
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#3282B8] border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-[#3282B8]/20 border-t-transparent rounded-full animate-spin-slow"></div>
                </div>
              ) : isSuccess ? (
                <FaCheckCircle className="text-green-400 text-5xl animate-bounce" />
              ) : (
                <FaTimesCircle className="text-red-400 text-5xl animate-shake" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className={`
            text-3xl font-bold text-center mb-2 transition-all duration-500
            ${isSuccess ? 'text-green-400' : status.includes('❌') ? 'text-red-400' : 'text-white'}
          `}>
            {status.includes('✅') ? 'Success!' : status.includes('❌') ? 'Error!' : 'Please Wait'}
          </h2>

          {/* Status Message */}
          <p className="text-center text-white/70 text-sm mb-6">{status}</p>

          {/* 3D Progress Bar */}
          {!status.includes('✅') && !status.includes('❌') && (
            <div className="mt-4">
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#BBE1FA] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              <p className="text-center text-white/40 text-xs mt-2">
                {progress < 90 ? 'Authenticating...' : 'Almost there!'}
              </p>
            </div>
          )}

          {/* 3D Floating Badge */}
          {isSuccess && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/30 animate-pulse transform rotate-12">
              ✅ Verified
            </div>
          )}

          {/* 3D Floating Badge - Error */}
          {status.includes('❌') && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse transform -rotate-6">
              ⚠️ Error
            </div>
          )}

          {/* 3D Bottom Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3282B8] to-transparent opacity-50 rounded-b-3xl"></div>
        </div>

        {/* 3D Shadow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/20 blur-2xl rounded-full"></div>
      </div>
    </div>
  );
};

export default AuthCallback;