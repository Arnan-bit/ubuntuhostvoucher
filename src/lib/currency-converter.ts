'use client';

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  lastUpdated: string;
}

export interface CurrencyRates {
  [key: string]: CurrencyRate;
}

// Default currency rates (fallback)
export const DEFAULT_RATES: CurrencyRates = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, lastUpdated: new Date().toISOString() },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, lastUpdated: new Date().toISOString() },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, lastUpdated: new Date().toISOString() },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110, lastUpdated: new Date().toISOString() },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35, lastUpdated: new Date().toISOString() },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25, lastUpdated: new Date().toISOString() },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92, lastUpdated: new Date().toISOString() },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45, lastUpdated: new Date().toISOString() },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5, lastUpdated: new Date().toISOString() },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15000, lastUpdated: new Date().toISOString() },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35, lastUpdated: new Date().toISOString() },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.2, lastUpdated: new Date().toISOString() },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 33, lastUpdated: new Date().toISOString() },
  VND: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 23000, lastUpdated: new Date().toISOString() },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 50, lastUpdated: new Date().toISOString() }
};

class CurrencyConverter {
  private rates: CurrencyRates = DEFAULT_RATES;
  private baseCurrency = 'USD';
  private lastFetch = 0;
  private fetchInterval = 3600000; // 1 hour

  constructor() {
    this.loadRatesFromStorage();
  }

  private loadRatesFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('currency_rates');
        if (stored) {
          const parsedRates = JSON.parse(stored);
          this.rates = { ...DEFAULT_RATES, ...parsedRates };
        }
      } catch (error) {
        console.warn('Failed to load currency rates from storage:', error);
      }
    }
  }

  private saveRatesToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('currency_rates', JSON.stringify(this.rates));
        localStorage.setItem('currency_rates_last_update', Date.now().toString());
      } catch (error) {
        console.warn('Failed to save currency rates to storage:', error);
      }
    }
  }

  async fetchRates(): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetch < this.fetchInterval) {
      return; // Don't fetch too frequently
    }

    try {
      // Using a free API service (exchangerate-api.com)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      
      // Update rates with fetched data
      Object.keys(this.rates).forEach(code => {
        if (data.rates[code]) {
          this.rates[code] = {
            ...this.rates[code],
            rate: data.rates[code],
            lastUpdated: new Date().toISOString()
          };
        }
      });

      this.lastFetch = now;
      this.saveRatesToStorage();
    } catch (error) {
      console.warn('Failed to fetch currency rates, using cached/default rates:', error);
    }
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.rates[fromCurrency]?.rate || 1;
    const toRate = this.rates[toCurrency]?.rate || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }

  formatPrice(amount: number, currency: string): string {
    const rate = this.rates[currency];
    if (!rate) return `$${amount.toFixed(2)}`;

    const convertedAmount = this.convert(amount, 'USD', currency);
    
    // Format based on currency
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' || currency === 'IDR' || currency === 'VND' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' || currency === 'IDR' || currency === 'VND' ? 0 : 2
    });

    try {
      return formatter.format(convertedAmount);
    } catch (error) {
      // Fallback formatting
      return `${rate.symbol}${convertedAmount.toLocaleString()}`;
    }
  }

  getRates(): CurrencyRates {
    return this.rates;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.rates);
  }

  getCurrencyInfo(code: string): CurrencyRate | null {
    return this.rates[code] || null;
  }

  // Convert IDR prices to USD (for migration)
  convertIDRToUSD(idrAmount: number): number {
    return this.convert(idrAmount, 'IDR', 'USD');
  }

  // Get exchange rate between two currencies
  getExchangeRate(from: string, to: string): number {
    if (from === to) return 1;
    const fromRate = this.rates[from]?.rate || 1;
    const toRate = this.rates[to]?.rate || 1;
    return toRate / fromRate;
  }
}

// Singleton instance
export const currencyConverter = new CurrencyConverter();

// Utility functions
export const formatPrice = (amount: number, currency: string = 'USD'): string => {
  return currencyConverter.formatPrice(amount, currency);
};

export const convertCurrency = (amount: number, from: string, to: string): number => {
  return currencyConverter.convert(amount, from, to);
};

export const getSupportedCurrencies = (): string[] => {
  return currencyConverter.getSupportedCurrencies();
};

export const getCurrencyInfo = (code: string): CurrencyRate | null => {
  return currencyConverter.getCurrencyInfo(code);
};

// Initialize rates on import
if (typeof window !== 'undefined') {
  currencyConverter.fetchRates().catch(console.warn);
}
