'use client';

import React, { useState } from 'react';
import { CreditCard, Bitcoin, DollarSign, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentSystemProps {
  amount: number;
  currency?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  className = ''
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Pay securely with PayPal',
      enabled: true
    },
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Pay with Tether USDT',
      enabled: true
    },
    {
      id: 'usdc',
      name: 'USDC',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Pay with USD Coin',
      enabled: true
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Pay with Bitcoin',
      enabled: true
    },
    {
      id: 'doge',
      name: 'Dogecoin',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Pay with Dogecoin',
      enabled: true
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setErrorMessage('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock transaction ID
      const mockTransactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setTransactionId(mockTransactionId);
      setPaymentStatus('success');
      
      if (onSuccess) {
        onSuccess(mockTransactionId);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (paymentStatus === 'success') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your payment has been processed successfully.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {transactionId}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Complete Your Payment
        </h3>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatAmount(amount)}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Payment Method
        </h4>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.enabled && setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedMethod === method.id
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Secure payment processing</span>
        </div>
        
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Pay {formatAmount(amount)}</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
        All payments are processed securely and encrypted.
      </div>
    </div>
  );
};

export default PaymentSystem;
