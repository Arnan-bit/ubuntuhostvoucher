
'use client';

// =================================================================================
// HOSTVOUCHER - DEDICATED ADMIN SETTINGS PAGE (MySQL Integrated)
// =================================================================================
// Halaman ini khusus untuk pengaturan strategis dan konfigurasi global.
// Semua pengambilan data sekarang terintegrasi dengan API /api/data (MySQL).

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import type { User } from 'firebase/auth';
import { app, auth } from '@/lib/firebase-client';
import Link from 'next/link';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import * as apiClient from '@/lib/api-client';
import {
    BlogManagement,
    NewsletterView,
    SiteAppearancePage,
    IntegrationsPage,
    GlobalSettingsPage,
    UploadManager,
    DigitalStrategyImagesPage,
    AdvancedGamificationManager,
    EnhancedBannerRotationManager,
    ProfessionalCatalogImageManager,
    LandingPageManager
} from '@/app/admin/AdminComponents';
import { CharitableDonationSettings } from '@/components/charity/CharitableDonationSettings';

// --- Third-Party Libraries ---
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Link2, Menu, X, Trash2, ExternalLink, Edit, Save,
    Shield, Crown, Rocket, Image as ImageIcon,
    Search, Settings, MessageSquare, Zap, CheckCircle, LogOut,
    Trophy, Star, ChevronLeft, ChevronRight, Info, Mail, Send, UploadCloud, Brush, DollarSign, AlertCircle, Clock, Gem, Medal, Lock,
    Palette, Plus, Users as UsersIcon, Newspaper, BookOpen, Copy, Award, MinusCircle, Upload, FolderOpen, RotateCcw, Eye, EyeOff, Heart
} from 'lucide-react';
import { badgeTiers } from '@/lib/data';


// =================================================================================
// BAGIAN 1: KONFIGURASI INTI & UTILITAS
// =================================================================================
const appId = "HostVoucher-ai-tracking-stable";
// Daftar email admin yang diizinkan
const AUTHORIZED_EMAILS = [
  "hostvouchercom@gmail.com",
  "garudandne87@gmail.com"
];

// Local File Manager Upload Function
const uploadFileToCPanel = async (file: File, showNotification?: Function, category: string = 'images'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category); // images, banners, profiles, promos

    try {
        console.log('🔄 Uploading to local file manager...', {
            fileName: file.name,
            fileSize: file.size,
            category: category
        });

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Upload failed due to a server error.');
        }

        console.log('✅ Upload successful:', result);

        if (showNotification) {
            showNotification(`File uploaded successfully to local storage! (${Math.round(file.size / 1024)}KB)`, 'success');
        }

        // Return the local URL (relative path)
        return result.url;

    } catch (error: any) {
        console.error('❌ Local Upload Error:', error);

        if (showNotification) {
            showNotification(`Upload failed: ${error.message}`, 'error');
        }

        throw error;
    }
};


// =================================================================================
// BAGIAN 2: DEFINISI SEMUA KOMPONEN UI
// =================================================================================

// --- Komponen Helper ---
const InputField = React.memo(({ label, className, ...props }: any) => (<div className={className}><label className="block text-sm font-medium text-slate-300 mb-2">{label}</label><input {...props} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" /></div>));
const SelectField = React.memo(({ label, options, ...props }: any) => (<div><label className="block text-sm font-medium text-slate-300 mb-2">{label}</label><select {...props} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500">{options.map((o: any) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}</select></div>));
const Paginator = ({ currentPage, totalPages, onPageChange }: any) => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } 
    else {
        if (currentPage <= Math.ceil(maxPagesToShow / 2)) { startPage = 1; endPage = maxPagesToShow; } 
        else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) { startPage = totalPages - maxPagesToShow + 1; endPage = totalPages; } 
        else { startPage = currentPage - Math.floor(maxPagesToShow / 2); endPage = currentPage + Math.floor(maxPagesToShow / 2); }
    }
    for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); }
    return (
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50 text-xs flex items-center gap-1 hover:bg-slate-600"><ChevronLeft size={14} /></button>
                {startPage > 1 && (<> <button onClick={() => onPageChange(1)} className="px-3 py-1 bg-slate-700 rounded-md text-xs hover:bg-slate-600">1</button> <span className="text-slate-500">...</span> </>)}
                {pageNumbers.map(number => (<button key={number} onClick={() => onPageChange(number)} className={`px-3 py-1 rounded-md text-xs ${currentPage === number ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>{number}</button>))}
                {endPage < totalPages && (<> <span className="text-slate-500">...</span> <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 bg-slate-700 rounded-md text-xs hover:bg-slate-600">{totalPages}</button> </>)}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50 text-xs flex items-center gap-1 hover:bg-slate-600"><ChevronRight size={14} /></button>
            </div>
        </div>
    );
};

// --- Komponen: Sidebar ---
const Sidebar = React.memo(({ sectionRefs, onLogout }: any) => {
    const [activeSection, setActiveSection] = useState('gamification');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigation = (page: any) => {
        sectionRefs[page].current?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const mainPanel = document.querySelector('#admin-main-panel');
        if (!mainPanel) return;
        const observerOptions = { root: mainPanel, rootMargin: '0px 0px -85% 0px', threshold: 0 };
        const observerCallback = (entries: any) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    const visibleSection = Object.keys(sectionRefs).find(key => sectionRefs[key].current === entry.target);
                    if (visibleSection) setActiveSection(visibleSection);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRefs = Object.values(sectionRefs).map((ref: any) => ref.current).filter(Boolean);
        currentRefs.forEach(refEl => observer.observe(refEl));
        return () => currentRefs.forEach(refEl => { if (refEl) observer.unobserve(refEl); });
    }, [sectionRefs]);

    const navItems = [
        { id: 'blog', label: 'Manage Blog', icon: BookOpen },
        { id: 'newsletter', label: 'Newsletter', icon: Newspaper },
        { id: 'uploads', label: 'Upload Manager', icon: Upload },
        { id: 'appearance', label: 'Site Appearance', icon: Brush },
        { id: 'strategy', label: 'Digital Strategy Images', icon: ImageIcon },
        { id: 'catalog', label: 'Catalog Images', icon: ImageIcon },
        { id: 'landing', label: 'Landing Page Manager', icon: LayoutDashboard },
        { id: 'gamification', label: 'Advanced Gamification', icon: Trophy },
        { id: 'banners', label: 'Banner Rotation', icon: RotateCcw },
        { id: 'charitable', label: 'Charitable Donation', icon: Heart },
        { id: 'integrations', label: 'Integrations', icon: Zap },
        { id: 'settings', label: 'Global Settings', icon: Settings },
    ];
    
    const NavList = () => (
        <nav>
            <ul>
                <li>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 mb-4">
                        <ChevronLeft size={20} /><span>Back to Main Dashboard</span>
                    </Link>
                </li>
                {navItems.map(item => (
                    <li key={item.id}>
                        <a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
                            <item.icon size={20} /><span>{item.label}</span>
                        </a>
                    </li>
                ))}
                 <li key="logout">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-800/50 text-red-400 mt-4">
                        <LogOut size={20} /><span>Logout</span>
                    </button>
                </li>
            </ul>
        </nav>
    );

    return (
         <>
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 flex flex-col sticky top-0 h-screen hidden md:flex">
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings /> Settings</h1>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    <NavList />
                </div>
            </aside>
            
            <header className="md:hidden sticky top-0 z-40 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                 <h1 className="text-xl font-bold text-white flex items-center gap-2"><Settings /> Settings</h1>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                    {mobileMenuOpen ? <X/> : <Menu/>}
                </button>
            </header>

             <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-800 border-b border-slate-700 p-4">
                        <NavList />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});




// --- Komponen Editor Blog ---
const BlogEditor = ({ existingPost, onSave, onCancel, showNotification }: any) => {
    const [post, setPost] = useState(existingPost);
    const [isUploading, setIsUploading] = useState(false);
    const handleChange = (e: any) => setPost((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return; setIsUploading(true);
        try { const url = await uploadFileToCPanel(file, showNotification, 'images'); setPost((prev: any) => ({ ...prev, image_url: url })); }
        catch (error) { /* Error is handled in helper */ }
        finally { setIsUploading(false); }
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(post); };
    return (
        <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-white mb-6">{post.id ? 'Edit Blog Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                <InputField label="Post Title" name="title" value={post.title} onChange={handleChange} required />
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Post Content (HTML allowed)</label><textarea name="content" value={post.content} onChange={handleChange} rows={12} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"></textarea></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label><input type="file" onChange={handleImageUpload} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />{isUploading && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}{post.image_url && <Image src={post.image_url} alt="Preview" width={200} height={100} className="mt-4 rounded-md object-cover" />}</div>
                <InputField label="Image AI Hint (for placeholder)" name="image_hint" value={post.image_hint} onChange={handleChange} placeholder="e.g., 'technology security'" />
                <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500">Cancel</button><button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">Save Post</button></div>
            </form>
        </div>
    );
};



// --- Komponen Banner Management ---
const BannerManagement = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [banners, setBanners] = useState(settings?.page_banners || []);
    const [isUploading, setIsUploading] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFileToCPanel(file, showNotification, 'banners');
            return url;
        } catch (error) {
            showNotification('Failed to upload banner image', 'error');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddBanner = async (bannerData: any) => {
        const newBanner = {
            id: Date.now().toString(),
            ...bannerData,
            created_at: new Date().toISOString(),
            active: true
        };

        const updatedBanners = [...banners, newBanner];
        setBanners(updatedBanners);

        await onSave({
            ...settings,
            page_banners: updatedBanners
        });

        setShowAddForm(false);
        showNotification('Banner added successfully!', 'success');
    };

    const handleEditBanner = async (bannerId: string, bannerData: any) => {
        const updatedBanners = banners.map((banner: any) =>
            banner.id === bannerId ? { ...banner, ...bannerData } : banner
        );

        setBanners(updatedBanners);
        await onSave({
            ...settings,
            page_banners: updatedBanners
        });

        setEditingBanner(null);
        showNotification('Banner updated successfully!', 'success');
    };

    const handleDeleteBanner = async (bannerId: string) => {
        const updatedBanners = banners.filter((banner: any) => banner.id !== bannerId);
        setBanners(updatedBanners);

        await onSave({
            ...settings,
            page_banners: updatedBanners
        });

        showNotification('Banner deleted successfully!', 'success');
    };

    const handleToggleBanner = async (bannerId: string) => {
        const updatedBanners = banners.map((banner: any) =>
            banner.id === bannerId ? { ...banner, active: !banner.active } : banner
        );

        setBanners(updatedBanners);
        await onSave({
            ...settings,
            page_banners: updatedBanners
        });

        showNotification('Banner status updated!', 'success');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Banner Management</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                >
                    Add New Banner
                </button>
            </div>

            {/* Banner List */}
            <div className="grid gap-4">
                {banners.map((banner: any) => (
                    <div key={banner.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-20 h-12 object-cover rounded"
                                />
                                <div>
                                    <h4 className="text-white font-semibold">{banner.title}</h4>
                                    <p className="text-slate-400 text-sm">{banner.description}</p>
                                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                                        banner.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {banner.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleToggleBanner(banner.id)}
                                    className={`px-3 py-1 rounded text-sm ${
                                        banner.active
                                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                    }`}
                                >
                                    {banner.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => setEditingBanner(banner)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {banner.rotation_settings && (
                            <div className="text-sm text-slate-400">
                                <span>Rotation: {banner.rotation_settings.interval}s interval</span>
                                {banner.rotation_settings.schedule && (
                                    <span className="ml-4">Schedule: {banner.rotation_settings.schedule}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add/Edit Banner Modal */}
            {(showAddForm || editingBanner) && (
                <BannerForm
                    banner={editingBanner}
                    onSave={editingBanner ?
                        (data: any) => handleEditBanner(editingBanner.id, data) :
                        handleAddBanner
                    }
                    onCancel={() => {
                        setShowAddForm(false);
                        setEditingBanner(null);
                    }}
                    onImageUpload={handleImageUpload}
                    isUploading={isUploading}
                />
            )}
        </div>
    );
};



// --- Banner Form Component ---
const BannerForm = ({ banner, onSave, onCancel, onImageUpload, isUploading }: any) => {
    const [formData, setFormData] = useState({
        title: banner?.title || '',
        description: banner?.description || '',
        image_url: banner?.image_url || '',
        link_url: banner?.link_url || '',
        target_page: banner?.target_page || 'all',
        position: banner?.position || 'top',
        rotation_settings: banner?.rotation_settings || {
            enabled: false,
            interval: 5,
            schedule: 'always'
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.image_url) {
            alert('Title and image are required');
            return;
        }
        onSave(formData);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = await onImageUpload(e);
        if (url) {
            setFormData(prev => ({ ...prev, image_url: url }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-4">
                    {banner ? 'Edit Banner' : 'Add New Banner'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Banner Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            disabled={isUploading}
                        />
                        {formData.image_url && (
                            <img
                                src={formData.image_url}
                                alt="Preview"
                                className="mt-2 w-full h-32 object-cover rounded"
                            />
                        )}
                        {isUploading && <p className="text-blue-400 text-sm mt-2">Uploading...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Link URL (optional)</label>
                        <input
                            type="url"
                            value={formData.link_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Target Page</label>
                            <select
                                value={formData.target_page}
                                onChange={(e) => setFormData(prev => ({ ...prev, target_page: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="all">All Pages</option>
                                <option value="home">Home Page</option>
                                <option value="catalog">Catalog</option>
                                <option value="blog">Blog</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="top">Top</option>
                                <option value="middle">Middle</option>
                                <option value="bottom">Bottom</option>
                                <option value="sidebar">Sidebar</option>
                            </select>
                        </div>
                    </div>

                    {/* Rotation Settings */}
                    <div className="border-t border-slate-600 pt-4">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="rotation-enabled"
                                checked={formData.rotation_settings.enabled}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    rotation_settings: {
                                        ...prev.rotation_settings,
                                        enabled: e.target.checked
                                    }
                                }))}
                                className="mr-2"
                            />
                            <label htmlFor="rotation-enabled" className="text-sm font-medium text-slate-300">
                                Enable Banner Rotation
                            </label>
                        </div>

                        {formData.rotation_settings.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Rotation Interval (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.rotation_settings.interval}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            rotation_settings: {
                                                ...prev.rotation_settings,
                                                interval: parseInt(e.target.value)
                                            }
                                        }))}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Schedule</label>
                                    <select
                                        value={formData.rotation_settings.schedule}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            rotation_settings: {
                                                ...prev.rotation_settings,
                                                schedule: e.target.value
                                            }
                                        }))}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                    >
                                        <option value="always">Always</option>
                                        <option value="business_hours">Business Hours</option>
                                        <option value="weekends">Weekends Only</option>
                                        <option value="custom">Custom Schedule</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {banner ? 'Update Banner' : 'Add Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};






// --- Komponen Notifikasi ---
const Notification = ({ show, message, type }: any) => {
    const notificationStyles: any = { info: { bg: 'bg-blue-500/20', border: 'border-blue-500', icon: <Info size={20} className="text-blue-300"/> }, success: { bg: 'bg-green-500/20', border: 'border-green-500', icon: <CheckCircle size={20} className="text-green-300"/> }, warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: <AlertCircle size={20} className="text-yellow-300"/> }, error: { bg: 'bg-red-500/20', border: 'border-red-500', icon: <X size={20} className="text-red-300"/> }, };
    const style = notificationStyles[type] || notificationStyles.info;
    return (<AnimatePresence>{show && ( <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }} className={`fixed top-0 left-1/2 z-[100] p-4 rounded-lg border ${style.bg} ${style.border} text-white shadow-lg flex items-center gap-3`}> {style.icon} <span>{message}</span> </motion.div> )} </AnimatePresence>);
};




const SettingsDashboard = ({ onLogout, userId }: { onLogout: () => void; userId: string | null; }) => {
    const { data, loading: isLoading, error, reload } = useClientData(async () => {
        const [
            blogPosts,
            newsletterSubscriptions,
            settings,
            miningTasks
        ] = await Promise.all([
            dataApi.fetchData('blog_posts'),
            dataApi.fetchData('newsletter_subscriptions'),
            dataApi.getSiteSettings(),
            dataApi.getMiningTasks(),
        ]);
        return { blogPosts, newsletterSubscriptions, settings, miningTasks };
    });

    const [editingPost, setEditingPost] = useState<any>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

    const sectionRefs: any = { blog: useRef(null), newsletter: useRef(null), uploads: useRef(null), appearance: useRef(null), strategy: useRef(null), catalog: useRef(null), landing: useRef(null), gamification: useRef(null), banners: useRef(null), charitable: useRef(null), integrations: useRef(null), settings: useRef(null) };

    const showNotification = useCallback((message: any, type = 'info', duration = 4000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification(n => ({ ...n, show: false })), duration);
    }, []);
    
    const handleAction = async (action: () => Promise<any>, successMessage: string) => {
        try { await action(); showNotification(successMessage, 'success'); reload(); } 
        catch (e: any) { showNotification(e.message || 'An error occurred', 'error'); }
    };
    
    const handleSaveSettings = (newSettings: any) => handleAction(() => apiClient.saveSettings(newSettings), "Settings saved!");
    const handleDeleteBlogPost = (id: any) => handleAction(() => apiClient.deleteItem('blog_posts', id), "Blog post deleted.");
    const handleSaveBlogPost = (postData: any) => {
        handleAction(() => apiClient.saveProduct({ ...postData, table: 'blog_posts' }), "Blog post saved!").then(() => setEditingPost(null));
    };
    const handleDeleteSubscription = (id: any) => handleAction(() => apiClient.deleteItem('newsletter_subscriptions', id), "Subscription deleted.");
    
    if (isLoading) {
        return (<div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin"></div><p className="ml-4">Loading Settings...</p></div>);
    }
    
    if (error) {
        return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={20} />Failed to load settings data. Please try again later.</div></div>
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-200 font-sans">
            <Notification {...notification} />
            <Sidebar sectionRefs={sectionRefs} onLogout={onLogout} />
            <main id="admin-main-panel" className="flex-1 flex flex-col overflow-x-hidden">
                 <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div ref={sectionRefs.blog} className="mb-16"><BlogManagement posts={data?.blogPosts || []} onSave={handleSaveBlogPost} onDelete={handleDeleteBlogPost} editingPost={editingPost} setEditingPost={setEditingPost} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.newsletter} className="mb-16"><NewsletterView subscriptions={data?.newsletterSubscriptions || []} onDeleteSubscription={handleDeleteSubscription} /></div>
                    <div ref={sectionRefs.uploads} className="mb-16"><UploadManager uploads={data?.uploads || []} onUpload={(files: any) => {}} onDelete={(id: any) => {}} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.appearance} className="mb-16"><SiteAppearancePage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.strategy} className="mb-16"><DigitalStrategyImagesPage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.catalog} className="mb-16"><ProfessionalCatalogImageManager settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.landing} className="mb-16"><LandingPageManager settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.gamification} className="mb-16"><AdvancedGamificationManager settings={{...data?.settings || {}, miningTasks: data?.miningTasks || []}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.banners} className="mb-16"><EnhancedBannerRotationManager settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.charitable} className="mb-16"><CharitableDonationSettings settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} isAdminMode={true} /></div>
                    <div ref={sectionRefs.integrations} className="mb-16"><IntegrationsPage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.settings} className="mb-16"><GlobalSettingsPage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} miningTasks={data?.settings?.miningTasks || []} onUpdateMiningTasks={()=>{}} uploadFileToCPanel={uploadFileToCPanel} /></div>
                </div>
                 <footer className="p-4 bg-slate-800 border-t border-slate-700 text-center text-sm text-slate-400 flex-shrink-0">HostVoucher Admin Panel © {new Date().getFullYear()}</footer>
            </main>
        </div>
    );
}


// =================================================================================
// BAGIAN 3: KOMPONEN UTAMA HALAMAN (ORKESTRATOR)
// =================================================================================
export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [loadingAuthState, setLoadingAuthState] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!auth) { setLoadingAuthState(false); return; }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email!)) {
                setUser(currentUser); setIsAuthorized(true);
            } else {
                setUser(null); setIsAuthorized(false); if (currentUser) { signOut(auth); }
            }
            setLoadingAuthState(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); setAuthError(null);
        if (!AUTHORIZED_EMAILS.includes(email)) { setAuthError("This email is not authorized for admin access."); return; }
        try { await signInWithEmailAndPassword(auth, email, password); } 
        catch (err: any) { setAuthError("Login failed. Please check your email and password."); }
    };
    
    const handleLogout = async () => {
        if (!auth) return;
        try { await signOut(auth); setUser(null); setIsAuthorized(false); setEmail(''); setPassword(''); } 
        catch (error) { setAuthError("Failed to log out."); }
    };

    if (loadingAuthState) {
        return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin"></div><p className="ml-4">Authenticating...</p></div>;
    }

    if (!isAuthorized) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md mx-auto p-8 border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-500/10 bg-slate-800/50 backdrop-blur-sm">
              <div className="text-center mb-8"><h2 className="text-3xl font-bold text-white mb-2">HostVoucher Settings</h2><p className="text-slate-400">Secure Access</p></div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div><label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition" placeholder="admin@hostvoucher.com" /></div>
                <div><label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition" placeholder="••••••••" /></div>
                {authError && <p className="text-red-400 text-center text-sm">{authError}</p>}
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-transform transform hover:scale-105">Login</button>
              </form>
            </div>
          </div>
        );
    }
    
    return <SettingsDashboard onLogout={handleLogout} userId={user?.uid || null} />;
}
