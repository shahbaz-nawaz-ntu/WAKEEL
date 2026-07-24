// src/components/layout/Footer.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaTwitter, FaLinkedin, FaGithub, FaHeart, FaArrowUp,
  FaFacebook, FaInstagram, FaYoutube,
  FaHome, FaGavel, FaUsers, FaCalendarAlt, FaChartBar,
  FaBook, FaHeadset, FaCode, FaServer,
  FaShieldAlt, FaCookie, FaFileContract as FaTerms,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const Footer = ({ stats = {}, onNavigate, activePage }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handler
  const handleNavigation = (path) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Support link handler
  const handleSupportClick = (label) => {
    showNotification(`Opening ${label}...`, 'info');
  };

  // Legal link handler
  const handleLegalClick = (label) => {
    showNotification(`Opening ${label}...`, 'info');
  };

  // Contact handler
  const handleContactClick = (type, value) => {
    if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${value.replace(/\s/g, '')}`;
    }
  };

  // Social media handler
  const handleSocialClick = (url, label) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Newsletter subscription - FIXED
  const handleSubscribe = async (e) => {
    e.preventDefault(); // Prevent form refresh
    
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address (e.g., name@domain.com)', 'error');
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make your actual API call
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      setIsSubscribed(true);
      showNotification('🎉 Successfully subscribed to our newsletter!', 'success');
      setEmail('');
      
      // Reset subscribed state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      showNotification('Failed to subscribe. Please try again.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Navigation sections
  const navSections = {
    platform: [
      { label: 'Dashboard', path: 'dashboard', icon: FaHome },
      { label: 'Cases', path: 'cases', icon: FaGavel },
      { label: 'Clients', path: 'clients', icon: FaUsers },
      { label: 'Calendar', path: 'calendar', icon: FaCalendarAlt },
      { label: 'Analytics', path: 'reports', icon: FaChartBar },
    ],
    support: [
      { label: 'Help Center', icon: FaHeadset, action: () => handleSupportClick('Help Center') },
      { label: 'Documentation', icon: FaBook, action: () => handleSupportClick('Documentation') },
      { label: 'API Reference', icon: FaCode, action: () => handleSupportClick('API Reference') },
      { label: 'System Status', icon: FaServer, action: () => handleSupportClick('System Status') },
    ],
    legal: [
      { label: 'Privacy Policy', icon: FaShieldAlt, action: () => handleLegalClick('Privacy Policy') },
      { label: 'Terms of Service', icon: FaTerms, action: () => handleLegalClick('Terms of Service') },
      { label: 'Cookie Policy', icon: FaCookie, action: () => handleLegalClick('Cookie Policy') },
    ],
    contact: [
      { label: 'support@jurisflow.com', icon: FaEnvelope, type: 'email', action: () => handleContactClick('email', 'support@jurisflow.com') },
      { label: '+1 (555) 123-4567', icon: FaPhone, type: 'phone', action: () => handleContactClick('phone', '+1 (555) 123-4567') },
      { label: '123 Legal Ave, Suite 100', icon: FaMapMarkerAlt, type: 'address' },
    ]
  };

  const socialLinks = [
    { icon: FaTwitter, label: 'Twitter', url: 'https://twitter.com' },
    { icon: FaFacebook, label: 'Facebook', url: 'https://facebook.com' },
    { icon: FaLinkedin, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: FaInstagram, label: 'Instagram', url: 'https://instagram.com' },
    { icon: FaYoutube, label: 'YouTube', url: 'https://youtube.com' },
    { icon: FaGithub, label: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-[#F8FAFC] border-t border-[#BBE1FA] mt-8 relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 animate-slide-in max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-[#3282B8] text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Grid - 5 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div 
              className="flex items-center gap-3 mb-3 cursor-pointer"
              onClick={() => handleNavigation('dashboard')}
            >
              <div className="gradient-accent p-2 rounded-xl shadow-lg shadow-[#0F4C75]/25 hover:scale-105 transition-transform duration-300">
                <GiScales className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1B262C]">
                  Juris<span className="text-[#3282B8]">Flow</span>
                </h2>
                <p className="text-[10px] text-[#3282B8] font-semibold tracking-wider uppercase">
                  Legal Case Management
                </p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
              Empowering legal professionals with cutting-edge case management solutions.
            </p>
            
            {/* Newsletter Signup - FIXED */}
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-[#1B262C] mb-2">
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-[#BBE1FA] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200"
                  disabled={isSubscribing || isSubscribed}
                />
                <button
                  type="submit"
                  disabled={isSubscribing || isSubscribed || !email}
                  className="px-4 py-1.5 gradient-accent text-white text-sm rounded-r-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 min-w-[80px] justify-center"
                >
                  {isSubscribing ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Sending</span>
                    </>
                  ) : isSubscribed ? (
                    '✓ Done'
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-green-600 mt-1">✓ You're subscribed! Check your email.</p>
              )}
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#1B262C] uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2">
              {navSections.platform.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className={`text-sm transition-all duration-200 flex items-center gap-2 hover:text-[#3282B8] hover:translate-x-1 group ${
                      activePage === link.path ? 'text-[#3282B8] font-medium' : 'text-[#6B7280]'
                    }`}
                  >
                    <link.icon className={`text-xs transition-all duration-200 ${
                      activePage === link.path ? 'text-[#3282B8]' : 'opacity-60 group-hover:opacity-100'
                    }`} />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#1B262C] uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              {navSections.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-sm text-[#6B7280] hover:text-[#3282B8] transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group"
                  >
                    <link.icon className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#1B262C] uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {navSections.legal.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-sm text-[#6B7280] hover:text-[#3282B8] transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group"
                  >
                    <link.icon className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#1B262C] uppercase tracking-wider mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              {navSections.contact.map((item, index) => (
                <li key={index}>
                  {item.type === 'address' ? (
                    <div className="text-sm text-[#6B7280] flex items-center gap-2 group cursor-default">
                      <item.icon className="text-xs opacity-60 group-hover:opacity-100 transition-opacity text-[#3282B8]" />
                      <span className="break-all">{item.label}</span>
                    </div>
                  ) : (
                    <button
                      onClick={item.action}
                      className="text-sm text-[#6B7280] hover:text-[#3282B8] transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group w-full text-left"
                    >
                      <item.icon className="text-xs opacity-60 group-hover:opacity-100 transition-opacity text-[#3282B8]" />
                      <span className="break-all">{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#BBE1FA]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Icons - Left */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => handleSocialClick(social.url, social.label)}
                className="p-2 text-[#9CA3AF] hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
                aria-label={social.label}
                title={`Follow us on ${social.label}`}
              >
                <social.icon className="text-base" />
              </button>
            ))}
          </div>

          {/* Copyright - Center */}
          <div className="flex flex-col items-center gap-1 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span>© {currentYear} JurisFlow. All rights reserved.</span>
              <span className="text-[#BBE1FA] hidden sm:inline">|</span>
              <span className="flex items-center gap-0.5">
                Made with <FaHeart className="text-[#EF4444] text-xs animate-pulse" /> by JurisFlow Team
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF] flex-wrap justify-center">
              <button 
                onClick={() => handleLegalClick('Privacy Policy')}
                className="hover:text-[#3282B8] transition-colors"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => handleLegalClick('Terms of Service')}
                className="hover:text-[#3282B8] transition-colors"
              >
                Terms
              </button>
              <span>•</span>
              <button 
                onClick={() => handleLegalClick('Cookie Policy')}
                className="hover:text-[#3282B8] transition-colors"
              >
                Cookies
              </button>
              <span>•</span>
              <span className="text-[#BBE1FA]">v2.0.1</span>
            </div>
          </div>

          {/* Back to Top - Right */}
          <button
            onClick={scrollToTop}
            className={`p-2 gradient-accent text-white rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-[#0F4C75]/30 ${
              showBackToTop ? 'opacity-100' : 'opacity-40 hover:opacity-80'
            }`}
            title="Back to top"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-xs" />
          </button>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;