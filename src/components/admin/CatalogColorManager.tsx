'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Eye, Save, RotateCcw, Sparkles } from 'lucide-react';

interface CatalogColorSettings {
  [productId: string]: {
    colorScheme: 'default' | 'red' | 'yellow' | 'green' | 'blue' | 'gold';
    isHighlighted: boolean;
  };
}

interface CatalogColorManagerProps {
  products: any[];
  onSaveColorSettings: (settings: CatalogColorSettings) => void;
  showNotification: (message: string, type?: string) => void;
}

const colorSchemes = {
  default: {
    name: 'Default',
    description: 'Follows theme (dark/light)',
    preview: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    cardClass: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    textClass: 'text-gray-900 dark:text-white',
    accentClass: 'text-blue-600 dark:text-blue-400'
  },
  red: {
    name: 'Marketing Red',
    description: 'Eye-catching red for promotions',
    preview: 'bg-red-50 border-red-200',
    cardClass: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-red-100',
    textClass: 'text-red-900',
    accentClass: 'text-red-600'
  },
  yellow: {
    name: 'Attention Yellow',
    description: 'Bright yellow for special offers',
    preview: 'bg-yellow-50 border-yellow-200',
    cardClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-yellow-100',
    textClass: 'text-yellow-900',
    accentClass: 'text-yellow-600'
  },
  green: {
    name: 'Success Green',
    description: 'Green for best deals',
    preview: 'bg-green-50 border-green-200',
    cardClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-green-100',
    textClass: 'text-green-900',
    accentClass: 'text-green-600'
  },
  blue: {
    name: 'Trust Blue',
    description: 'Professional blue theme',
    preview: 'bg-blue-50 border-blue-200',
    cardClass: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue-100',
    textClass: 'text-blue-900',
    accentClass: 'text-blue-600'
  },
  gold: {
    name: 'Premium Gold',
    description: 'Luxurious gold for premium items',
    preview: 'bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200',
    cardClass: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-amber-100 border-amber-200 shadow-amber-200 shadow-lg',
    textClass: 'text-amber-900',
    accentClass: 'text-amber-600'
  }
};

export const CatalogColorManager: React.FC<CatalogColorManagerProps> = ({
  products,
  onSaveColorSettings,
  showNotification
}) => {
  const [colorSettings, setColorSettings] = useState<CatalogColorSettings>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load existing color settings
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('catalogColorSettings');
        if (stored) {
          const settings = JSON.parse(stored);
          setColorSettings(settings);
        }
      } catch (error) {
        console.error('Error loading color settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleColorChange = (productId: string, colorScheme: string) => {
    const newSettings = {
      ...colorSettings,
      [productId]: {
        ...colorSettings[productId],
        colorScheme: colorScheme as any,
        isHighlighted: colorScheme !== 'default'
      }
    };
    setColorSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('catalogColorSettings', JSON.stringify(colorSettings));
      onSaveColorSettings(colorSettings);
      setHasChanges(false);
      showNotification('Color settings saved successfully!', 'success');
    } catch (error) {
      showNotification('Failed to save color settings', 'error');
    }
  };

  const handleReset = () => {
    setColorSettings({});
    setHasChanges(true);
    showNotification('Color settings reset to default', 'info');
  };

  const getProductColorClass = (productId: string) => {
    const setting = colorSettings[productId];
    if (!setting || setting.colorScheme === 'default') {
      return colorSchemes.default.cardClass;
    }
    return colorSchemes[setting.colorScheme].cardClass;
  };

  const getProductTextClass = (productId: string) => {
    const setting = colorSettings[productId];
    if (!setting || setting.colorScheme === 'default') {
      return colorSchemes.default.textClass;
    }
    return colorSchemes[setting.colorScheme].textClass;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="text-purple-500" />
            Catalog Color Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize catalog item colors for marketing emphasis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Eye size={16} />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={16} />
            Reset All
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Color Scheme Legend */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Available Color Schemes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(colorSchemes).map(([key, scheme]) => (
            <div key={key} className="text-center">
              <div className={`w-full h-16 rounded-lg border-2 ${scheme.preview} mb-2`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {scheme.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {scheme.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Color Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Color Settings ({products.length} items)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {products.map((product) => {
            const currentSetting = colorSettings[product.id] || { colorScheme: 'default', isHighlighted: false };
            
            return (
              <div
                key={product.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  previewMode ? getProductColorClass(product.id) : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${
                      previewMode ? getProductTextClass(product.id) : 'text-gray-900 dark:text-white'
                    }`}>
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {product.id}
                    </p>
                    {currentSetting.isHighlighted && (
                      <div className="flex items-center gap-1 mt-1">
                        <Sparkles size={12} className="text-yellow-500" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          Highlighted
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Scheme
                  </label>
                  <select
                    value={currentSetting.colorScheme}
                    onChange={(e) => handleColorChange(product.id, e.target.value)}
                    className="w-full text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-gray-900 dark:text-white"
                  >
                    {Object.entries(colorSchemes).map(([key, scheme]) => (
                      <option key={key} value={key}>
                        {scheme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Sparkles size={16} />
            <span className="font-medium">You have unsaved changes</span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Don't forget to save your color settings to apply them to the catalog.
          </p>
        </div>
      )}
    </div>
  );
};
