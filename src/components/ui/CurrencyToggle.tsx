'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RefreshCw, Globe, DollarSign } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'icon-only';
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  className = '',
  showLabel = true,
  variant = 'default'
}) => {
  const {
    currentCurrency,
    setCurrency,
    rates,
    supportedCurrencies,
    isLoading,
    lastUpdated,
    refreshRates
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await refreshRates();
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentRate = rates[currentCurrency];
  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={`Current: ${currentRate?.symbol} ${currentRate?.name}`}
        >
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Currency
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Refresh rates"
                >
                  <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Updated: {formatLastUpdated(lastUpdated)}
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {supportedCurrencies.map((code) => {
                const rate = rates[code];
                return (
                  <button
                    key={code}
                    onClick={() => handleCurrencyChange(code)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      currentCurrency === code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {rate.symbol} {code}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {rate.name}
                        </p>
                      </div>
                      {currentCurrency === code && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentRate?.symbol} {currentCurrency}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="max-h-64 overflow-y-auto">
              {supportedCurrencies.map((code) => {
                const rate = rates[code];
                return (
                  <button
                    key={code}
                    onClick={() => handleCurrencyChange(code)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      currentCurrency === code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {rate.symbol} {code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div className="flex items-center space-x-2">
          {showLabel && (
            <span className="text-sm text-gray-600 dark:text-gray-400">Currency:</span>
          )}
          <span className="font-medium text-gray-900 dark:text-white">
            {currentRate?.symbol} {currentCurrency}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Currency
              </h3>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh exchange rates"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {supportedCurrencies.map((code) => {
              const rate = rates[code];
              return (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    currentCurrency === code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {rate.symbol} {code}
                        </span>
                        {currentCurrency === code && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {rate.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        1 USD = {rate.rate.toLocaleString()} {code}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;
