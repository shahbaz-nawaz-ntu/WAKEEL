import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleClear = () => onSearchChange('');

  return (
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4 transition-colors duration-200" />
      <input
        type="text"
        placeholder="Search by client, case, or number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] bg-white shadow-sm text-[#1B262C] placeholder:text-[#9CA3AF] transition-all duration-200"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#0F4C75] transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;