'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useClientData } from '@/hooks/use-client-data';
import * as dataApi from '@/lib/hostvoucher-data';
import {
    Sparkles,
    Download,
    Eye,
    Search,
    Star,
    Globe,
    Smartphone,
    Code,
    Zap,
    Crown,
    Layout,
    Palette,
    Settings
} from 'lucide-react';
import Image from 'next/image';
import PaymentSystem from '@/components/payment/PaymentSystem';
import EmailCapture from '@/components/marketing/EmailCapture';
import WebsiteBuilderTools from '@/components/website-builder/WebsiteBuilderTools';
import TemplatePreview from '@/components/website-builder/TemplatePreview';


interface Template {
    id: string;
    name: string;
    category: string;
    description: string;
    preview_image: string;
    price: number;
    is_free: boolean;
    rating: number;
    downloads: number;
    features: string[];
    demo_url?: string;
    created_at: string;
}

const categories = [
    { id: 'all', name: 'All Templates', count: 2847, icon: '🌟' },
    { id: 'restaurant', name: 'Restaurant & Food', count: 342, icon: '🍽️' },
    { id: 'ecommerce', name: 'E-commerce', count: 456, icon: '🛒' },
    { id: 'portfolio', name: 'Portfolio', count: 234, icon: '🎨' },
    { id: 'business', name: 'Business', count: 567, icon: '💼' },
    { id: 'blog', name: 'Blog & News', count: 189, icon: '📝' },
    { id: 'healthcare', name: 'Healthcare', count: 123, icon: '🏥' },
    { id: 'education', name: 'Education', count: 98, icon: '🎓' },
    { id: 'realestate', name: 'Real Estate', count: 87, icon: '🏠' },
    { id: 'technology', name: 'Technology', count: 178, icon: '💻' },
    { id: 'fashion', name: 'Fashion', count: 234, icon: '👗' },
    { id: 'travel', name: 'Travel', count: 156, icon: '✈️' },
    { id: 'fitness', name: 'Fitness', count: 89, icon: '💪' },
    { id: 'photography', name: 'Photography', count: 123, icon: '📸' },
    { id: 'automotive', name: 'Automotive', count: 67, icon: '🚗' },
    { id: 'nonprofit', name: 'Non-Profit', count: 45, icon: '❤️' }
];

const sampleTemplates: Template[] = [
    // Restaurant Templates
    {
        id: '1',
        name: 'Modern Restaurant',
        category: 'Restaurant',
        description: 'Beautiful restaurant website with online menu and reservation system',
        preview_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        price: 29.99,
        is_free: false,
        rating: 4.8,
        downloads: 1250,
        features: ['Responsive Design', 'Online Menu', 'Reservation System', 'SEO Optimized'],
        demo_url: 'https://demo.example.com/restaurant',
        created_at: '2024-01-15'
    },
    {
        id: '2',
        name: 'Fast Food Chain',
        category: 'Restaurant',
        description: 'Quick service restaurant template with online ordering and delivery tracking',
        preview_image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
        price: 24.99,
        is_free: false,
        rating: 4.7,
        downloads: 890,
        features: ['Online Ordering', 'Delivery Tracking', 'Mobile App Ready', 'Payment Gateway'],
        demo_url: 'https://demo.example.com/fastfood',
        created_at: '2024-01-20'
    },
    {
        id: '3',
        name: 'Coffee Shop Cafe',
        category: 'Restaurant',
        description: 'Cozy coffee shop website with loyalty program and event booking',
        preview_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
        price: 19.99,
        is_free: false,
        rating: 4.9,
        downloads: 1456,
        features: ['Loyalty Program', 'Event Booking', 'Social Media Integration', 'Blog System'],
        demo_url: 'https://demo.example.com/coffeeshop',
        created_at: '2024-01-25'
    },
    {
        id: '2',
        name: 'E-commerce Store',
        category: 'E-commerce',
        description: 'Complete online store with shopping cart and payment integration',
        preview_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        price: 49.99,
        is_free: false,
        rating: 4.9,
        downloads: 2100,
        features: ['Shopping Cart', 'Payment Gateway', 'Product Catalog', 'Admin Panel'],
        demo_url: 'https://demo.example.com/ecommerce',
        created_at: '2024-01-10'
    },
    {
        id: '3',
        name: 'Creative Portfolio',
        category: 'Portfolio',
        description: 'Stunning portfolio website for creative professionals',
        preview_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
        price: 0,
        is_free: true,
        rating: 4.6,
        downloads: 3400,
        features: ['Gallery', 'Contact Form', 'Blog', 'Social Media Integration'],
        demo_url: 'https://demo.example.com/portfolio',
        created_at: '2024-01-20'
    },
    // Fashion & Beauty Templates
    {
        id: '4',
        name: 'Fashion Boutique',
        category: 'Fashion',
        description: 'Elegant fashion boutique with lookbook and style guide',
        preview_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        price: 39.99,
        is_free: false,
        rating: 4.8,
        downloads: 2340,
        features: ['Lookbook Gallery', 'Style Guide', 'Size Chart', 'Wishlist'],
        demo_url: 'https://demo.example.com/fashion',
        created_at: '2024-02-01'
    },
    {
        id: '5',
        name: 'Beauty Salon & Spa',
        category: 'Fashion',
        description: 'Luxurious beauty salon website with appointment booking',
        preview_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
        price: 34.99,
        is_free: false,
        rating: 4.9,
        downloads: 1876,
        features: ['Appointment Booking', 'Service Menu', 'Staff Profiles', 'Before/After Gallery'],
        demo_url: 'https://demo.example.com/beauty',
        created_at: '2024-02-05'
    },
    // Healthcare Templates
    {
        id: '6',
        name: 'Medical Clinic',
        category: 'Healthcare',
        description: 'Professional medical clinic with patient portal and appointments',
        preview_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        price: 59.99,
        is_free: false,
        rating: 4.7,
        downloads: 567,
        features: ['Patient Portal', 'Online Appointments', 'Doctor Profiles', 'Health Resources'],
        demo_url: 'https://demo.example.com/medical',
        created_at: '2024-02-10'
    },
    {
        id: '7',
        name: 'Dental Practice',
        category: 'Healthcare',
        description: 'Modern dental practice website with treatment showcase',
        preview_image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop',
        price: 44.99,
        is_free: false,
        rating: 4.8,
        downloads: 890,
        features: ['Treatment Gallery', 'Insurance Info', 'Emergency Contact', 'Patient Reviews'],
        demo_url: 'https://demo.example.com/dental',
        created_at: '2024-02-15'
    },
    // Technology Templates
    {
        id: '8',
        name: 'SaaS Landing Page',
        category: 'Technology',
        description: 'Modern SaaS product landing page with pricing tiers',
        preview_image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
        price: 49.99,
        is_free: false,
        rating: 4.9,
        downloads: 3456,
        features: ['Pricing Tables', 'Feature Comparison', 'Free Trial', 'API Documentation'],
        demo_url: 'https://demo.example.com/saas',
        created_at: '2024-02-20'
    },
    {
        id: '9',
        name: 'Mobile App Landing',
        category: 'Technology',
        description: 'App showcase website with download links and screenshots',
        preview_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        price: 29.99,
        is_free: false,
        rating: 4.7,
        downloads: 2890,
        features: ['App Screenshots', 'Download Links', 'Feature Highlights', 'User Reviews'],
        demo_url: 'https://demo.example.com/mobileapp',
        created_at: '2024-02-25'
    },
    // Real Estate Templates
    {
        id: '10',
        name: 'Real Estate Agency',
        category: 'Real Estate',
        description: 'Professional real estate website with property listings',
        preview_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
        price: 54.99,
        is_free: false,
        rating: 4.8,
        downloads: 1234,
        features: ['Property Search', 'Virtual Tours', 'Agent Profiles', 'Mortgage Calculator'],
        demo_url: 'https://demo.example.com/realestate',
        created_at: '2024-03-01'
    },
    {
        id: '11',
        name: 'Property Management',
        category: 'Real Estate',
        description: 'Property management company with tenant portal',
        preview_image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
        price: 64.99,
        is_free: false,
        rating: 4.6,
        downloads: 678,
        features: ['Tenant Portal', 'Maintenance Requests', 'Rent Payment', 'Property Analytics'],
        demo_url: 'https://demo.example.com/property',
        created_at: '2024-03-05'
    },
    // Education Templates
    {
        id: '12',
        name: 'Online Course Platform',
        category: 'Education',
        description: 'Complete e-learning platform with course management',
        preview_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
        price: 79.99,
        is_free: false,
        rating: 4.9,
        downloads: 1567,
        features: ['Course Management', 'Student Dashboard', 'Progress Tracking', 'Certificates'],
        demo_url: 'https://demo.example.com/elearning',
        created_at: '2024-03-10'
    },
    {
        id: '13',
        name: 'School Website',
        category: 'Education',
        description: 'Educational institution website with student portal',
        preview_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        price: 39.99,
        is_free: false,
        rating: 4.7,
        downloads: 2345,
        features: ['Student Portal', 'Event Calendar', 'News Updates', 'Faculty Directory'],
        demo_url: 'https://demo.example.com/school',
        created_at: '2024-03-15'
    },
    // Travel & Tourism Templates
    {
        id: '14',
        name: 'Travel Agency',
        category: 'Travel',
        description: 'Travel booking website with destination guides',
        preview_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        price: 44.99,
        is_free: false,
        rating: 4.8,
        downloads: 1890,
        features: ['Booking System', 'Destination Guides', 'Travel Packages', 'Customer Reviews'],
        demo_url: 'https://demo.example.com/travel',
        created_at: '2024-03-20'
    },
    {
        id: '15',
        name: 'Hotel & Resort',
        category: 'Travel',
        description: 'Luxury hotel website with room booking and amenities',
        preview_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        price: 59.99,
        is_free: false,
        rating: 4.9,
        downloads: 1234,
        features: ['Room Booking', 'Amenities Showcase', 'Photo Gallery', 'Special Offers'],
        demo_url: 'https://demo.example.com/hotel',
        created_at: '2024-03-25'
    },
    // Blog & Content Templates
    {
        id: '16',
        name: 'Personal Blog',
        category: 'Blog',
        description: 'Modern personal blog with social sharing and comments',
        preview_image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=300&fit=crop',
        price: 0,
        is_free: true,
        rating: 4.6,
        downloads: 4567,
        features: ['Social Sharing', 'Comment System', 'Newsletter Signup', 'SEO Optimized'],
        demo_url: 'https://demo.example.com/blog',
        created_at: '2024-04-01'
    },
    {
        id: '17',
        name: 'News Magazine',
        category: 'Blog',
        description: 'Professional news website with multiple categories',
        preview_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
        price: 49.99,
        is_free: false,
        rating: 4.8,
        downloads: 1678,
        features: ['Multi-Category', 'Breaking News', 'Author Profiles', 'Advertisement Spaces'],
        demo_url: 'https://demo.example.com/news',
        created_at: '2024-04-05'
    },
    // Business Service Templates
    {
        id: '18',
        name: 'Law Firm',
        category: 'Business',
        description: 'Professional law firm website with case studies',
        preview_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
        price: 69.99,
        is_free: false,
        rating: 4.7,
        downloads: 890,
        features: ['Case Studies', 'Attorney Profiles', 'Practice Areas', 'Consultation Booking'],
        demo_url: 'https://demo.example.com/lawfirm',
        created_at: '2024-04-10'
    },
    {
        id: '19',
        name: 'Accounting Firm',
        category: 'Business',
        description: 'Professional accounting services with client portal',
        preview_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
        price: 54.99,
        is_free: false,
        rating: 4.8,
        downloads: 1123,
        features: ['Client Portal', 'Tax Calculator', 'Service Packages', 'Document Upload'],
        demo_url: 'https://demo.example.com/accounting',
        created_at: '2024-04-15'
    },
    {
        id: '20',
        name: 'Fitness Gym',
        category: 'Business',
        description: 'Modern gym website with class schedules and membership',
        preview_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        price: 39.99,
        is_free: false,
        rating: 4.9,
        downloads: 2456,
        features: ['Class Schedules', 'Membership Plans', 'Trainer Profiles', 'Progress Tracking'],
        demo_url: 'https://demo.example.com/fitness',
        created_at: '2024-04-20'
    }
];

export default function InstantProWebsitePage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [builderMode, setBuilderMode] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);

    
    const { toast } = useToast();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates');
            const data = await response.json();
            if (data.templates) {
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            // Keep using sample templates as fallback
        }
    };

    const { loading } = useClientData(async () => {
        return await dataApi.getSiteSettings();
    });

    const filteredTemplates = templates.filter(template => {
        const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a description for your website",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/templates/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    user_email: 'user@example.com' // In real app, get from auth
                })
            });

            const data = await response.json();

            if (data.success) {
                const newTemplate: Template = {
                    id: data.template.id,
                    name: data.template.name,
                    category: data.template.category,
                    description: data.template.description,
                    preview_image: data.template.preview_image,
                    price: data.template.price,
                    is_free: data.template.is_free,
                    rating: data.template.rating || 4.7,
                    downloads: 0,
                    features: data.template.features,
                    created_at: new Date().toISOString().split('T')[0]
                };

                setTemplates(prev => [newTemplate, ...prev]);
                setAiPrompt('');

                toast({
                    title: "Success!",
                    description: "Your custom website template has been generated!"
                });
            } else {
                throw new Error(data.error || 'Failed to generate template');
            }
        } catch (error) {
            console.error('Error generating template:', error);
            toast({
                title: "Error",
                description: "Failed to generate template. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async (template: Template) => {
        setSelectedTemplate(template);

        if (template.is_free) {
            // Show email capture for free download
            setShowEmailCapture(true);
        } else {
            // Show payment modal for paid templates
            setShowPaymentModal(true);
        }
    };

    const handleEdit = (template: Template) => {
        setCurrentTemplate({
            ...template,
            title: template.name,
            description: template.description,
            primaryColor: 'blue',
            fontFamily: 'Inter',
            fontSize: 16,
            layout: 'single-column',
            backgroundType: 'color',
            menuItems: ['Home', 'About', 'Services', 'Contact']
        });
        setBuilderMode(true);
    };

    const handleEmailCaptureSuccess = async (_data: any) => {
        if (selectedTemplate) {
            toast({
                title: "Email Captured!",
                description: `Thank you! Your download link for ${selectedTemplate.name} will be sent to your email.`
            });

            // Close email capture modal
            setShowEmailCapture(false);
            setSelectedTemplate(null);
        }
    };



    const handlePaymentSuccess = (_paymentData: any) => {
        if (selectedTemplate) {
            toast({
                title: "Payment Successful!",
                description: `Thank you for purchasing ${selectedTemplate.name}. Your download will start shortly.`
            });

            // Close payment modal
            setShowPaymentModal(false);
            setSelectedTemplate(null);
        }
    };

    const handlePaymentError = (error: string) => {
        toast({
            title: "Payment Failed",
            description: error,
            variant: "destructive"
        });
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Builder Mode
    if (builderMode && currentTemplate) {
        return (
            <div className="h-screen flex bg-gray-100">
                <WebsiteBuilderTools
                    selectedTemplate={currentTemplate}
                    onTemplateUpdate={setCurrentTemplate}
                    onPreview={() => {}}
                    onSave={() => {
                        toast({
                            title: "Template Saved",
                            description: "Your template has been saved successfully!"
                        });
                    }}
                    onDownload={() => {
                        toast({
                            title: "Template Downloaded",
                            description: "Your template is ready for use!"
                        });
                    }}
                />
                <div className="flex-1">
                    <TemplatePreview
                        template={currentTemplate}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    />
                </div>
                <button
                    onClick={() => setBuilderMode(false)}
                    className="absolute top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    Exit Builder
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Hero Section */}
            <section className="pt-16 pb-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 mr-2" />
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Instant Pro Website
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                        Create stunning professional websites in minutes with AI-powered templates. 
                        Perfect for UMKM, startups, and businesses worldwide.
                    </p>
                    
                    {/* AI Generator */}
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
                            <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                            🤖 AI Website Generator
                        </h3>
                        <p className="text-center text-white/80 mb-6">
                            Describe your business and let our AI create the perfect website template for you
                        </p>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Describe your business... (e.g., Modern coffee shop with online ordering and delivery)"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 text-lg border-2 border-transparent focus:border-yellow-400 transition-colors"
                                    disabled={isGenerating}
                                />
                                <Button
                                    onClick={handleAiGenerate}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold rounded-xl"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Generating Magic...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generate Website
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Quick Suggestions */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="text-white/60 text-sm">Quick ideas:</span>
                                {[
                                    'Restaurant with online menu',
                                    'E-commerce fashion store',
                                    'Photography portfolio',
                                    'Fitness gym website',
                                    'Real estate agency'
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setAiPrompt(suggestion)}
                                        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors"
                                        disabled={isGenerating}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">2,847+</div>
                            <div className="text-white/70">Premium Templates</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">50,000+</div>
                            <div className="text-white/70">Websites Created</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">4.9/5</div>
                            <div className="text-white/70">Customer Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">24/7</div>
                            <div className="text-white/70">AI Support</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80 mt-8">
                        <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            2,847+ Premium Templates
                        </div>
                        <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            100% Mobile Responsive
                        </div>
                        <div className="flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            No Coding Required
                        </div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            4.9/5 Customer Rating
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose Instant Pro Website?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Everything you need to create a professional website that converts visitors into customers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast Setup</h3>
                            <p className="text-gray-600 dark:text-gray-300">Create your website in under 5 minutes with our AI-powered tools and pre-built templates</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <Smartphone className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mobile Responsive</h3>
                            <p className="text-gray-600 dark:text-gray-300">All templates are fully responsive and optimized for mobile, tablet, and desktop</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <Code className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Coding Required</h3>
                            <p className="text-gray-600 dark:text-gray-300">Drag and drop interface with AI content generation - no technical skills needed</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SEO Optimized</h3>
                            <p className="text-gray-600 dark:text-gray-300">Built-in SEO tools to help your website rank higher in search results</p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                                <Crown className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
                            <p className="text-gray-600 dark:text-gray-300">Professional designs created by expert designers and developers</p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                                <Star className="text-white w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
                            <p className="text-gray-600 dark:text-gray-300">Get help anytime with our AI-powered support system and expert team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                                        selectedCategory === category.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <span>{category.icon}</span>
                                    <span>{category.name}</span>
                                    <span className="text-xs opacity-75">({category.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onDownload={handleDownload}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No templates found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Email Capture Modal */}
            {showEmailCapture && selectedTemplate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <EmailCapture
                            title={`Download ${selectedTemplate.name}`}
                            subtitle="Enter your email to get instant access to this template"
                            onSubmit={(email) => handleEmailCaptureSuccess({ email })}
                            variant="popup"
                        />
                        <button
                            onClick={() => setShowEmailCapture(false)}
                            className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Payment System Modal */}
            {showPaymentModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Purchase {selectedTemplate.name}</h3>
                        <PaymentSystem
                            amount={selectedTemplate.price}
                            currency="USD"
                            onSuccess={(transactionId) => handlePaymentSuccess({ transactionId })}
                            onError={handlePaymentError}
                        />
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const TemplateCard = ({ template, onDownload, onEdit }: { template: Template; onDownload: (template: Template) => void; onEdit?: (template: Template) => void }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
                <Image
                    src={template.preview_image}
                    alt={template.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                    {template.is_free ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            FREE
                        </span>
                    ) : (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            PRO
                        </span>
                    )}
                </div>
                <div className="absolute top-2 left-2">
                    <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {template.category}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {template.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{template.rating}</span>
                        <span className="text-gray-500 text-sm ml-2">
                            ({template.downloads.toLocaleString()} downloads)
                        </span>
                    </div>
                    {!template.is_free && (
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                            ${template.price}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded">
                            {feature}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    {template.demo_url && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(template.demo_url, '_blank')}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onEdit(template)}
                        >
                            <Code className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => onDownload(template)}
                    >
                        <Download className="w-4 h-4 mr-1" />
                        {template.is_free ? 'Download' : 'Buy Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};


