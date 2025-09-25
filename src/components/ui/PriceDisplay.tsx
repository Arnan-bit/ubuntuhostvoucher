'use client';

import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  showDiscount?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = 'USD',
  showCurrency = true,
  size = 'md',
  variant = 'default',
  className = '',
  showDiscount = true
}) => {
  const { formatPrice, convertPrice, currentCurrency } = useCurrency();

  // Convert prices to current currency
  const convertedPrice = convertPrice(price, currency, currentCurrency);
  const convertedOriginalPrice = originalPrice ? convertPrice(originalPrice, currency, currentCurrency) : undefined;

  // Format prices
  const formattedPrice = formatPrice(price, currentCurrency);
  const formattedOriginalPrice = convertedOriginalPrice ? formatPrice(originalPrice!, currentCurrency) : undefined;

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Size classes
  const sizeClasses = {
    sm: {
      price: 'text-sm font-semibold',
      original: 'text-xs',
      discount: 'text-xs px-1.5 py-0.5'
    },
    md: {
      price: 'text-lg font-bold',
      original: 'text-sm',
      discount: 'text-xs px-2 py-1'
    },
    lg: {
      price: 'text-xl font-bold',
      original: 'text-base',
      discount: 'text-sm px-2 py-1'
    },
    xl: {
      price: 'text-2xl font-bold',
      original: 'text-lg',
      discount: 'text-base px-3 py-1'
    }
  };

  const currentSizeClasses = sizeClasses[size];

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className={`${currentSizeClasses.price} text-gray-900 dark:text-white`}>
          {formattedPrice}
        </span>
        {formattedOriginalPrice && showDiscount && (
          <span className={`${currentSizeClasses.original} text-gray-500 line-through`}>
            {formattedOriginalPrice}
          </span>
        )}
      </div>
    );
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-center space-x-3">
          <span className={`${currentSizeClasses.price} text-gray-900 dark:text-white`}>
            {formattedPrice}
          </span>
          {discountPercentage > 0 && showDiscount && (
            <span className={`${currentSizeClasses.discount} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full font-medium`}>
              -{discountPercentage}%
            </span>
          )}
        </div>
        {formattedOriginalPrice && showDiscount && (
          <div className="flex items-center space-x-2">
            <span className={`${currentSizeClasses.original} text-gray-500 line-through`}>
              Original: {formattedOriginalPrice}
            </span>
            <span className={`${currentSizeClasses.original} text-green-600 dark:text-green-400 font-medium`}>
              Save {formatPrice(originalPrice! - price, currentCurrency)}
            </span>
          </div>
        )}
        {!showCurrency && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Prices in {currentCurrency}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-baseline space-x-2">
        <span className={`${currentSizeClasses.price} text-gray-900 dark:text-white`}>
          {formattedPrice}
        </span>
        {formattedOriginalPrice && showDiscount && (
          <span className={`${currentSizeClasses.original} text-gray-500 line-through`}>
            {formattedOriginalPrice}
          </span>
        )}
      </div>
      {discountPercentage > 0 && showDiscount && (
        <span className={`${currentSizeClasses.discount} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full font-medium`}>
          -{discountPercentage}%
        </span>
      )}
    </div>
  );
};

// Specialized components
export const ProductPrice: React.FC<{
  price: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}> = ({ price, originalPrice, currency = 'USD', className = '' }) => (
  <PriceDisplay
    price={price}
    originalPrice={originalPrice}
    currency={currency}
    size="lg"
    variant="detailed"
    className={className}
  />
);

export const CompactPrice: React.FC<{
  price: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}> = ({ price, originalPrice, currency = 'USD', className = '' }) => (
  <PriceDisplay
    price={price}
    originalPrice={originalPrice}
    currency={currency}
    size="sm"
    variant="compact"
    className={className}
  />
);

export const HeroPrice: React.FC<{
  price: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}> = ({ price, originalPrice, currency = 'USD', className = '' }) => (
  <PriceDisplay
    price={price}
    originalPrice={originalPrice}
    currency={currency}
    size="xl"
    variant="detailed"
    className={className}
  />
);

export default PriceDisplay;
