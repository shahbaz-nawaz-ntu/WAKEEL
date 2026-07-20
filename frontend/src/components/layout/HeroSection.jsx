import React, { useState, useEffect } from 'react';
import { GiScales } from 'react-icons/gi';
import { FaSearch, FaGavel, FaUsers, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

const HeroSection = ({ stats, onSearch }) => {
  const [showContent, setShowContent] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fullText = 'Welcome to JurisFlow';
  const subtitleText = 'Streamline your legal practice with our comprehensive case management system.';

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setTypewriterComplete(true);
      setTimeout(() => setShowSubtitle(true), 400);
    }
  }, [currentIndex]);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const quickSearchTags = [
    { label: 'Active Cases', query: 'active' },
    { label: 'Pending', query: 'pending' },
    { label: 'Closed', query: 'closed' },
    { label: 'All Cases', query: '' },
  ];

  return (
    <div className="relative w-full h-[500px] sm:h-[560px] overflow-hidden">
      
      {/* ===== BACKGROUND IMAGE - FULLY VISIBLE ===== */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/court-bg.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Only bottom fade for text readability - NO COLOR OVERLAYS */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* ===== CONTENT - FULLY VISIBLE ===== */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center z-10">
        
        {/* Icon with dark backdrop */}
        <div 
          className={`mb-4 transition-all duration-1000 transform ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-block p-4 bg-black/50 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl shadow-black/30 hover:shadow-black/50 transition-all duration-500 hover:scale-110">
            <GiScales className="text-[#3282B8] text-5xl sm:text-6xl" />
          </div>
        </div>

        {/* Main Heading - White with strong shadow */}
        <div className="mb-3 min-h-[70px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3282B8] via-white to-[#BBE1FA] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {displayText}
            </span>
            {!typewriterComplete && (
              <span className="animate-pulse text-[#3282B8] ml-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">|</span>
            )}
          </h1>
        </div>

        {/* Subtitle - White with strong shadow */}
        <div 
          className={`transition-all duration-1000 transform ${
            showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mb-6 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
            {subtitleText}
          </p>
        </div>

        {/* Stats Bar - Dark glass cards */}
        <div 
          className={`w-full max-w-4xl mb-4 transition-all duration-1000 delay-300 transform ${
            showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 hover:border-[#3282B8]/50 transition-all duration-300 hover:bg-black/70 hover:scale-105 shadow-lg shadow-black/20">
              <FaGavel className="text-[#3282B8] text-sm" />
              <span className="text-xs text-white/80">Active</span>
              <span className="text-sm font-bold text-white">{stats?.active || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 hover:border-[#3282B8]/50 transition-all duration-300 hover:bg-black/70 hover:scale-105 shadow-lg shadow-black/20">
              <FaFileAlt className="text-[#3282B8] text-sm" />
              <span className="text-xs text-white/80">Total</span>
              <span className="text-sm font-bold text-white">{stats?.total || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 hover:border-[#3282B8]/50 transition-all duration-300 hover:bg-black/70 hover:scale-105 shadow-lg shadow-black/20">
              <FaUsers className="text-[#3282B8] text-sm" />
              <span className="text-xs text-white/80">Clients</span>
              <span className="text-sm font-bold text-white">{stats?.clients || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 hover:border-[#3282B8]/50 transition-all duration-300 hover:bg-black/70 hover:scale-105 shadow-lg shadow-black/20">
              <FaCheckCircle className="text-[#3282B8] text-sm" />
              <span className="text-xs text-white/80">Closed</span>
              <span className="text-sm font-bold text-white">{stats?.closed || 0}</span>
            </div>
          </div>
        </div>

        {/* Search Bar - Dark glass */}
        <div 
          className={`w-full max-w-3xl transition-all duration-1000 transform ${
            showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/30 hover:shadow-black/50 transition-all duration-300 focus-within:border-[#3282B8] focus-within:shadow-[#3282B8]/20">
              <FaSearch className="absolute left-5 text-[#3282B8] text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, clients, or documents..."
                className="w-full pl-14 pr-36 py-4 bg-transparent rounded-2xl text-white placeholder:text-white/60 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/30 transition-all duration-300 hover:scale-105"
              >
                <FaSearch className="inline mr-2 text-xs" />
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Tags - Dark glass */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-white/70 text-xs font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Quick:</span>
            {quickSearchTags.map((tag, index) => (
              <button 
                key={index}
                onClick={() => {
                  setSearchQuery(tag.query);
                  if (onSearch) onSearch(tag.query);
                }}
                className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${
                  searchQuery === tag.query
                    ? 'bg-[#3282B8]/40 text-white border-[#3282B8]/60 shadow-lg shadow-black/30'
                    : 'bg-black/40 hover:bg-black/60 text-white/90 border-white/20 hover:border-[#3282B8]/50 hover:text-white'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;