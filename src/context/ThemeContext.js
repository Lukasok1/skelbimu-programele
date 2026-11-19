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

/*
3 eil.: sukuria konteksto objektą per createContext().

18 eil.: laiko dabartinės valiutos būseną ('EUR' arba 'USD') per useState.

20–21 eil. (toggleCurrency): perjungia valiutą iš EUR į USD ir atvirkščiai.

23–28 eil. (formatPrice): konvertuoja kainą į dolerius (padaugina iš 1.1) arba palieka eurais ir prideda valiutos ženklą.

30–34 eil.: per <ThemeContext.Provider> išdalina valiutą, keitimo funkciją ir spalvas visiems vidiniams ekranams.

37–39 eil. (useTheme): pagalbinis hook'as, leidžiantis ekranams patogiai nuskaityti šį kontekstą per useContext.
*/