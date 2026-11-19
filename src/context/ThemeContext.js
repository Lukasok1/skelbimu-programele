import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const colors = {
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

export function ThemeProvider({ children }) {
  const [currency, setCurrency] = useState('EUR');

  const toggleCurrency = () =>
    setCurrency((prev) => (prev === 'EUR' ? 'USD' : 'EUR'));

  const formatPrice = (eurPrice) => {
    if (currency === 'USD') {
      return `${Math.round(eurPrice * 1.1)} $`;
    }
    return `${eurPrice} €`;
  };

  return (
    <ThemeContext.Provider value={{ currency, toggleCurrency, formatPrice, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}