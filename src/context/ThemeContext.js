import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightColors = {
  background: '#F4F6F9',
  card: '#FFFFFF',
  text: '#1A202C',
  subtext: '#4A5568',
  border: '#E2E8F0',
  primary: '#2563EB',
  danger: '#DC2626',
  success: '#16A34A',
  chipBg: '#E2E8F0',
};

const darkColors = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  subtext: '#94A3B8',
  border: '#334155',
  primary: '#3B82F6',
  danger: '#EF4444',
  success: '#22C55E',
  chipBg: '#334155',
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}