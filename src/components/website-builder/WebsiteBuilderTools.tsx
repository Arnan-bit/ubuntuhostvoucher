'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Palette, 
    Type, 
    Image as ImageIcon, 
    Layout, 
    Settings, 
    Eye, 
    Download, 
    Save,
    Undo,
    Redo,
    Copy,
    Trash2,
    Plus,
    Grid,
    Smartphone,
    Monitor,
    Tablet
} from 'lucide-react';

interface WebsiteBuilderToolsProps {
    selectedTemplate: any;
    onTemplateUpdate: (template: any) => void;
    onPreview: () => void;
    onSave: () => void;
    onDownload: () => void;
}

export const WebsiteBuilderTools: React.FC<WebsiteBuilderToolsProps> = ({
    selectedTemplate,
    onTemplateUpdate,
    onPreview,
    onSave,
    onDownload
}) => {
    const [activeTab, setActiveTab] = useState('design');
    const [viewMode, setViewMode] = useState('desktop');
    const [history, setHistory] = useState<any[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const tabs = [
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'layout', label: 'Layout', icon: Layout },
        { id: 'content', label: 'Content', icon: Type },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const viewModes = [
        { id: 'desktop', label: 'Desktop', icon: Monitor },
        { id: 'tablet', label: 'Tablet', icon: Tablet },
        { id: 'mobile', label: 'Mobile', icon: Smartphone }
    ];

    const saveToHistory = (template: any) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(template)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            onTemplateUpdate(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            onTemplateUpdate(history[historyIndex + 1]);
        }
    };

    const updateTemplate = (updates: any) => {
        const updatedTemplate = { ...selectedTemplate, ...updates };
        onTemplateUpdate(updatedTemplate);
        saveToHistory(updatedTemplate);
    };

    const DesignPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
                <div className="grid grid-cols-4 gap-3">
                    {['blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'teal'].map(color => (
                        <button
                            key={color}
                            onClick={() => updateTemplate({ primaryColor: color })}
                            className={`w-12 h-12 rounded-lg bg-${color}-500 hover:scale-110 transition-transform ${
                                selectedTemplate?.primaryColor === color ? 'ring-2 ring-gray-400' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Typography</h3>
                <div className="space-y-3">
                    <select 
                        value={selectedTemplate?.fontFamily || 'Inter'}
                        onChange={(e) => updateTemplate({ fontFamily: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                    </select>
                    
                    <div className="flex gap-2">
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={selectedTemplate?.fontSize || 16}
                            onChange={(e) => updateTemplate({ fontSize: parseInt(e.target.value) })}
                            className="flex-1"
                        />
                        <span className="text-sm text-gray-600">{selectedTemplate?.fontSize || 16}px</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Background</h3>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateTemplate({ backgroundType: 'color' })}
                            className={`px-4 py-2 rounded-lg ${
                                selectedTemplate?.backgroundType === 'color' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Color
                        </button>
                        <button
                            onClick={() => updateTemplate({ backgroundType: 'gradient' })}
                            className={`px-4 py-2 rounded-lg ${
                                selectedTemplate?.backgroundType === 'gradient' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Gradient
                        </button>
                        <button
                            onClick={() => updateTemplate({ backgroundType: 'image' })}
                            className={`px-4 py-2 rounded-lg ${
                                selectedTemplate?.backgroundType === 'image' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Page Layout</h3>
                <div className="grid grid-cols-2 gap-3">
                    {['single-column', 'two-column', 'three-column', 'sidebar'].map(layout => (
                        <button
                            key={layout}
                            onClick={() => updateTemplate({ layout })}
                            className={`p-4 border-2 rounded-lg hover:border-blue-500 transition-colors ${
                                selectedTemplate?.layout === layout 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="text-sm font-medium capitalize">
                                {layout.replace('-', ' ')}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Sections</h3>
                <div className="space-y-2">
                    {['header', 'hero', 'about', 'services', 'portfolio', 'contact', 'footer'].map(section => (
                        <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="capitalize font-medium">{section}</span>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-200 rounded">
                                    <Copy size={16} />
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                        <Plus size={20} className="mx-auto" />
                        <span className="block text-sm mt-1">Add Section</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const ContentPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Site Information</h3>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Site Title"
                        value={selectedTemplate?.title || ''}
                        onChange={(e) => updateTemplate({ title: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <textarea
                        placeholder="Site Description"
                        value={selectedTemplate?.description || ''}
                        onChange={(e) => updateTemplate({ description: e.target.value })}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Navigation Menu</h3>
                <div className="space-y-2">
                    {(selectedTemplate?.menuItems || ['Home', 'About', 'Services', 'Contact']).map((item: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                    const newMenuItems = [...(selectedTemplate?.menuItems || [])];
                                    newMenuItems[index] = e.target.value;
                                    updateTemplate({ menuItems: newMenuItems });
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded"
                            />
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button 
                        onClick={() => {
                            const newMenuItems = [...(selectedTemplate?.menuItems || []), 'New Item'];
                            updateTemplate({ menuItems: newMenuItems });
                        }}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500"
                    >
                        <Plus size={16} className="inline mr-2" />
                        Add Menu Item
                    </button>
                </div>
            </div>
        </div>
    );

    const MediaPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Upload your logo</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Choose File
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Images</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <ImageIcon size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-xs text-gray-600">Image {i}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const SettingsPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Meta Title"
                        value={selectedTemplate?.metaTitle || ''}
                        onChange={(e) => updateTemplate({ metaTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <textarea
                        placeholder="Meta Description"
                        value={selectedTemplate?.metaDescription || ''}
                        onChange={(e) => updateTemplate({ metaDescription: e.target.value })}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Keywords (comma separated)"
                        value={selectedTemplate?.keywords || ''}
                        onChange={(e) => updateTemplate({ keywords: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Google Analytics ID"
                        value={selectedTemplate?.googleAnalyticsId || ''}
                        onChange={(e) => updateTemplate({ googleAnalyticsId: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Facebook Pixel ID"
                        value={selectedTemplate?.facebookPixelId || ''}
                        onChange={(e) => updateTemplate({ facebookPixelId: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );

    const renderPanel = () => {
        switch (activeTab) {
            case 'design': return <DesignPanel />;
            case 'layout': return <LayoutPanel />;
            case 'content': return <ContentPanel />;
            case 'media': return <MediaPanel />;
            case 'settings': return <SettingsPanel />;
            default: return <DesignPanel />;
        }
    };

    return (
        <div className="bg-white border-r border-gray-200 w-80 flex flex-col h-full">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Website Builder</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <Undo size={16} />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <Redo size={16} />
                        </button>
                    </div>
                </div>

                {/* View Mode Selector */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {viewModes.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                                viewMode === mode.id 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <mode.icon size={16} />
                            <span className="text-xs">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors ${
                            activeTab === tab.id 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderPanel()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    onClick={onPreview}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <Eye size={16} />
                    Preview
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Save size={16} />
                        Save
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WebsiteBuilderTools;
