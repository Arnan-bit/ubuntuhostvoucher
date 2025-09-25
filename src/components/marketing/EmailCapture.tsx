'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Gift, Star, Zap } from 'lucide-react';

interface EmailCaptureProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  incentive?: string;
  onSubmit?: (email: string, phone?: string) => void;
  className?: string;
  variant?: 'default' | 'popup' | 'inline' | 'sidebar';
  showPhone?: boolean;
  showIncentive?: boolean;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({
  title = "Get Exclusive Deals & Updates",
  subtitle = "Join thousands of smart shoppers and never miss a great deal!",
  placeholder = "Enter your email address",
  buttonText = "Get Free Access",
  incentive = "🎁 Get 20% off your first purchase + exclusive deals",
  onSubmit,
  className = '',
  variant = 'default',
  showPhone = false,
  showIncentive = true
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for demo
      const existingEmails = JSON.parse(localStorage.getItem('captured_emails') || '[]');
      const newEntry = {
        email,
        phone: phone || null,
        timestamp: new Date().toISOString(),
        source: 'email_capture'
      };
      
      existingEmails.push(newEntry);
      localStorage.setItem('captured_emails', JSON.stringify(existingEmails));
      
      if (onSubmit) {
        onSubmit(email, phone);
      }
      
      setStatus('success');
      setMessage('Success! Check your email for exclusive deals.');
      
      // Reset form after success
      setTimeout(() => {
        setEmail('');
        setPhone('');
        setStatus('idle');
        setMessage('');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Success state
  if (status === 'success') {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Welcome to the VIP Club! 🎉
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          {message}
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Gift className="w-4 h-4" />
            <span>Your exclusive deals are on the way!</span>
          </div>
        </div>
      </div>
    );
  }

  // Popup variant
  if (variant === 'popup') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md mx-auto ${className}`}>
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {showIncentive && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <Star className="w-5 h-5" />
              <span className="font-medium text-sm">{incentive}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {showPhone && (
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : buttonText}
            </button>
          </form>
        </div>
        
        {status === 'error' && (
          <div className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      {showIncentive && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Gift className="w-5 h-5" />
            <span className="font-medium text-sm">{incentive}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />

        {showPhone && (
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number (optional)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default EmailCapture;
