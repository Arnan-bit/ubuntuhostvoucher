'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currencyConverter, CurrencyRates, DEFAULT_RATES } from '@/lib/currency-converter';

interface CurrencyContextType {
  currentCurrency: string;
  setCurrency: (currency: string) => void;
  rates: CurrencyRates;
  formatPrice: (amount: number, currency?: string) => string;
  convertPrice: (amount: number, fromCurrency?: string, toCurrency?: string) => number;
  supportedCurrencies: string[];
  isLoading: boolean;
  lastUpdated: string | null;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: string;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  defaultCurrency = 'USD'
}) => {
  const [currentCurrency, setCurrentCurrency] = useState<string>(defaultCurrency);
  const [rates, setRates] = useState<CurrencyRates>(DEFAULT_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load saved currency preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred_currency');
      if (saved && DEFAULT_RATES[saved]) {
        setCurrentCurrency(saved);
      }
    }
  }, []);

  // Save currency preference
  const setCurrency = (currency: string) => {
    setCurrentCurrency(currency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_currency', currency);
    }
  };

  // Refresh rates
  const refreshRates = async () => {
    setIsLoading(true);
    try {
      await currencyConverter.fetchRates();
      const newRates = currencyConverter.getRates();
      setRates(newRates);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Failed to refresh currency rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize rates
  useEffect(() => {
    const initRates = async () => {
      setIsLoading(true);
      try {
        await currencyConverter.fetchRates();
        const initialRates = currencyConverter.getRates();
        setRates(initialRates);
        
        // Check last update time
        if (typeof window !== 'undefined') {
          const lastUpdate = localStorage.getItem('currency_rates_last_update');
          if (lastUpdate) {
            setLastUpdated(new Date(parseInt(lastUpdate)).toISOString());
          }
        }
      } catch (error) {
        console.warn('Failed to initialize currency rates:', error);
        setRates(DEFAULT_RATES);
      } finally {
        setIsLoading(false);
      }
    };

    initRates();
  }, []);

  // Format price with current currency
  const formatPrice = (amount: number, currency?: string): string => {
    const targetCurrency = currency || currentCurrency;
    return currencyConverter.formatPrice(amount, targetCurrency);
  };

  // Convert price
  const convertPrice = (
    amount: number, 
    fromCurrency: string = 'USD', 
    toCurrency?: string
  ): number => {
    const targetCurrency = toCurrency || currentCurrency;
    return currencyConverter.convert(amount, fromCurrency, targetCurrency);
  };

  const supportedCurrencies = Object.keys(rates);

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    rates,
    formatPrice,
    convertPrice,
    supportedCurrencies,
    isLoading,
    lastUpdated,
    refreshRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Hook for price formatting
export const usePrice = (amount: number, fromCurrency: string = 'USD') => {
  const { formatPrice, convertPrice, currentCurrency } = useCurrency();
  
  const formattedPrice = formatPrice(amount, currentCurrency);
  const convertedAmount = convertPrice(amount, fromCurrency, currentCurrency);
  
  return {
    formatted: formattedPrice,
    amount: convertedAmount,
    currency: currentCurrency
  };
};

export default CurrencyProvider;
