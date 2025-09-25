'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Sparkles, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingPromoData {
  enabled: boolean;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  autoShow: boolean;
  showDelay: number;
  showDuration: number;
}

const defaultPromoData: FloatingPromoData = {
  enabled: true,
  image: '/images/promo-banner.jpg',
  title: '🎉 Special Offer!',
  description: 'Get 50% off on all premium hosting plans',
  buttonText: 'Claim Now',
  buttonUrl: '#deals',
  position: 'bottom-right',
  autoShow: true,
  showDelay: 3000,
  showDuration: 10000
};

export const FloatingPromoImage: React.FC = () => {
  const [promoData, setPromoData] = useState<FloatingPromoData>(defaultPromoData);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Load promo data from localStorage
    const loadPromoData = () => {
      try {
        const stored = localStorage.getItem('floatingPromoData');
        if (stored) {
          const data = JSON.parse(stored);
          setPromoData({ ...defaultPromoData, ...data });
        }
      } catch (error) {
        console.error('Error loading promo data:', error);
      }
    };

    loadPromoData();
  }, []);

  useEffect(() => {
    if (!promoData.enabled || hasBeenShown) return;

    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (promoData.autoShow) {
      showTimer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);

        if (promoData.showDuration > 0) {
          hideTimer = setTimeout(() => {
            setIsVisible(false);
          }, promoData.showDuration);
        }
      }, promoData.showDelay);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [promoData, hasBeenShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClick = () => {
    if (promoData.buttonUrl.startsWith('#')) {
      const element = document.querySelector(promoData.buttonUrl);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(promoData.buttonUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-40'; // Lower z-index than chatbot (z-50)
    
    switch (promoData.position) {
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-20`; // Offset to avoid chatbot
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      default:
        return `${baseClasses} bottom-4 right-20`;
    }
  };

  if (!promoData.enabled || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={getPositionClasses()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">Special Offer</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleMinimize}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <div className="w-3 h-0.5 bg-white rounded" />
              </button>
              <button
                onClick={handleClose}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  {/* Promo Image */}
                  {promoData.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={promoData.image}
                        alt={promoData.title}
                        width={300}
                        height={150}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                    {promoData.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 leading-relaxed">
                    {promoData.description}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={handleClick}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{promoData.buttonText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating animation */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2"
        >
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Admin component for managing floating promo
export const FloatingPromoManager: React.FC<{
  onSave: (data: FloatingPromoData) => void;
  showNotification: (message: string, type?: string) => void;
}> = ({ onSave, showNotification }) => {
  const [promoData, setPromoData] = useState<FloatingPromoData>(defaultPromoData);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('floatingPromoData');
        if (stored) {
          setPromoData({ ...defaultPromoData, ...JSON.parse(stored) });
        }
      } catch (error) {
        console.error('Error loading promo data:', error);
      }
    };
    loadData();
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('floatingPromoData', JSON.stringify(promoData));
      onSave(promoData);
      showNotification('Floating promo settings saved!', 'success');
    } catch (error) {
      showNotification('Failed to save promo settings', 'error');
    }
  };

  const handleInputChange = (field: keyof FloatingPromoData, value: any) => {
    setPromoData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Gift className="text-orange-500" />
          Floating Promo Manager
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Floating Promo
            </label>
            <input
              type="checkbox"
              checked={promoData.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={promoData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={promoData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={promoData.buttonText}
              onChange={(e) => handleInputChange('buttonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Button URL
            </label>
            <input
              type="text"
              value={promoData.buttonUrl}
              onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position
            </label>
            <select
              value={promoData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto Show
            </label>
            <input
              type="checkbox"
              checked={promoData.autoShow}
              onChange={(e) => handleInputChange('autoShow', e.target.checked)}
              className="rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Show Delay (ms)
            </label>
            <input
              type="number"
              value={promoData.showDelay}
              onChange={(e) => handleInputChange('showDelay', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Show Duration (ms, 0 = permanent)
            </label>
            <input
              type="number"
              value={promoData.showDuration}
              onChange={(e) => handleInputChange('showDuration', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={promoData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {previewMode && promoData.enabled && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The floating promo will appear in the {promoData.position.replace('-', ' ')} corner of the page.
          </p>
          <div className="relative">
            <FloatingPromoImage />
          </div>
        </div>
      )}
    </div>
  );
};
