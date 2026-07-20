import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder = 'Search cases...', className = '' }) => {
  return (
    <div className={`relative flex-1 max-w-xs w-full ${className}`}>
      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm transition-all duration-200 group-focus-within:text-[#D4AF37]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#9DB2BF] rounded-xl text-[#27374D] placeholder:text-[#9CA3AF] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none focus:shadow-gold transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;