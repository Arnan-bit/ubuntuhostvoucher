
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

// --- Third-Party Libraries ---
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Link2, Menu, X, Trash2, ExternalLink, Edit, Save,
    Shield, Crown, Rocket, Image as ImageIcon,
    Search, Settings, MessageSquare, Zap, CheckCircle, LogOut,
    Trophy, Star, ChevronLeft, ChevronRight, Info, Mail, Send, UploadCloud, Brush, DollarSign, AlertCircle, Clock, Gem, Medal, Lock,
    Palette, Plus, Users as UsersIcon, Newspaper, BookOpen, Copy, Award, MinusCircle
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

// This is the NEW, UNIFIED upload function that uses the Next.js API Route.
const uploadFileToNextAPI = async (file: File, showNotification: Function): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // We now use our local API endpoint.
        const response = await fetch('http://localhost:8800/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Upload failed due to a server error.');
        }

        showNotification('File uploaded successfully!', 'success');
        return result.url;

    } catch (error: any) {
        console.error('Next.js API Upload Error:', error);
        showNotification(`Upload failed: ${error.message}`, 'error');
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
        { id: 'mining', label: 'Mining Activities', icon: Gem },
        { id: 'blog', label: 'Manage Blog', icon: BookOpen },
        { id: 'newsletter', label: 'Newsletter', icon: Newspaper },
        { id: 'appearance', label: 'Site Appearance', icon: Brush },
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


// --- Komponen Manajemen Blog ---
const BlogManagement = ({ posts, onSave, onDelete, editingPost, setEditingPost, showNotification }: any) => {
    const handleAddNew = () => setEditingPost({ id: null, title: '', content: '', image_url: '', image_hint: '' });
    const handleEdit = (post: any) => setEditingPost(post);
    if (editingPost) { return <BlogEditor existingPost={editingPost} onSave={onSave} onCancel={() => setEditingPost(null)} showNotification={showNotification} />; }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold text-white">Manage Blog</h2><button onClick={handleAddNew} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 flex items-center gap-2"><PlusCircle size={18} /> New Post</button></div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800"><tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Created At</th><th className="px-6 py-3">Actions</th></tr></thead>
                    <tbody>{(posts || []).map((post: any) => (
                        <tr key={post.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3"><Image src={post.image_url || 'https://placehold.co/40x40.png'} alt={post.title} width={40} height={40} className="w-10 h-10 rounded-md object-cover"/>{post.title}</td>
                            <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 flex items-center gap-2"><button onClick={() => handleEdit(post)} className="p-2 rounded-md hover:bg-slate-600 text-yellow-400"><Edit size={16} /></button><button onClick={() => onDelete(post.id)} className="p-2 rounded-md hover:bg-slate-600 text-red-400"><Trash2 size={16} /></button></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

// --- Komponen Editor Blog ---
const BlogEditor = ({ existingPost, onSave, onCancel, showNotification }: any) => {
    const [post, setPost] = useState(existingPost);
    const [isUploading, setIsUploading] = useState(false);
    const handleChange = (e: any) => setPost((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return; setIsUploading(true);
        try { const url = await uploadFileToNextAPI(file, showNotification); setPost((prev: any) => ({ ...prev, image_url: url })); } 
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

// --- Komponen Tampilan Newsletter ---
const NewsletterView = ({ subscriptions, onDeleteSubscription }: any) => {
    return (
        <div className="space-y-6"><h2 className="text-3xl font-bold text-white">Newsletter Subscriptions ({subscriptions?.length || 0})</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800"><tr><th className="px-6 py-3">Email</th><th className="px-6 py-3">Subscription Date</th><th className="px-6 py-3">Actions</th></tr></thead>
                    <tbody>{(subscriptions || []).map((sub: any) => (
                        <tr key={sub.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-medium text-white">{sub.email}</td>
                            <td className="px-6 py-4">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4"><button onClick={() => onDeleteSubscription(sub.id)} className="p-2 rounded-md hover:bg-slate-600 text-red-400"><Trash2 size={16} /></button></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

// --- Komponen Halaman Tampilan Situs ---
const SiteAppearancePage = ({ settings, onSave, showNotification }: any) => {
    const [localSettings, setLocalSettings] = useState(settings || {});
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [activeBannerPage, setActiveBannerPage] = useState('home');

    const strategySectionLabels = [
        "Build a Digital Foundation",
        "Master the WordPress Platform",
        "Run Full-Scale Applications",
        "Build Professional Credibility",
        "Fortify Your Digital Assets"
    ];

    const pageOptions = [
        { value: 'home', label: 'Home Page' },
        { value: 'web-hosting', label: 'Web Hosting Page' },
        { value: 'wordpress-hosting', label: 'WordPress Hosting Page' },
        { value: 'cloud-hosting', label: 'Cloud Hosting Page' },
        { value: 'vps', label: 'VPS Page' },
        { value: 'vpn', label: 'VPN Page' },
        { value: 'domain', label: 'Domain Page' },
        { value: 'coupons', label: 'Coupons/Vouchers Page' },
    ];
    
    const timeIntervalOptions = [
        { value: 8000, label: '8 Seconds' },
        { value: 86400000, label: '24 Hours' },
        { value: 172800000, label: '2 Days' },
        { value: 2592000000, label: '1 Month' },
        { value: 31536000000, label: '1 Year' },
    ];

    useEffect(() => {
        // Deep merge to avoid losing nested properties
        const mergedSettings = {
            ...settings,
            site_appearance: { ...settings.site_appearance },
            page_banners: { ...settings.page_banners },
            popup_modal: { ...settings.popup_modal },
        };
        setLocalSettings(mergedSettings);
    }, [settings]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, subField?: string | number) => {
        const file = event.target.files?.[0]; if (!file) return;
        setIsUploading(`${fieldName}-${subField}`);
        try {
            const url = await uploadFileToNextAPI(file, showNotification);
            setLocalSettings((prev: any) => {
                const newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
                let appearance = newSettings.site_appearance || {};
                
                if (fieldName === 'strategySectionImages') {
                    if (!appearance.strategySectionImages) {
                        appearance.strategySectionImages = [];
                    }
                    appearance.strategySectionImages[subField as number] = url;
                } else if (fieldName === 'popupImages') {
                     if (!newSettings.popup_modal) newSettings.popup_modal = {};
                     if (!newSettings.popup_modal.images) newSettings.popup_modal.images = [];
                     newSettings.popup_modal.images[subField as number] = url;
                }
                else {
                    appearance[fieldName] = url;
                }
                newSettings.site_appearance = appearance;
                return newSettings;
            });
        } catch (error) { console.error(error); } 
        finally { setIsUploading(null); }
    };
    
    const handleBannerImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, page: string, index: number) => {
        const file = event.target.files?.[0]; if (!file) return;
        setIsUploading(`banner-${page}-${index}`);
         try {
            const url = await uploadFileToNextAPI(file, showNotification);
            setLocalSettings((prev: any) => {
                const newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
                const banners = newSettings.page_banners || {};
                const pageBanners = banners[page] || { slides: [], rotationInterval: 8000 };
                const newSlides = [...pageBanners.slides];
                
                while (newSlides.length <= index) {
                   newSlides.push({ imageUrl: '', title: '', subtitle: '', buttonText: '', buttonLink: '' });
                }
                newSlides[index] = { ...newSlides[index], imageUrl: url };
                
                pageBanners.slides = newSlides;
                banners[page] = pageBanners;
                newSettings.page_banners = banners;

                return newSettings;
            });
        } catch (error) { console.error(error); } 
        finally { setIsUploading(null); }
    };
    
     const handleBannerDataChange = (page: string, field: string, value: any, slideIndex?: number) => {
        setLocalSettings((prev: any) => {
            const newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
            const banners = newSettings.page_banners || {};
            const pageBanners = banners[page] || { slides: [], rotationInterval: 8000 };

            if (field === 'rotationInterval') {
                 pageBanners.rotationInterval = parseInt(value, 10);
            } else if (slideIndex !== undefined) {
                 const newSlides = [...pageBanners.slides];
                 while (newSlides.length <= slideIndex) {
                    newSlides.push({ imageUrl: '', title: '', subtitle: '', buttonText: '', buttonLink: '' });
                }
                newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value };
                pageBanners.slides = newSlides;
            }
            
            banners[page] = pageBanners;
            newSettings.page_banners = banners;
            return newSettings;
        });
    };
    
    const handleSave = () => { onSave(localSettings); };
    
    const currentBannerConfig = localSettings.page_banners?.[activeBannerPage] || { slides: [], rotationInterval: 8000 };
    const siteAppearance = localSettings.site_appearance || {};
    const popupModal = localSettings.popup_modal || {};

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Site Appearance</h2>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 space-y-8">
                 {/* --- Brand, Hero & Profile Images --- */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Brand & Profile</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Brand Logo</label>
                                <input type="file" onChange={e => handleImageUpload(e, 'brandLogoUrl')} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                {isUploading === 'brandLogoUrl-undefined' && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                {siteAppearance.brandLogoUrl && <Image src={siteAppearance.brandLogoUrl} alt="Logo Preview" width={180} height={40} className="mt-2 rounded-md object-contain bg-slate-700 p-1" />}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Specialist Profile Photo</label>
                                <input type="file" onChange={e => handleImageUpload(e, 'specialistImageUrl')} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                {isUploading === 'specialistImageUrl-undefined' && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                {siteAppearance.specialistImageUrl && <Image src={siteAppearance.specialistImageUrl} alt="Specialist Preview" width={100} height={100} className="mt-2 rounded-full object-cover" />}
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-4">Promotional Images</h3>
                         <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Homepage Hero Background</label>
                                <input type="file" onChange={e => handleImageUpload(e, 'heroBackgroundImageUrl')} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                {isUploading === 'heroBackgroundImageUrl-undefined' && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                {siteAppearance.heroBackgroundImageUrl && <Image src={siteAppearance.heroBackgroundImageUrl} alt="Hero BG Preview" width={200} height={100} className="mt-2 rounded-md object-cover" />}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Floating Offer Image</label>
                                <input type="file" onChange={e => handleImageUpload(e, 'floatingPromoUrl')} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                {isUploading === 'floatingPromoUrl-undefined' && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                {siteAppearance.floatingPromoUrl && <Image src={siteAppearance.floatingPromoUrl} alt="Floating Promo Preview" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-4">Popup Modal Images</h3>
                        <div className="space-y-4">
                             {[0, 1].map(index => (
                                 <div key={`popup-${index}`}>
                                     <label className="block text-sm font-medium text-slate-300 mb-2">Popup Image {index + 1}</label>
                                    <input type="file" onChange={e => handleImageUpload(e, 'popupImages', index)} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                    {isUploading === `popupImages-${index}` && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                    {popupModal.images?.[index] && <Image src={popupModal.images[index]} alt={`Popup ${index+1}`} width={100} height={100} className="mt-2 rounded-md object-cover" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-8">
                    <h3 className="text-xl font-semibold mb-4">Strategy Section Images</h3>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {strategySectionLabels.map((label, index) => (
                             <div key={index}>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                                <input type="file" onChange={e => handleImageUpload(e, 'strategySectionImages', index)} disabled={!!isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                {isUploading === `strategySectionImages-${index}` && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                {siteAppearance.strategySectionImages?.[index] && <Image src={siteAppearance.strategySectionImages[index]} alt={`${label} Preview`} width={200} height={100} className="mt-2 rounded-md object-cover" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-8">
                     <h3 className="text-xl font-semibold mb-4">Page Banners</h3>
                     <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <SelectField label="Select Page to Edit Banners" options={pageOptions} value={activeBannerPage} onChange={(e:any) => setActiveBannerPage(e.target.value)} />
                        <SelectField label="Rotation Interval" options={timeIntervalOptions} value={currentBannerConfig.rotationInterval} onChange={(e:any) => handleBannerDataChange(activeBannerPage, 'rotationInterval', e.target.value)} />
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map(index => (
                            <div key={index} className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-sm">Banner Slot {index + 1}</h4>
                                 <div>
                                    <label className="text-xs font-medium text-slate-300">Image</label>
                                    <input type="file" onChange={e => handleBannerImageUpload(e, activeBannerPage, index)} disabled={!!isUploading} className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                                    {isUploading === `banner-${activeBannerPage}-${index}` && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                                    {currentBannerConfig.slides?.[index]?.imageUrl && <Image src={currentBannerConfig.slides[index].imageUrl} alt={`Banner ${index+1}`} width={200} height={100} className="mt-2 rounded-md object-cover" />}
                                </div>
                                 <div>
                                    <label className="text-xs font-medium text-slate-300">Title</label>
                                    <input type="text" value={currentBannerConfig.slides?.[index]?.title || ''} onChange={e => handleBannerDataChange(activeBannerPage, 'title', e.target.value, index)} className="w-full text-xs bg-slate-600 border border-slate-500 rounded-md px-2 py-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-300">Subtitle</label>
                                    <input type="text" value={currentBannerConfig.slides?.[index]?.subtitle || ''} onChange={e => handleBannerDataChange(activeBannerPage, 'subtitle', e.target.value, index)} className="w-full text-xs bg-slate-600 border border-slate-500 rounded-md px-2 py-1" />
                                </div>
                                 <div>
                                    <label className="text-xs font-medium text-slate-300">Button Text</label>
                                    <input type="text" value={currentBannerConfig.slides?.[index]?.buttonText || ''} onChange={e => handleBannerDataChange(activeBannerPage, 'buttonText', e.target.value, index)} className="w-full text-xs bg-slate-600 border border-slate-500 rounded-md px-2 py-1" />
                                </div>
                                 <div>
                                    <label className="text-xs font-medium text-slate-300">Button Link</label>
                                    <input type="text" value={currentBannerConfig.slides?.[index]?.buttonLink || ''} onChange={e => handleBannerDataChange(activeBannerPage, 'buttonLink', e.target.value, index)} className="w-full text-xs bg-slate-600 border border-slate-500 rounded-md px-2 py-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="flex justify-end pt-4"><button onClick={handleSave} disabled={!!isUploading} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 disabled:opacity-50">{isUploading ? "Uploading..." : "Save Appearance Settings"}</button></div>
            </div>
        </div>
    );
};


// --- Komponen Halaman Integrasi ---
const IntegrationsPage = ({ settings, onSave, showNotification }: any) => {
    const [currentSettings, setCurrentSettings] = useState(settings || {});
    const handleSave = () => onSave(currentSettings);
    const handleChange = (e: any) => setCurrentSettings((p: any) => ({...p, [e.target.name]: e.target.value}));
    return (
        <div className="space-y-6"><h2 className="text-3xl font-bold text-white">Integrations</h2>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 space-y-4">
                <InputField label="Google Analytics ID (G-XXXX)" name="ga_id" value={currentSettings.ga_id || ''} onChange={handleChange}/>
                <InputField label="Facebook Pixel ID" name="fb_pixel_id" value={currentSettings.fb_pixel_id || ''} onChange={handleChange}/>
                <button onClick={handleSave} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">Save Integrations</button>
            </div>
        </div>
    );
};

// --- Komponen Halaman Pengaturan Global ---
const GlobalSettingsPage = ({ settings, onSave, showNotification }: any) => {
    const [localSettings, setLocalSettings] = useState(settings || {});
    const handleSave = () => onSave(localSettings);
    const handleSwitchChange = (name: string, checked: boolean) => {
        setLocalSettings((prev: any) => {
            const newSettings = {...prev, [name]: checked};
            onSave(newSettings); // Save immediately on toggle
            return newSettings;
        });
    }
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setLocalSettings((prev: any) => ({ ...prev, [name]: value }));
    };

     useEffect(() => {
        setLocalSettings(settings || {});
    }, [settings]);

    return (
        <div className="space-y-6"><h2 className="text-3xl font-bold text-white">Global Settings</h2>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 space-y-4">
                 <div className="flex items-center gap-4">
                    <Switch id="require_eth_address" name="require_eth_address" checked={!!localSettings.require_eth_address} onCheckedChange={(c) => handleSwitchChange('require_eth_address', c)}/>
                    <label htmlFor="require_eth_address" className="text-sm font-medium text-slate-300 cursor-pointer">
                        Require ETH Wallet for Activation
                    </label>
                </div>
                 <div className="flex items-center gap-4">
                     <Switch id="nft_exchange_active" name="nft_exchange_active" checked={!!localSettings.nft_exchange_active} onCheckedChange={(c) => handleSwitchChange('nft_exchange_active', c)}/>
                    <label htmlFor="nft_exchange_active" className="text-sm font-medium text-slate-300 cursor-pointer">
                        Enable NFT Redemption
                    </label>
                </div>
                 <div className="flex items-center gap-4">
                    <Switch id="idle_sound_enabled" name="idle_sound_enabled" checked={!!localSettings.idle_sound?.enabled} onCheckedChange={(c) => setLocalSettings((p:any) => ({...p, idle_sound: {...p.idle_sound, enabled:c}}))}/>
                    <label htmlFor="idle_sound_enabled" className="text-sm font-medium text-slate-300 cursor-pointer">
                        Enable Idle User Sound Notification
                    </label>
                </div>
                <InputField label="Idle Sound URL (.mp3)" name="idle_sound_url" value={localSettings.idle_sound?.url || ''} onChange={(e: any) => setLocalSettings((p:any) => ({...p, idle_sound: {...p.idle_sound, url: e.target.value}}))} disabled={!localSettings.idle_sound?.enabled}/>
                <InputField label="Catalog Number Prefix" name="catalog_number_prefix" value={localSettings.catalog_number_prefix || 'HV'} onChange={handleChange}/>
                <button onClick={handleSave} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">Save Global Settings</button>
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

const MiningActivitiesPage = ({ miningTasks, onSave, onDelete, showNotification }: any) => {
    const [editingTask, setEditingTask] = useState<any>(null);
    const initialNewTaskState = { name: '', description: '', points: 0, link: '', icon: 'Link', enabled: true };

    const handleSaveTask = (task: any) => {
        onSave(task);
        setEditingTask(null); // Close form after saving
    };
    
    const handleToggleEnabled = (task: any) => {
        onSave({ ...task, enabled: !task.enabled });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Mining Activities</h2>
                <button onClick={() => setEditingTask(initialNewTaskState)} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 flex items-center gap-2">
                    <PlusCircle size={18} /> New Task
                </button>
            </div>

            {editingTask && (
                <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 space-y-4">
                    <h3 className="text-xl font-bold text-white">{editingTask.id ? 'Edit Task' : 'Create New Task'}</h3>
                    <InputField label="Task Name" value={editingTask.name} onChange={(e: any) => setEditingTask({ ...editingTask, name: e.target.value })} />
                    <InputField label="Description" value={editingTask.description} onChange={(e: any) => setEditingTask({ ...editingTask, description: e.target.value })} />
                    <InputField label="Points" type="number" value={editingTask.points} onChange={(e: any) => setEditingTask({ ...editingTask, points: parseInt(e.target.value, 10) || 0 })} />
                    <InputField label="Link" type="url" value={editingTask.link} onChange={(e: any) => setEditingTask({ ...editingTask, link: e.target.value })} />
                    <InputField label="Icon (Lucide Name)" value={editingTask.icon} onChange={(e: any) => setEditingTask({ ...editingTask, icon: e.target.value })} />
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setEditingTask(null)} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg">Cancel</button>
                        <button onClick={() => handleSaveTask(editingTask)} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg">Save Task</button>
                    </div>
                </div>
            )}
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                        <tr>
                            <th className="px-6 py-3">Task</th>
                            <th className="px-6 py-3">Points</th>
                            <th className="px-6 py-3">Enabled</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(miningTasks || []).map((task: any) => (
                            <tr key={task.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-white">{task.name}</td>
                                <td className="px-6 py-4 text-yellow-400 font-bold">{task.points.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <Switch checked={task.enabled} onCheckedChange={() => handleToggleEnabled(task)} />
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => setEditingTask(task)} className="p-2 rounded-md hover:bg-slate-600 text-yellow-400"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(task.id)} className="p-2 rounded-md hover:bg-slate-600 text-red-400"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const SettingsDashboard = ({ onLogout, userId }: { onLogout: () => void; userId: string | null; }) => {
    const { data, loading: isLoading, error, reload } = useClientData(async () => {
        const [
            blogPosts, 
            newsletterSubscriptions, 
            settings,
            miningTasks,
        ] = await Promise.all([
            dataApi.fetchData('blog_posts'),
            dataApi.fetchData('newsletter_subscriptions'),
            dataApi.getSiteSettings(),
            dataApi.fetchData('mining_tasks'),
        ]);
        return { blogPosts, newsletterSubscriptions, settings, miningTasks };
    });

    const [editingPost, setEditingPost] = useState<any>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

    const sectionRefs: any = { mining: useRef(null), blog: useRef(null), newsletter: useRef(null), appearance: useRef(null), integrations: useRef(null), settings: useRef(null) };

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
    const handleSaveMiningTask = (taskData: any) => {
        handleAction(() => apiClient.saveProduct({ ...taskData, table: 'mining_tasks' }), "Mining task saved!");
    };
    const handleDeleteMiningTask = (id: any) => handleAction(() => apiClient.deleteItem('mining_tasks', id), "Mining task deleted.");
    
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
                    <div ref={sectionRefs.mining} className="mb-16"><MiningActivitiesPage miningTasks={data?.miningTasks || []} onSave={handleSaveMiningTask} onDelete={handleDeleteMiningTask} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.blog} className="mb-16"><BlogManagement posts={data?.blogPosts || []} onSave={handleSaveBlogPost} onDelete={handleDeleteBlogPost} editingPost={editingPost} setEditingPost={setEditingPost} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.newsletter} className="mb-16"><NewsletterView subscriptions={data?.newsletterSubscriptions || []} onDeleteSubscription={handleDeleteSubscription} /></div>
                    <div ref={sectionRefs.appearance} className="mb-16"><SiteAppearancePage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.integrations} className="mb-16"><IntegrationsPage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.settings} className="mb-16"><GlobalSettingsPage settings={data?.settings || {}} onSave={handleSaveSettings} showNotification={showNotification} /></div>
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
