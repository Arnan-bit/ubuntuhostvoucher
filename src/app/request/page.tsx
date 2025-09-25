'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/hostvoucher/LayoutComponents';
import { Footer } from '@/components/hostvoucher/LayoutComponents';
import { UnifiedSupportChat } from '@/components/support/UnifiedSupportChat';
import { Upload, Send, Trophy, CheckCircle, AlertCircle, Star, Gift, Zap, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const translations = {
    en: {
        requestTitle: "Request & Submit Proof of Purchase",
        requestDescription: "Submit your hosting purchase proof and earn 50,000,000 points!",
        fullName: "Full Name",
        whatsappNumber: "WhatsApp Number",
        provider: "Hosting Provider",
        domain: "Domain Name",
        purchaseDate: "Purchase Date",
        userEmail: "Email Address",
        screenshot: "Proof of Purchase Screenshot",
        submitButton: "Submit Request",
        submitting: "Submitting...",
        success: "Success! Your submission has been received.",
        error: "Error submitting your request. Please try again.",
        required: "This field is required",
        invalidFile: "Please upload a valid image file",
        fileTooLarge: "File size must be less than 10MB",
        uploadSuccess: "File uploaded successfully!",
        pointsReward: "You will receive 50,000,000 points once approved!",
        formInstructions: "Fill out all required fields and upload proof of purchase to earn points.",
        supportedFormats: "Supported formats: PNG, JPG, JPEG, GIF (Max 10MB)"
    }
};

// Request Form Component with full functionality
const RequestForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        whatsappNumber: '',
        provider: '',
        domain: '',
        purchaseDate: '',
        userEmail: '',
        screenshot: null as File | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = translations.en.required;
        }
        if (!formData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = translations.en.required;
        }
        if (!formData.provider) {
            newErrors.provider = translations.en.required;
        }
        if (!formData.purchaseDate) {
            newErrors.purchaseDate = translations.en.required;
        }
        if (!formData.screenshot) {
            newErrors.screenshot = translations.en.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid File Type",
                    description: translations.en.invalidFile,
                    variant: "destructive"
                });
                return;
            }

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: translations.en.fileTooLarge,
                    variant: "destructive"
                });
                return;
            }

            setFormData(prev => ({ ...prev, screenshot: file }));

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Clear error
            if (errors.screenshot) {
                setErrors(prev => ({ ...prev, screenshot: '' }));
            }

            toast({
                title: "File Selected",
                description: translations.en.uploadSuccess,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    submitFormData.append(key, value);
                }
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: submitFormData,
            });

            if (response.ok) {
                toast({
                    title: "Success!",
                    description: translations.en.pointsReward,
                });

                // Reset form
                setFormData({
                    fullName: '',
                    whatsappNumber: '',
                    provider: '',
                    domain: '',
                    purchaseDate: '',
                    userEmail: '',
                    screenshot: null
                });
                setPreviewUrl(null);
                setErrors({});
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: translations.en.error,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Points Reward Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                    <Crown className="w-6 h-6 mr-2" />
                    <span className="text-xl font-bold">50,000,000 Points Reward!</span>
                </div>
                <p className="text-orange-100">{translations.en.formInstructions}</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.fullName} *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* WhatsApp Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.whatsappNumber} *
                    </label>
                    <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+62 812 3456 7890"
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.userEmail} *
                    </label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.userEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                    />
                    {errors.userEmail && <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>}
                </div>

                {/* Hosting Provider */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.provider} *
                    </label>
                    <select
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.provider ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select hosting provider</option>
                        <option value="hostinger">Hostinger</option>
                        <option value="namecheap">Namecheap</option>
                        <option value="godaddy">GoDaddy</option>
                        <option value="bluehost">Bluehost</option>
                        <option value="siteground">SiteGround</option>
                        <option value="digitalocean">DigitalOcean</option>
                        <option value="vultr">Vultr</option>
                        <option value="linode">Linode</option>
                        <option value="aws">AWS</option>
                        <option value="google-cloud">Google Cloud</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider}</p>}
                </div>

                {/* Domain Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.domain}
                    </label>
                    <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="example.com"
                    />
                </div>

                {/* Purchase Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translations.en.purchaseDate} *
                    </label>
                    <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.purchaseDate && <p className="text-red-500 text-sm mt-1">{errors.purchaseDate}</p>}
                </div>
            </div>

            {/* File Upload */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translations.en.screenshot} *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.screenshot ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                }`}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer">
                        {previewUrl ? (
                            <div className="space-y-4">
                                <div className="relative w-32 h-32 mx-auto">
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    File selected successfully
                                </p>
                                <p className="text-xs text-gray-500">Click to change file</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                <div>
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                        Upload Proof of Purchase
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {translations.en.supportedFormats}
                                    </p>
                                </div>
                            </div>
                        )}
                    </label>
                </div>
                {errors.screenshot && <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            {translations.en.submitting}
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            {translations.en.submitButton}
                        </>
                    )}
                </button>
            </div>

            {/* Reward Info */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-center">
                    <Gift className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        {translations.en.pointsReward}
                    </span>
                </div>
            </div>
        </form>
    );
};

export default function RequestPage() {
    const [siteSettings, setSiteSettings] = useState({ site_appearance: {} });

    useEffect(() => {
        fetch('/api/data?type=siteSettings')
            .then(res => res.json())
            .then(data => setSiteSettings(data))
            .catch(err => console.error('Failed to load site settings:', err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header
                translations={translations}
                siteSettings={siteSettings}
            />

            <main className="py-12">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                                    <Trophy className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {translations.en.requestTitle}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {translations.en.requestDescription}
                            </p>
                        </div>

                        <RequestForm />
                    </div>
                </div>
            </main>

            <Footer translations={translations} />

            <UnifiedSupportChat />
        </div>
    );
}
