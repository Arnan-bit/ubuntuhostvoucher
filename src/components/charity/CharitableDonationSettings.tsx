'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Upload, X, Plus, Settings, Save, Eye, EyeOff } from 'lucide-react';

interface CharitableDonationSettingsProps {
    settings: any;
    onSave: (settings: any) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
    uploadFileToCPanel: (file: File, showNotification: any) => Promise<string>;
    isAdminMode?: boolean;
}

interface DonationImage {
    id: string;
    url: string;
    title: string;
    description: string;
    date: string;
}

export const CharitableDonationSettings: React.FC<CharitableDonationSettingsProps> = ({
    settings,
    onSave,
    showNotification,
    uploadFileToCPanel,
    isAdminMode = false
}) => {
    const [donationSettings, setDonationSettings] = useState({
        enabled: settings?.charitable_donation?.enabled || false,
        title: settings?.charitable_donation?.title || 'Supporting Charity',
        description: settings?.charitable_donation?.description || '5% of our revenue goes to charity',
        percentage: settings?.charitable_donation?.percentage || 5,
        charity_name: settings?.charitable_donation?.charity_name || 'Various Charitable Organizations',
        show_images: settings?.charitable_donation?.show_images || false,
        images: settings?.charitable_donation?.images || []
    });

    const [isUploading, setIsUploading] = useState(false);
    const [newImageTitle, setNewImageTitle] = useState('');
    const [newImageDescription, setNewImageDescription] = useState('');

    const handleSettingChange = (key: string, value: any) => {
        setDonationSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!newImageTitle.trim()) {
            showNotification('Please enter a title for the donation image', 'error');
            return;
        }

        setIsUploading(true);
        try {
            const imageUrl = await uploadFileToCPanel(file, showNotification);
            const newImage: DonationImage = {
                id: Date.now().toString(),
                url: imageUrl,
                title: newImageTitle,
                description: newImageDescription,
                date: new Date().toISOString().split('T')[0]
            };

            setDonationSettings(prev => ({
                ...prev,
                images: [...prev.images, newImage]
            }));

            setNewImageTitle('');
            setNewImageDescription('');
            showNotification('Donation image uploaded successfully!', 'success');
        } catch (error) {
            showNotification('Failed to upload donation image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (imageId: string) => {
        setDonationSettings(prev => ({
            ...prev,
            images: prev.images.filter((img: DonationImage) => img.id !== imageId)
        }));
    };

    const handleSave = async () => {
        try {
            const updatedSettings = {
                ...settings,
                charitable_donation: donationSettings
            };
            await onSave(updatedSettings);
            showNotification('Charitable donation settings saved successfully!', 'success');
        } catch (error) {
            showNotification('Failed to save charitable donation settings', 'error');
        }
    };

    if (isAdminMode) {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <Heart className="text-red-500" size={24} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Charitable Donation Settings
                        </h3>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={donationSettings.enabled}
                                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                            />
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Enable Charitable Donation Section
                            </span>
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-8">
                            Show charitable donation information in the footer
                        </p>
                    </div>

                    {donationSettings.enabled && (
                        <>
                            {/* Basic Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Section Title
                                    </label>
                                    <input
                                        type="text"
                                        value={donationSettings.title}
                                        onChange={(e) => handleSettingChange('title', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Supporting Charity"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Charity Name
                                    </label>
                                    <input
                                        type="text"
                                        value={donationSettings.charity_name}
                                        onChange={(e) => handleSettingChange('charity_name', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Various Charitable Organizations"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Donation Percentage
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={donationSettings.percentage}
                                        onChange={(e) => handleSettingChange('percentage', parseInt(e.target.value))}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer mt-8">
                                        <input
                                            type="checkbox"
                                            checked={donationSettings.show_images}
                                            onChange={(e) => handleSettingChange('show_images', e.target.checked)}
                                            className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                        />
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            Show Donation Proof Images
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={donationSettings.description}
                                    onChange={(e) => handleSettingChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="5% of our revenue goes to charity"
                                />
                            </div>

                            {/* Image Management */}
                            {donationSettings.show_images && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Donation Proof Images
                                    </h4>

                                    {/* Add New Image */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                                            Add New Donation Image
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Image title (e.g., 'December 2024 Donation')"
                                                value={newImageTitle}
                                                onChange={(e) => setNewImageTitle(e.target.value)}
                                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description (optional)"
                                                value={newImageDescription}
                                                onChange={(e) => setNewImageDescription(e.target.value)}
                                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading || !newImageTitle.trim()}
                                                className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                            />
                                            {isUploading && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Uploading...
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Existing Images */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {donationSettings.images.map((image: DonationImage) => (
                                            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                <div className="relative mb-3">
                                                    <Image
                                                        src={image.url}
                                                        alt={image.title}
                                                        width={200}
                                                        height={150}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveImage(image.id)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <h6 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                                    {image.title}
                                                </h6>
                                                {image.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                        {image.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    {image.date}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <Save size={18} />
                            Save Charitable Settings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Public display component will be created separately
    return null;
};

export default CharitableDonationSettings;
