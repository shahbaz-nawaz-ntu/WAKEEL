// src/components/common/ThemeToggle.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaPalette, 
  FaCheck, 
  FaSun, 
  FaMoon, 
  FaLeaf, 
  FaWater, 
  FaFire, 
  FaGem, 
  FaFlask,
  FaStar,
  FaCloudSun,
  FaSnowflake,
  FaCrown
} from 'react-icons/fa';

const ThemeToggle = () => {
  const { currentTheme, changeTheme, allThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeIcon = (themeKey) => {
    const icons = {
      default: <FaSun className="text-yellow-500" />,
      dark: <FaMoon className="text-indigo-300" />,
      ocean: <FaWater className="text-blue-400" />,
      forest: <FaLeaf className="text-green-500" />,
      sunset: <FaFire className="text-orange-400" />,
      purple: <FaGem className="text-purple-400" />,
      cherry: <FaFlask className="text-pink-400" />,
    };
    return icons[themeKey] || <FaStar className="text-gray-400" />;
  };

  const getThemeColor = (themeKey) => {
    const colors = {
      default: 'bg-[#0F4C75]',
      dark: 'bg-indigo-600',
      ocean: 'bg-blue-600',
      forest: 'bg-green-600',
      sunset: 'bg-orange-500',
      purple: 'bg-purple-600',
      cherry: 'bg-pink-500',
    };
    return colors[themeKey] || 'bg-gray-600';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#BBE1FA]/60 hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        <FaPalette className="text-lg" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0F4C75] rounded-full border border-white"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#BBE1FA] overflow-hidden z-50">
            <div className="p-4 border-b border-[#BBE1FA] bg-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <FaPalette className="text-[#0F4C75] text-lg" />
                <span className="text-sm font-semibold text-[#1B262C]">Theme Selector</span>
                <span className="ml-auto text-[10px] text-[#6B7280] bg-white px-2 py-0.5 rounded-full border border-[#BBE1FA]">
                  {currentTheme}
                </span>
              </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {allThemes.map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => {
                      changeTheme(theme.key);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border-2 ${
                      currentTheme === theme.key
                        ? 'border-[#0F4C75] bg-[#0F4C75]/10 shadow-md'
                        : 'border-transparent hover:border-[#BBE1FA] bg-[#F0F4F8] hover:bg-[#BBE1FA]/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getThemeColor(theme.key)} text-white text-sm flex-shrink-0`}>
                      {getThemeIcon(theme.key)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-[#1B262C] truncate">{theme.name}</div>
                      <div className="flex gap-1 mt-0.5">
                        {Object.values(theme.colors).slice(0, 4).map((color, idx) => (
                          <div 
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    {currentTheme === theme.key && (
                      <FaCheck className="text-[#0F4C75] text-sm flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-[#BBE1FA] bg-[#F0F4F8] text-center">
              <p className="text-[10px] text-[#6B7280]">
                Theme saved to your profile • <span className="text-[#0F4C75]">{allThemes.length}</span> themes available
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;