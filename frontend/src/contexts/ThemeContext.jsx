// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { THEMES } from '../themes/themeConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    if (!theme) return;

    const root = document.documentElement;
    const colors = theme.colors;
    
    // Apply all theme colors as CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Set individual color variables
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-surface', colors.surface);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-success', colors.success);
    root.style.setProperty('--theme-warning', colors.warning);
    root.style.setProperty('--theme-error', colors.error);
    
    // Gradient colors
    root.style.setProperty('--theme-gradient-start', colors.text);
    root.style.setProperty('--theme-gradient-middle', colors.primary);
    root.style.setProperty('--theme-gradient-end', colors.secondary);
    
    // Header colors (keep dark for visibility)
    root.style.setProperty('--theme-header-bg', '#1B262C');
    root.style.setProperty('--theme-header-text', '#FFFFFF');

    // Also apply to body directly for immediate effect
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;

    // Save to localStorage
    localStorage.setItem('theme', themeName);
    
    // Save to backend
    saveThemeToBackend(themeName);

    // Force a repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  };

  const saveThemeToBackend = async (themeName) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) return;

      await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/users/theme', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: themeName }),
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      applyTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    changeTheme,
    allThemes: Object.keys(THEMES).map(key => ({
      key,
      name: THEMES[key].name,
      colors: THEMES[key].colors,
    })),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};