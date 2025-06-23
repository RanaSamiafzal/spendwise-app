'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'INR' | 'NZD' | 'RUB' | 'BRL' | 'ZAR' | 'AED' | 'HKD' | 'MXN' | 'SGD' | 'KRW';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('spendwise-currency') as Currency | null;
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
    } catch (error) {
      console.warn('Could not read currency from localStorage', error);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('spendwise-currency', newCurrency);
    } catch (error) {
       console.warn('Could not save currency to localStorage', error);
    }
  };
  
  const formatCurrency = (amount: number) => {
    let locale = 'en-US';
    if (currency === 'EUR') locale = 'de-DE';
    if (currency === 'GBP') locale = 'en-GB';
    if (currency === 'JPY') locale = 'ja-JP';
    if (currency === 'AUD') locale = 'en-AU';
    if (currency === 'CAD') locale = 'en-CA';
    if (currency === 'CHF') locale = 'de-CH';
    if (currency === 'CNY') locale = 'zh-CN';
    if (currency === 'INR') locale = 'en-IN';
    if (currency === 'NZD') locale = 'en-NZ';
    if (currency === 'RUB') locale = 'ru-RU';
    if (currency === 'BRL') locale = 'pt-BR';
    if (currency === 'ZAR') locale = 'en-ZA';
    if (currency === 'AED') locale = 'ar-AE';
    if (currency === 'HKD') locale = 'zh-HK';
    if (currency === 'MXN') locale = 'es-MX';
    if (currency === 'SGD') locale = 'en-SG';
    if (currency === 'KRW') locale = 'ko-KR';
    
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
