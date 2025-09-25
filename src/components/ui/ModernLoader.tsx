'use client';

import React from 'react';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'gradient';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  text?: string;
  className?: string;
}

export const ModernLoader: React.FC<ModernLoaderProps> = ({
  size = 'md',
  variant = 'gradient',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    accent: 'text-orange-500',
    white: 'text-white'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="animate-[spin_2s_linear_infinite]"
          style={{
            animation: 'spin 2s linear infinite, dash 1.5s ease-in-out infinite'
          }}
        />
      </svg>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 ${colorClasses[color]} bg-current rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} relative`}>
      <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-75" />
      <div className="relative bg-current rounded-full w-full h-full animate-pulse" />
    </div>
  );

  const renderWave = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-2 bg-current ${colorClasses[color]} rounded-full animate-pulse`}
          style={{
            height: `${12 + (i % 2) * 8}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderGradient = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full animate-spin" />
      <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full" />
      <div className="absolute inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-full animate-pulse" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      case 'gradient':
        return renderGradient();
      default:
        return renderGradient();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      {text && (
        <p className={`text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Page Loading Component
export const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <ModernLoader variant="gradient" size="xl" text={text} />
  </div>
);

// Inline Loading Component
export const InlineLoader: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text, 
  size = 'md' 
}) => (
  <div className="flex items-center justify-center py-8">
    <ModernLoader variant="dots" size={size} text={text} />
  </div>
);

// Card Loading Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6" />
    </div>
  </div>
);

// Catalog Loading Grid
export const CatalogLoadingGrid: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default ModernLoader;
