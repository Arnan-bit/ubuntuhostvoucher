// src/app/admin/AdminComponents.tsx
'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getBadgesForUser } from '@/lib/utils';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { CampaignManager } from '@/components/admin/CampaignManager';
import {
    LayoutDashboard, ShoppingBag, PlusCircle, Link2, BarChart3, Menu, X, Trash2, ExternalLink, Edit, Save,
    Shield, Server, Cloud, Power, Sparkles, BrainCircuit, Share2, Image as ImageIcon,
    Search, Filter, Calendar, TrendingUp, Settings, MessageSquare, Zap, CheckCircle, LogOut,
    Trophy, Star, Info, Mail, UploadCloud, Brush, AlertCircle, Gem, Medal, Lock,
    BookOpen, Users, Copy, Award, Crown, Rocket, DollarSign, Target, Plus, Upload
} from 'lucide-react';
import { badgeTiers } from '@/lib/data';
import { CurrencyRatesUpdater } from '@/app/admin/components/CurrencyRatesUpdater';
import { CharitableDonationSettings } from '@/components/charity/CharitableDonationSettings';

// =================================================================================
// SECTION 1: UTILITIES & HELPERS
// =================================================================================
const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return "N/A";
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD',
        }).format(amount);
    } catch (e) { return `USD ${amount.toFixed(2)}`; }
};

const generateSlug = () => Math.random().toString(36).substring(2, 8);
const EMOJIS = ['🚀', '💼', '💻', '☁️', '🌐', '🎁', '📦', '🔧', '💡', '📈'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#f44336', '#e91e63', '#9c27b0'];


// =================================================================================
// SECTION 2: UI COMPONENTS (Building Blocks)
// =================================================================================
export const InputField = React.memo(({ label, className, ...props }: any) => (<div className={className}><label className="block text-sm font-medium text-slate-300 mb-2">{label}</label><input {...props} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" /></div>));
export const SelectField = React.memo(({ label, options, ...props }: any) => (<div><label className="block text-sm font-medium text-slate-300 mb-2">{label}</label><select {...props} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500">{options.map((o: any) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}</select></div>));
export const StatCard = React.memo(({ icon: Icon, title, value, subValue }: any) => (<div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex items-start gap-4 transition-all hover:bg-slate-800 hover:border-indigo-500"><div className="p-3 bg-slate-700 rounded-lg"><Icon className="text-indigo-400" size={24} /></div><div><p className="text-sm text-slate-400">{title}</p><p className="text-2xl font-bold text-white truncate">{value}</p>{subValue && <p className="text-xs text-slate-500">{subValue}</p>}</div></div>));
export const Paginator = ({ currentPage, totalPages, onPageChange }: any) => { /* Implementasi Paginator */ return null; };
export const Notification = ({ show, message, type }: any) => {
    const notificationStyles: any = { info: { bg: 'bg-blue-500/20', border: 'border-blue-500', icon: <Info size={20} className="text-blue-300"/> }, success: { bg: 'bg-green-500/20', border: 'border-green-500', icon: <CheckCircle size={20} className="text-green-300"/> }, warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: <AlertCircle size={20} className="text-yellow-300"/> }, error: { bg: 'bg-red-500/20', border: 'border-red-500', icon: <X size={20} className="text-red-300"/> }, };
    const style = notificationStyles[type] || notificationStyles.info;
    return (<AnimatePresence>{show && ( <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }} className={`fixed top-0 left-1/2 z-[100] p-4 rounded-lg border ${style.bg} ${style.border} text-white shadow-lg flex items-center gap-3`}> {style.icon} <span>{message}</span> </motion.div> )} </AnimatePresence>);
};


// =================================================================================
// SECTION 3: LAYOUT COMPONENTS
// =================================================================================

export const AdminSidebar = React.memo(({ sectionRefs, onAddNew, onLogout }: any) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleNavigation = (page: any) => {
        sectionRefs[page].current?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Visitor Analytics', icon: BarChart3 },
        { id: 'campaigns', label: 'Marketing Campaigns', icon: Target },
        { id: 'templates', label: 'Website Templates', icon: BookOpen },
        { id: 'email-marketing', label: 'Email Marketing', icon: Mail },
        { id: 'nft-gamification', label: 'NFT Gamification', icon: Gem },
        { id: 'catalog-colors', label: 'Catalog Colors', icon: Brush },
        { id: 'floating-promo', label: 'Floating Promo', icon: Sparkles },
        { id: 'gamification', label: 'User Gamification', icon: Users },
        { id: 'catalog', label: 'Catalog', icon: ShoppingBag },
        { id: 'add', label: 'Add/Edit', icon: PlusCircle },
        { id: 'testimonials', label: 'Manage Testimonials', icon: MessageSquare },
        { id: 'requests', label: 'User Requests', icon: Mail },
    ];
    const NavList = () => (<nav><ul>{navItems.map(item => (<li key={item.id}><a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}><item.icon size={20} /><span>{item.label}</span></a></li>))}<li><Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700/50 text-slate-300"><Settings size={20} /><span>Go to Settings</span></Link></li><li key="logout"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-800/50 text-red-400"><LogOut size={20} /><span>Logout</span></button></li></ul></nav>);
    return (<><aside className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 sticky top-0 h-screen hidden md:flex md:flex-col"><div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0"><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Link2 /> HostVoucher</h1></div><div className="p-4 overflow-y-auto flex-grow"><button onClick={onAddNew} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 mb-4"><PlusCircle size={20} /><span>Add New Catalog</span></button><NavList /></div></aside><header className="md:hidden sticky top-0 z-40 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center"><h1 className="text-xl font-bold text-white flex items-center gap-2"><Link2 /> HostVoucher</h1><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">{mobileMenuOpen ? <X/> : <Menu/>}</button></header><AnimatePresence>{mobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-800 border-b border-slate-700 p-4"><button onClick={onAddNew} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 mb-4"><PlusCircle size={20} /><span>Add New Catalog</span></button><NavList /></motion.div>)}</AnimatePresence></>);
});

export const SettingsSidebar = React.memo(({ sectionRefs, onLogout }: any) => {
    // Implementasi SettingsSidebar di sini...
    return <div></div>
});


// =================================================================================
// SECTION 4: VIEW COMPONENTS (Feature Panels)
// =================================================================================
const AdminGamificationDisplay = () => {
    const [adminPoints, setAdminPoints] = useState(0);
    const [coinAnimations, setCoinAnimations] = useState<any[]>([]);
    const [highestBadge, setHighestBadge] = useState<any>(null);
    const lastPointsRef = useRef(0);

    const triggerCoinAnimation = useCallback(() => {
        const newCoins = Array.from({ length: 5 }).map((_, i) => ({ id: Date.now() + i, style: { left: `${Math.random() * 80 + 10}%`, animationDelay: `${Math.random() * 0.5}s`, '--throw-x': `${(Math.random() - 0.5) * 400}px`, '--throw-y': `${(Math.random() - 0.8) * -300}px`, } as React.CSSProperties }));
        setCoinAnimations(prev => [...prev, ...newCoins]);
        setTimeout(() => { setCoinAnimations(prev => prev.slice(newCoins.length)); }, 2000);
    }, []);

    const findHighestBadge = (points: number) => {
        let allBadges: any[] = [];
        Object.values(badgeTiers).forEach((tier: any) => {
            if (Array.isArray(tier)) {
                allBadges = [...allBadges, ...tier.filter((b: any) => b.threshold)];
            }
        });
        allBadges.sort((a, b) => b.threshold - a.threshold);
        return allBadges.find(badge => points >= badge.threshold) || null;
    };


    useEffect(() => {
        const updateState = () => {
            const storedPoints = parseInt(localStorage.getItem('adminPoints') || '0', 10);
            if (storedPoints > lastPointsRef.current) {
                triggerCoinAnimation();
            }
            lastPointsRef.current = storedPoints;
            setAdminPoints(storedPoints);
            setHighestBadge(findHighestBadge(storedPoints));
        };
        updateState();
        window.addEventListener('storage', updateState);
        return () => window.removeEventListener('storage', updateState);
    }, [triggerCoinAnimation]);

    const BadgeIcon = highestBadge ? highestBadge.Icon : null;

    return (
        <div className="relative mb-4 text-center">
             <div className="relative inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-700" style={{ perspective: '1000px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-xl"></div>
                {coinAnimations.map(coin => (
                    <div key={coin.id} className="absolute text-3xl" style={coin.style}>
                        <div className="animate-[coin-throw_1s_ease-out_forwards]">
                            <div className="animate-[coin-spin_0.5s_linear_infinite] text-yellow-400">💰</div>
                        </div>
                    </div>
                ))}
                 <div className="relative flex items-center gap-4">
                    {BadgeIcon && (
                         <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${highestBadge.bg}`}>
                            <BadgeIcon size={20} className={highestBadge.color} />
                            <span className={`font-bold text-sm ${highestBadge.color}`}>{highestBadge.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-8 h-8 text-yellow-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }}/>
                        <span className="text-4xl font-bold tracking-tighter bg-gradient-to-b from-yellow-300 to-amber-500 text-transparent bg-clip-text" style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.4)' }}>
                            {adminPoints.toLocaleString('en-US')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const DashboardView = ({ products, clickEvents, achievements, showNotification }: any) => {
    const stats = useMemo(() => {
        const totalClicks = clickEvents.length;
        const productsWithClicks = products.map((p: any) => ({
            ...p,
            clicks: clickEvents.filter((e: any) => e.product_id === p.id).length
        }));

        const topProduct = [...productsWithClicks].sort((a,b) => b.clicks - a.clicks)[0];

        return {
            totalLinks: products.length,
            totalClicks,
            topProduct: topProduct,
            uniqueVisitors: new Set(clickEvents.map(e => e.ip_address)).size
        };
    }, [products, clickEvents]);

    const barChartData = useMemo(() =>
        [...products]
            .map(p => ({...p, clicks: clickEvents.filter((e:any) => e.product_id === p.id).length }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 7)
            .map(p => ({ name: (p.name || p.title || 'N/A').slice(0, 15) + '...', Clicks: p.clicks || 0 })),
    [products, clickEvents]);

    const pieChartData = useMemo(() => {
        const clicksByType = clickEvents.reduce((acc: any, event: any) => {
            const product = products.find((p:any) => p.id === event.product_id);
            const type = product?.type || 'Uncategorized';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(clicksByType).map(([name, value]: any) => ({ name, value }));
    }, [clickEvents, products]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                 <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                 <AdminGamificationDisplay />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={ShoppingBag} title="Total Catalogs" value={stats.totalLinks} />
                <StatCard icon={BarChart3} title="Total Clicks" value={stats.totalClicks} />
                <StatCard icon={TrendingUp} title="Unique Visitors" value={stats.uniqueVisitors} />
                <StatCard icon={Sparkles} title="Top Product" value={stats.topProduct ? (stats.topProduct.name || stats.topProduct.title) : 'N/A'} subValue={stats.topProduct ? `${stats.topProduct.clicks || 0} clicks` : ''} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Product Performance (Top 7)</h3>
                    {barChartData.length > 0 ? (<ResponsiveContainer width="100%" height={300}><BarChart data={barChartData}><CartesianGrid strokeDasharray="3 3" stroke="#475569" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={12} interval={0} angle={-30} textAnchor="end" height={70} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(124, 58, 237, 0.1)'}} /><Legend /><Bar dataKey="Clicks" fill="#818cf8" /></BarChart></ResponsiveContainer>) : <div className="flex items-center justify-center h-[300px] text-slate-400">No data available.</div>}
                </div>
                <div className="lg:col-span-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Clicks by Type</h3>
                    {pieChartData.length > 0 ? (<ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} /><Legend /></PieChart></ResponsiveContainer>) : <div className="flex items-center justify-center h-[300px] text-slate-400">No data available.</div>}
                </div>
            </div>
        </div>
    );
};

// Enhanced CatalogView with Drag and Drop functionality
export const CatalogView = ({ products, onDelete, onLinkClick, onEdit, onAddNew, catalogNumberPrefix, settings, onReorder }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [draggedItem, setDraggedItem] = useState<any>(null);
    const [dragOverItem, setDragOverItem] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const itemsPerPage = 10;

    const filteredProducts = useMemo(() =>
        products.filter((p: any) =>
            (p.name?.toLowerCase() || p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.provider?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ), [products, searchTerm]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, product: any) => {
        setDraggedItem(product);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const handleDragOver = (e: React.DragEvent, product: any) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverItem(product);
    };

    const handleDragLeave = () => {
        setDragOverItem(null);
    };

    const handleDrop = (e: React.DragEvent, targetProduct: any) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.id === targetProduct.id) {
            setDraggedItem(null);
            setDragOverItem(null);
            setIsDragging(false);
            return;
        }

        // Find the indices
        const draggedIndex = products.findIndex((p: any) => p.id === draggedItem.id);
        const targetIndex = products.findIndex((p: any) => p.id === targetProduct.id);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Create new array with reordered items
        const newProducts = [...products];
        const [removed] = newProducts.splice(draggedIndex, 1);
        newProducts.splice(targetIndex, 0, removed);

        // Update display order for all items
        const updatedProducts = newProducts.map((product, index) => ({
            ...product,
            display_order: index + 1
        }));

        // Call the reorder function if provided
        if (onReorder) {
            onReorder(updatedProducts);
        }

        setDraggedItem(null);
        setDragOverItem(null);
        setIsDragging(false);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItem(null);
        setIsDragging(false);
    };

    const TableView = () => (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                    <tr>
                        <th className="px-2 py-3">🔄</th>
                        <th className="px-6 py-3">Catalog No.</th>
                        <th className="px-6 py-3">Name/Title</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Price (USD)</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3">Landing</th>
                        <th className="px-6 py-3">Clicks</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product: any) => (
                        <tr
                            key={product.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, product)}
                            onDragOver={(e) => handleDragOver(e, product)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, product)}
                            onDragEnd={handleDragEnd}
                            className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 cursor-move ${
                                draggedItem?.id === product.id ? 'opacity-50 bg-blue-900/20' : ''
                            } ${
                                dragOverItem?.id === product.id ? 'bg-green-900/20 border-green-500' : ''
                            }`}
                        >
                            <td className="px-2 py-4 text-slate-500">
                                <div className="flex flex-col gap-1">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{`${catalogNumberPrefix}${product.catalog_number}`}</td>
                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center gap-3">
                                {product.provider_logo ? (
                                    <Image src={product.provider_logo} alt={product.provider} width={32} height={32} className="w-8 h-8 object-contain" />
                                ) : product.image ? (
                                    <Image src={product.image} alt={product.name} width={32} height={32} className="w-8 h-8 rounded-md object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-slate-500">
                                        <ImageIcon size={16}/>
                                    </div>
                                )}
                                {product.name || product.title}
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300">
                                    {product.type || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span>{product.rating || 0}</span>
                                    <span className="text-slate-500">({product.num_reviews || 0})</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        product.show_on_landing ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
                                    }`}>
                                        {product.show_on_landing ? 'Visible' : 'Hidden'}
                                    </span>
                                    {product.show_on_landing && (
                                        <span className="text-xs text-slate-400">{product.display_style || 'vertical'}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">{product.clicks || 0}</td>
                            <td className="px-6 py-4 flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="p-2 rounded-md hover:bg-slate-600 text-yellow-400"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => onLinkClick(product)}
                                    className="p-2 rounded-md hover:bg-slate-600 text-sky-400"
                                    title="Open Link"
                                >
                                    <ExternalLink size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="p-2 rounded-md hover:bg-slate-600 text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Catalog Management</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Drag and Drop Instructions */}
            {isDragging && (
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-blue-300">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Drag and drop to reorder items on the landing page</span>
                    </div>
                </div>
            )}

            <TableView />

            {/* Pagination */}
            {Math.ceil(filteredProducts.length / itemsPerPage) > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2 text-slate-300">
                        Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / itemsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                        className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export const AddEditProductView = ({ onSave, onCancel, existingProduct, catalogNumberPrefix, showNotification, uploadFileToCPanel }: any) => {
    const initialProductState = { name: '', title: '', provider: '', type: 'Web Hosting', tier: '', price: '', original_price: '', discount: '', features: '', link: '', target_url: '', image: '', provider_logo: '', catalog_image: '', brand_logo: '', brand_logo_text: '', rating: 0, num_reviews: 0, clicks: 0, code: '', short_link: '', seo_title: '', seo_description: '', color: 'blue', button_color: 'blue', is_featured: false, show_on_landing: true, display_style: 'vertical', shake_animation: false, shake_intensity: 'normal' };
    const [product, setProduct] = useState(initialProductState);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (existingProduct) {
            setProduct({
                ...initialProductState,
                ...existingProduct,
                features: Array.isArray(existingProduct.features) ? existingProduct.features.join('\n') : (existingProduct.features || ''),
            });
        } else {
            setProduct(initialProductState);
        }
    }, [existingProduct]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'provider_logo' | 'catalog_image' | 'brand_logo') => {
        const file = event.target.files?.[0]; if (!file) return; setIsUploading(true);
        try { const url = await uploadFileToCPanel(file, showNotification); setProduct(prev => ({ ...prev, [field]: url })); }
        catch (error) { /* Error handled in helper */ }
        finally { setIsUploading(false); }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceAsNumber = parseFloat(product.price);
        const productToSave = { ...product, features: product.features.split('\n').filter(f => f.trim() !== ''), price: isNaN(priceAsNumber) ? 0 : priceAsNumber, original_price: parseFloat(product.original_price) || 0, rating: parseFloat(product.rating as any) || 0, num_reviews: parseInt(product.num_reviews as any, 10) || 0, clicks: parseInt(product.clicks as any, 10) || 0, is_featured: !!product.is_featured, show_on_landing: !!product.show_on_landing };
        onSave(productToSave);
    };

    const productTypes = ['Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'VPS', 'VPN', 'Domain', 'Voucher', 'AI Website Builder', 'Digital Product'];
    const voucherColors = ['blue', 'purple', 'red', 'green', 'indigo', 'yellow', 'orange'];
    const buttonColors = [
        {value: 'blue', label: 'Blue Gradient'},
        {value: 'orange', label: 'Orange Gradient'},
        {value: 'green', label: 'Green Gradient'},
        {value: 'red', label: 'Red Gradient'},
        {value: 'purple', label: 'Purple Gradient'},
    ];


    return (
        <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-white mb-6">{existingProduct ? 'Edit Catalog' : 'Add New Catalog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                <div className="grid md:grid-cols-2 gap-6"><InputField label="Product Name/Title" name="name" value={product.name || product.title} onChange={handleChange} required /> <InputField label="Provider" name="provider" value={product.provider} onChange={handleChange} /></div>
                <div className="grid md:grid-cols-2 gap-6"><SelectField label="Type" name="type" value={product.type} onChange={handleChange} options={productTypes} /> <InputField label="Tier (Personal, Business)" name="tier" value={product.tier} onChange={handleChange} /></div>
                <div className="grid md:grid-cols-3 gap-4"><InputField label="Price (USD)" name="price" type="number" step="0.01" value={product.price} onChange={handleChange} /><InputField label="Original Price" name="original_price" type="number" step="0.01" value={product.original_price} onChange={handleChange} /><InputField label="Discount (%)" name="discount" value={product.discount} onChange={handleChange} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Rating (0-5)</label>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setProduct(p => ({...p, rating: star}))}
                                        className={`text-2xl ${star <= (product.rating || 0) ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-300 transition-colors`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <span className="text-slate-300 ml-2">{product.rating || 0}/5</span>
                        </div>
                    </div>
                    <InputField label="Number of Reviews" name="num_reviews" type="number" min="0" value={product.num_reviews} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Target / Affiliate URL" name="target_url" type="url" value={product.target_url} onChange={handleChange} required />
                    <div className="relative">
                        <InputField label="Short Link" name="short_link" value={product.short_link} onChange={handleChange} placeholder="auto if empty" />
                        <button type="button" onClick={() => setProduct(p=>({...p, short_link: generateSlug()}))} className="absolute bottom-1 right-1 text-xs bg-slate-600 px-2 py-1 rounded">Auto</button>
                    </div>
                </div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Features (one per line)</label><textarea name="features" value={product.features} onChange={handleChange} rows={5} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"></textarea></div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Image Management</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Main Product Image</label>
                            <input type="file" onChange={e => handleImageUpload(e, 'image')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700" />
                            {product.image && <Image src={product.image} alt="Preview" width={100} height={100} className="mt-2 rounded-md" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Provider Logo</label>
                            <input type="file" onChange={e => handleImageUpload(e, 'provider_logo')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                            {product.provider_logo && <Image src={product.provider_logo} alt="Logo" width={100} height={50} className="mt-2" />}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Catalog Display Image (Optional)</label>
                            <input type="file" onChange={e => handleImageUpload(e, 'catalog_image')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700" />
                            <p className="text-xs text-slate-400 mt-1">Special image for catalog display (if different from main image)</p>
                            {product.catalog_image && <Image src={product.catalog_image} alt="Catalog Preview" width={100} height={100} className="mt-2 rounded-md" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Brand Logo</label>
                            <div className="space-y-3">
                                <input type="file" onChange={e => handleImageUpload(e, 'brand_logo')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700" />
                                <div className="text-slate-400 text-sm text-center">OR</div>
                                <InputField label="Brand Logo Text (if no image)" name="brand_logo_text" value={product.brand_logo_text} onChange={handleChange} placeholder="e.g., BRAND NAME" />
                            </div>
                            {product.brand_logo && <Image src={product.brand_logo} alt="Brand Logo" width={100} height={50} className="mt-2" />}
                            {product.brand_logo_text && !product.brand_logo && (
                                <div className="mt-2 p-2 bg-slate-700 rounded text-center text-white font-semibold">
                                    {product.brand_logo_text}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <InputField label="Voucher Code" name="code" value={product.code} onChange={handleChange} />
                    {product.type === 'Voucher' ?
                        <SelectField label="Voucher Color" name="color" value={product.color} onChange={handleChange} options={voucherColors} />
                        : <SelectField label="Button Color" name="button_color" value={product.button_color} onChange={handleChange} options={buttonColors} />
                    }
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Switch id="is_featured" checked={product.is_featured} onCheckedChange={c => setProduct(p => ({...p, is_featured: c}))} />
                        <label htmlFor="is_featured" className="text-sm font-medium text-slate-300">Featured Product (Highlight)</label>
                    </div>
                    <div className="flex items-center gap-4">
                        <Switch id="show_on_landing" checked={product.show_on_landing} onCheckedChange={c => setProduct(p => ({...p, show_on_landing: c}))} />
                        <label htmlFor="show_on_landing" className="text-sm font-medium text-slate-300">Show on Landing Page</label>
                    </div>
                    {product.show_on_landing && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Landing Page Display Style</label>
                            <select
                                name="display_style"
                                value={product.display_style || 'vertical'}
                                onChange={handleChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="vertical">Vertical Card</option>
                                <option value="horizontal">Horizontal Card</option>
                            </select>
                        </div>
                    )}

                    {/* Shake Animation Controls */}
                    <div className="border-t border-slate-600 pt-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">🎯 Sales Boost Animation (Like Lynk.id)</h4>
                        <div className="flex items-center gap-4 mb-3">
                            <Switch
                                id="shake_animation"
                                checked={product.shake_animation}
                                onCheckedChange={c => setProduct(p => ({...p, shake_animation: c}))}
                            />
                            <label htmlFor="shake_animation" className="text-sm font-medium text-slate-300">
                                Enable Shake Animation (Attracts attention for sales)
                            </label>
                        </div>
                        {product.shake_animation && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Animation Intensity</label>
                                <select
                                    name="shake_intensity"
                                    value={product.shake_intensity || 'normal'}
                                    onChange={handleChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="normal">Normal Shake (Subtle)</option>
                                    <option value="intense">Intense Shake (Eye-catching)</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-1">
                                    💡 Use intense shake for limited-time offers or high-priority products
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg">Cancel</button><button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">{isUploading ? 'Uploading...' : 'Save Product'}</button></div>
            </form>
        </div>
    );
};

const TestimonialEditor = ({ existingTestimonial, onSave, onCancel, showNotification, uploadFileToCPanel }: any) => {
    const [testimonial, setTestimonial] = useState(existingTestimonial);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setTestimonial((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (newRating: number) => {
        setTestimonial((prev: any) => ({ ...prev, rating: newRating }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFileToCPanel(file);
            setTestimonial((prev: any) => ({ ...prev, image_url: url }));
        } catch (error) {
            showNotification('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(testimonial);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">{testimonial.id ? 'Edit Testimonial' : 'Create New Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                <InputField label="Author Name" name="name" value={testimonial.name} onChange={handleChange} required />
                <InputField label="Author Role" name="role" value={testimonial.role} onChange={handleChange} placeholder="e.g., CEO @ Company" required />
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Author Image</label>
                    <input type="file" onChange={handleImageUpload} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    {isUploading && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                    {testimonial.image_url && <Image src={testimonial.image_url} alt="Preview" width={96} height={96} className="w-24 h-24 mt-4 rounded-full object-cover" />}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Rating (1-5)</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                             <button key={star} type="button" onClick={() => handleRatingChange(star)}>
                                <Star className={`w-6 h-6 ${testimonial.rating >= star ? 'text-yellow-400' : 'text-gray-400'}`} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Review Content</label>
                    <textarea name="review" value={testimonial.review} onChange={handleChange} rows={8} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">Save Testimonial</button>
                </div>
            </form>
        </div>
    );
};

export const TestimonialManagement = ({ testimonials, onSave, onDelete, editingTestimonial, setEditingTestimonial, showNotification, uploadFileToCPanel }: any) => {

    const handleAddNew = () => {
        setEditingTestimonial({ id: null, name: '', role: '', review: '', imageUrl: '', rating: 5 });
    };

    const handleEdit = (testimonial: any) => {
        setEditingTestimonial(testimonial);
    };

    const handleCancel = () => {
        setEditingTestimonial(null);
    };

    if (editingTestimonial) {
        return <TestimonialEditor existingTestimonial={editingTestimonial} onSave={onSave} onCancel={handleCancel} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Manage Testimonials</h2>
                <button onClick={handleAddNew} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 flex items-center gap-2">
                    <Plus size={18} /> New Testimonial
                </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                        <tr>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Review</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.map((testimonial: any) => (
                            <tr key={testimonial.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    <Image src={testimonial.image_url || testimonial.imageUrl || 'https://placehold.co/40x40.png'} alt={testimonial.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
                                    <div>
                                        <p>{testimonial.name}</p>
                                        <p className="text-xs text-slate-400">{testimonial.role}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300 max-w-sm truncate">{testimonial.review}</td>
                                <td className="px-6 py-4 text-yellow-400">{testimonial.rating} ★</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => handleEdit(testimonial)} className="p-2 rounded-md hover:bg-slate-600 text-yellow-400"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(testimonial.id)} className="p-2 rounded-md hover:bg-slate-600 text-red-400"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const RequestsView = ({
    submittedVoucher,
    dealRequests,
    nftShowcase,
    hostvoucherTestimonials,
    nftRedemptionRequests,
    onConvertToCatalog,
    onDeleteVoucher,
    onDeleteAllVouchers,
    onDeleteDeal,
    onDeleteAllDeals,
    onDeleteNftShowcase,
    onDeleteSiteTestimonial,
    onDeleteNftRedemptionRequest
}: any) => {
     return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">User Requests & Submissions</h2>
            {/* Vouchers Section */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-2">Submitted Vouchers ({submittedVoucher.length})</h3>
                 {submittedVoucher.map((req: any) => (
                    <div key={req.id} className="flex justify-between items-center p-2 border-b border-slate-700">
                        <span>{req.provider}: {req.voucher_code}</span>
                        <div>
                            <button onClick={() => onConvertToCatalog(req)} className="text-xs bg-indigo-500 p-1 rounded-md mr-2">Convert</button>
                            <button onClick={() => onDeleteVoucher(req.id)} className="text-red-500 p-1 rounded-md"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
             {/* Deal Requests Section */}
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-2">Deal Requests ({dealRequests.length})</h3>
                 {dealRequests.map((req: any) => (
                     <div key={req.id} className="flex justify-between items-center p-2 border-b border-slate-700">
                        <span>{req.user_email} requested a deal for {req.provider_name} ({req.service_type})</span>
                        <button onClick={() => onDeleteDeal(req.id)} className="text-red-500 p-1 rounded-md"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
            {/* NFT Redemption Requests Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-4">NFT Redemption Requests ({nftRedemptionRequests.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase">
                            <tr>
                                <th className="py-2 px-4">User</th>
                                <th className="py-2 px-4">Provider / Domain</th>
                                <th className="py-2 px-4">Purchase Date</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {nftRedemptionRequests.map((req: any) => (
                                <tr key={req.id} className="border-b border-slate-700">
                                    <td className="py-2 px-4">
                                        {req.full_name}
                                        <br/>
                                        <a href={`https://wa.me/${req.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline">
                                           {req.whatsapp_number}
                                        </a>
                                    </td>
                                    <td className="py-2 px-4">{req.provider}<br/>({req.domain})</td>
                                    <td className="py-2 px-4">{new Date(req.purchase_date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <a href={req.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-sky-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-sky-600">View Proof</a>
                                        <button onClick={() => onDeleteNftRedemptionRequest(req.id)} className="text-xs bg-red-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-700">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
 };

export const AdjustPointsModal = ({ modalState, onClose, onAdjust }: any) => {
    const [amount, setAmount] = useState(0); const [reason, setReason] = useState('');
    useEffect(() => { if (!modalState.isOpen) { setAmount(0); setReason(''); } }, [modalState.isOpen]);
    if (!modalState.isOpen) return null;
    const { user } = modalState;
    const handleAdjust = () => { if (amount !== 0 && reason.trim() !== '') { onAdjust(user.id, amount, reason); onClose(); } };
    return (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}><div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4"><h3 className="text-lg font-bold text-white">Adjust Points for {user.email}</h3><p className="text-sm text-slate-400">Current Points: {(user.points || 0).toLocaleString()}</p><InputField label="Points to Add/Subtract (use '-' for subtraction)" type="number" value={amount} onChange={(e: any) => setAmount(parseInt(e.target.value, 10) || 0)} /><InputField label="Reason for Adjustment" placeholder="e.g., Bonus for contest winner" value={reason} onChange={(e: any) => setReason(e.target.value)} /><div className="flex justify-end gap-3 pt-4"><button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500">Cancel</button><button onClick={handleAdjust} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-500">Apply Adjustment</button></div></div></div>);
};

// Enhanced Gamification User Panel with Anti-Hacking & Leaderboard
export const GamificationUserPanel = ({ users, onAwardNft, onAdjustPoints, showNotification }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('users');
    const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
    const [suspiciousUsers, setSuspiciousUsers] = useState<any[]>([]);
    const [pointsHistory, setPointsHistory] = useState<any[]>([]);
    const itemsPerPage = 10;
    const [adjustPointsModal, setAdjustPointsModal] = useState({ isOpen: false, user: null });

    // Load gamification settings and data
    useEffect(() => {
        const loadGamificationData = () => {
            try {
                const settings = JSON.parse(localStorage.getItem('gamification_settings') || '{}');
                const history = JSON.parse(localStorage.getItem('points_history') || '[]');
                const suspicious = JSON.parse(localStorage.getItem('suspicious_users') || '[]');

                setLeaderboardEnabled(settings.leaderboardEnabled !== false);
                setPointsHistory(history);
                setSuspiciousUsers(suspicious);
            } catch (error) {
                console.error('Error loading gamification data:', error);
            }
        };
        loadGamificationData();
    }, []);

    // Anti-hacking detection
    const detectSuspiciousActivity = (user: any) => {
        const suspiciousFlags = [];

        // Check for rapid point accumulation
        if (user.points > 1000000 && user.total_clicks < 10) {
            suspiciousFlags.push('Rapid point accumulation with low activity');
        }

        // Check for impossible point values
        if (user.points > 100000000) {
            suspiciousFlags.push('Extremely high point count');
        }

        // Check for suspicious timing patterns
        const lastActive = new Date(user.last_active);
        const now = new Date();
        const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

        if (user.points > 50000 && hoursSinceActive < 1) {
            suspiciousFlags.push('High points gained in short time');
        }

        return suspiciousFlags;
    };

    const filteredUsers = useMemo(() => {
        const filtered = (users || []).filter((u: any) =>
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.eth_address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );

        // Add suspicious activity detection
        return filtered.map(user => ({
            ...user,
            suspiciousFlags: detectSuspiciousActivity(user),
            isSuspicious: detectSuspiciousActivity(user).length > 0
        }));
    }, [users, searchTerm]);

    // Sort users for leaderboard
    const leaderboardUsers = useMemo(() => {
        return [...filteredUsers]
            .filter(u => !u.isSuspicious) // Exclude suspicious users from leaderboard
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 50); // Top 50 users
    }, [filteredUsers]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleCopyEthAddress = (address: string) => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        showNotification("ETH Address copied to clipboard!", "success");
    };

    const handleFlagUser = (userId: string, reason: string) => {
        const updatedSuspicious = [...suspiciousUsers, {
            userId,
            reason,
            flagged_at: new Date().toISOString(),
            status: 'flagged'
        }];
        setSuspiciousUsers(updatedSuspicious);
        localStorage.setItem('suspicious_users', JSON.stringify(updatedSuspicious));
        showNotification('User flagged for review', 'warning');
    };

    const handleResetPoints = (userId: string, reason: string) => {
        onAdjustPoints(userId, -999999999, `RESET: ${reason}`);
        showNotification('User points reset', 'info');
    };

    const handleToggleEthStatus = async (email: string) => {
        try {
            const response = await fetch('/api/gamification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_eth_status',
                    email: email
                })
            });

            if (response.ok) {
                showNotification('ETH status updated successfully', 'success');
                // Refresh the data
                window.location.reload();
            } else {
                throw new Error('Failed to update ETH status');
            }
        } catch (error) {
            showNotification('Failed to update ETH status', 'error');
        }
    };

    const toggleLeaderboard = () => {
        const newState = !leaderboardEnabled;
        setLeaderboardEnabled(newState);
        const settings = { leaderboardEnabled: newState };
        localStorage.setItem('gamification_settings', JSON.stringify(settings));
        showNotification(`Leaderboard ${newState ? 'enabled' : 'disabled'}`, 'info');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users /> Enhanced Gamification Management
                </h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by email or ETH address..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                    <button
                        onClick={toggleLeaderboard}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            leaderboardEnabled
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        🏆 Leaderboard: {leaderboardEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'users'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    👥 All Users ({filteredUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'leaderboard'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    🏆 Leaderboard ({leaderboardUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab('suspicious')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'suspicious'
                            ? 'bg-red-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    🚨 Suspicious ({filteredUsers.filter(u => u.isSuspicious).length})
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'analytics'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    📊 Analytics
                </button>
            </div>
            {/* All Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {filteredUsers.length > 0 ? (
                            <table className="w-full text-sm text-left text-slate-300">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Points</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Last Active</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user: any) => (
                                        <tr key={user.id} className={`border-b border-slate-700 hover:bg-slate-700/50 ${user.isSuspicious ? 'bg-red-900/20' : ''}`}>
                                            <td className="px-6 py-4 font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    {user.isSuspicious && <span className="text-red-400">🚨</span>}
                                                    <div>
                                                        <div>{user.email}</div>
                                                        <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                                            {user.eth_address}
                                                            {user.eth_address && <Copy size={12} className="cursor-pointer hover:text-white" onClick={() => handleCopyEthAddress(user.eth_address)} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-yellow-400">{user.points?.toLocaleString('en-US') || 0}</div>
                                                <div className="text-xs text-slate-400">{user.total_clicks || 0} clicks</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isSuspicious ? (
                                                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Suspicious</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {new Date(user.last_active || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    <button
                                                        onClick={() => setAdjustPointsModal({ isOpen: true, user: user })}
                                                        className="text-xs bg-indigo-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-indigo-500"
                                                    >
                                                        Adjust Points
                                                    </button>
                                                    <button
                                                        onClick={() => onAwardNft(user.id)}
                                                        className="text-xs bg-purple-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-purple-500"
                                                    >
                                                        Award NFT
                                                    </button>
                                                    {user.eth_address && (
                                                        <button
                                                            onClick={() => handleToggleEthStatus(user.email)}
                                                            className={`text-xs font-semibold py-1 px-2 rounded-md ${
                                                                user.is_eth_active
                                                                    ? 'bg-green-600 hover:bg-green-500 text-white'
                                                                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                                                            }`}
                                                        >
                                                            {user.is_eth_active ? '🟢 ETH Active' : '🔴 ETH Inactive'}
                                                        </button>
                                                    )}
                                                    {user.isSuspicious && (
                                                        <button
                                                            onClick={() => handleResetPoints(user.id, 'Suspicious activity detected')}
                                                            className="text-xs bg-red-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-500"
                                                        >
                                                            Reset Points
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12 px-6 text-slate-400">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-white">No gamification users found.</h3>
                                <p>Users will appear here after they sign up for gamification.</p>
                            </div>
                        )}
                    </div>
                    <Paginator currentPage={currentPage} totalPages={Math.ceil(filteredUsers.length / itemsPerPage)} onPageChange={setCurrentPage} />
                </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">🏆 Top Players Leaderboard</h3>
                        <div className="text-sm text-slate-400">
                            {leaderboardEnabled ? '✅ Public Leaderboard Active' : '❌ Leaderboard Disabled'}
                        </div>
                    </div>

                    {leaderboardUsers.length > 0 ? (
                        <div className="space-y-3">
                            {leaderboardUsers.slice(0, 10).map((user, index) => (
                                <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                                    index === 0 ? 'bg-yellow-900/30 border border-yellow-600' :
                                    index === 1 ? 'bg-gray-700/30 border border-gray-500' :
                                    index === 2 ? 'bg-orange-900/30 border border-orange-600' :
                                    'bg-slate-700/30 border border-slate-600'
                                }`}>
                                    <div className="text-2xl font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">{user.email}</div>
                                        <div className="text-sm text-slate-400">
                                            {user.points?.toLocaleString()} points • {user.total_clicks || 0} clicks
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-yellow-400">
                                            {user.points?.toLocaleString() || 0}
                                        </div>
                                        <div className="text-xs text-slate-400">points</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-6xl mb-4">🏆</div>
                            <h4 className="text-lg font-medium text-white mb-2">No leaderboard data</h4>
                            <p>Users need to earn points to appear on the leaderboard</p>
                        </div>
                    )}
                </div>
            )}

            {/* Suspicious Users Tab */}
            {activeTab === 'suspicious' && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">🚨 Suspicious Activity Detection</h3>
                        <div className="text-sm text-slate-400">
                            {filteredUsers.filter(u => u.isSuspicious).length} suspicious users detected
                        </div>
                    </div>

                    {filteredUsers.filter(u => u.isSuspicious).length > 0 ? (
                        <div className="space-y-4">
                            {filteredUsers.filter(u => u.isSuspicious).map((user) => (
                                <div key={user.id} className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-medium text-white flex items-center gap-2">
                                                🚨 {user.email}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Points: {user.points?.toLocaleString()} • Clicks: {user.total_clicks || 0}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleFlagUser(user.id, 'Manual review required')}
                                                className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                                            >
                                                Flag for Review
                                            </button>
                                            <button
                                                onClick={() => handleResetPoints(user.id, 'Suspicious activity')}
                                                className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Reset Points
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-red-400">Suspicious Flags:</div>
                                        {user.suspiciousFlags.map((flag: string, index: number) => (
                                            <div key={index} className="text-xs text-red-300 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                {flag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-6xl mb-4">✅</div>
                            <h4 className="text-lg font-medium text-white mb-2">No suspicious activity detected</h4>
                            <p>All users are behaving normally</p>
                        </div>
                    )}
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-700 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-400">
                                {filteredUsers.length}
                            </div>
                            <div className="text-slate-400 text-sm">Total Users</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-400">
                                {filteredUsers.filter(u => !u.isSuspicious).length}
                            </div>
                            <div className="text-slate-400 text-sm">Active Users</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-red-400">
                                {filteredUsers.filter(u => u.isSuspicious).length}
                            </div>
                            <div className="text-slate-400 text-sm">Suspicious Users</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-400">
                                {filteredUsers.reduce((sum, user) => sum + (user.points || 0), 0).toLocaleString()}
                            </div>
                            <div className="text-slate-400 text-sm">Total Points</div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">📊 User Activity Overview</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">Average Points per User</span>
                                    <span className="text-white">
                                        {filteredUsers.length > 0
                                            ? Math.round(filteredUsers.reduce((sum, user) => sum + (user.points || 0), 0) / filteredUsers.length).toLocaleString()
                                            : 0
                                        }
                                    </span>
                                </div>
                                <div className="w-full bg-slate-600 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">User Engagement Rate</span>
                                    <span className="text-white">
                                        {filteredUsers.length > 0
                                            ? Math.round((filteredUsers.filter(u => (u.total_clicks || 0) > 0).length / filteredUsers.length) * 100)
                                            : 0
                                        }%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-600 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{
                                        width: `${filteredUsers.length > 0
                                            ? (filteredUsers.filter(u => (u.total_clicks || 0) > 0).length / filteredUsers.length) * 100
                                            : 0
                                        }%`
                                    }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">Security Score</span>
                                    <span className="text-white">
                                        {filteredUsers.length > 0
                                            ? Math.round(((filteredUsers.length - filteredUsers.filter(u => u.isSuspicious).length) / filteredUsers.length) * 100)
                                            : 100
                                        }%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-600 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{
                                        width: `${filteredUsers.length > 0
                                            ? ((filteredUsers.length - filteredUsers.filter(u => u.isSuspicious).length) / filteredUsers.length) * 100
                                            : 100
                                        }%`
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AdjustPointsModal modalState={adjustPointsModal} onClose={() => setAdjustPointsModal({ isOpen: false, user: null })} onAdjust={onAdjustPoints} />
        </div>
    );
};


// Blog Management Component
export const BlogManagement = ({ posts, onSave, onDelete, editingPost, setEditingPost, showNotification, uploadFileToCPanel }: any) => {
    const handleAddNew = () => setEditingPost({ id: null, title: '', content: '', image_url: '', image_hint: '' });
    const handleEdit = (post: any) => setEditingPost(post);

    if (editingPost) {
        return <BlogEditor existingPost={editingPost} onSave={onSave} onCancel={() => setEditingPost(null)} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Manage Blog</h2>
                    <p className="text-slate-400">Create and manage blog posts for your website.</p>
                </div>
                <button onClick={handleAddNew} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 flex items-center gap-2">
                    <Plus size={20} />
                    New Post
                </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Created At</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post: any) => (
                            <tr key={post.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => handleEdit(post)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                    <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Blog Editor Component
const BlogEditor = ({ existingPost, onSave, onCancel, showNotification, uploadFileToCPanel }: any) => {
    const [post, setPost] = useState(existingPost || { title: '', content: '', image_url: '', image_hint: '' });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPost((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadFileToCPanel(file, showNotification);
            setPost((prev: any) => ({ ...prev, image_url: imageUrl }));
        } catch (error) {
            showNotification('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(post);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">{post.id ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                <InputField label="Post Title" name="title" value={post.title} onChange={handleChange} required />

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
                    <input type="file" onChange={handleImageUpload} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    {isUploading && <p className="text-xs text-indigo-400 mt-1">Uploading...</p>}
                    {post.image_url && <Image src={post.image_url} alt="Preview" width={200} height={120} className="mt-4 rounded-lg object-cover" />}
                </div>

                <InputField label="Image Alt Text" name="image_hint" value={post.image_hint} onChange={handleChange} placeholder="Describe the image for accessibility" />

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                    <textarea name="content" value={post.content} onChange={handleChange} rows={10} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" required></textarea>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">{isUploading ? 'Uploading...' : 'Save Post'}</button>
                </div>
            </form>
        </div>
    );
};

// Newsletter View Component
export const NewsletterView = ({ subscriptions, onDeleteSubscription }: any) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Newsletter Subscriptions ({subscriptions.length})</h2>
                <p className="text-slate-400">Manage email newsletter subscriptions.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                {subscriptions.length > 0 ? (
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Subscription Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub: any) => (
                                <tr key={sub.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{sub.email}</td>
                                    <td className="px-6 py-4">{new Date(sub.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onDeleteSubscription(sub.id)} className="text-red-400 hover:text-red-300">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12 px-6 text-slate-400">
                        <Mail size={48} className="mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-semibold text-white">No newsletter subscriptions</h3>
                        <p>Email subscriptions will appear here when users sign up.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Site Appearance Component
export const SiteAppearancePage = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [appearance, setAppearance] = useState({
        site_title: settings?.site_title || '',
        site_description: settings?.site_description || '',
        logo_url: settings?.logo_url || '',
        favicon_url: settings?.favicon_url || '',
        brand_logo_url: settings?.site_appearance?.brandLogoUrl || '',
        primary_color: settings?.primary_color || '#3B82F6',
        secondary_color: settings?.secondary_color || '#1E293B',
        banner_image: settings?.banner_image || '',
        banner_text: settings?.banner_text || '',
        footer_text: settings?.footer_text || '',
        specialist_image_url: settings?.specialist_image_url || '',
        floating_promo_url: settings?.floating_promo_url || '',
        popup_modal_image_url: settings?.popup_modal_image_url || '',
        donation_enabled: settings?.donation_enabled || false,
        donation_images: settings?.donation_images || [],
        banner_slide_1_image: settings?.banner_slide_1_image || '',
        banner_slide_1_title: settings?.banner_slide_1_title || '',
        banner_slide_1_subtitle: settings?.banner_slide_1_subtitle || '',
        banner_slide_1_button_text: settings?.banner_slide_1_button_text || '',
        banner_slide_1_button_link: settings?.banner_slide_1_button_link || '',
        banner_slide_2_image: settings?.banner_slide_2_image || '',
        banner_slide_2_title: settings?.banner_slide_2_title || '',
        banner_slide_2_subtitle: settings?.banner_slide_2_subtitle || '',
        banner_slide_2_button_text: settings?.banner_slide_2_button_text || '',
        banner_slide_2_button_link: settings?.banner_slide_2_button_link || '',
        banner_slide_3_image: settings?.banner_slide_3_image || '',
        banner_slide_3_title: settings?.banner_slide_3_title || '',
        banner_slide_3_subtitle: settings?.banner_slide_3_subtitle || '',
        banner_slide_3_button_text: settings?.banner_slide_3_button_text || '',
        banner_slide_3_button_link: settings?.banner_slide_3_button_link || '',
        banner_slide_4_image: settings?.banner_slide_4_image || '',
        banner_slide_4_title: settings?.banner_slide_4_title || '',
        banner_slide_4_subtitle: settings?.banner_slide_4_subtitle || '',
        banner_slide_4_button_text: settings?.banner_slide_4_button_text || '',
        banner_slide_4_button_link: settings?.banner_slide_4_button_link || '',
        rotation_interval: settings?.rotation_interval || 8,
        ...settings
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAppearance(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadFileToCPanel(file, showNotification);
            setAppearance(prev => ({ ...prev, [field]: imageUrl }));
        } catch (error) {
            showNotification('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure brand logo URL is saved in the correct structure
        const updatedAppearance = {
            ...appearance,
            site_appearance: {
                ...appearance.site_appearance,
                brandLogoUrl: appearance.brand_logo_url
            }
        };
        onSave(updatedAppearance);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Site Appearance</h2>
                <p className="text-slate-400">Customize the look and feel of your website.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField label="Site Title" name="site_title" value={appearance.site_title} onChange={handleChange} />
                        <InputField label="Site Description" name="site_description" value={appearance.site_description} onChange={handleChange} />
                    </div>
                </div>

                {/* Branding */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Branding</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'logo_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.logo_url && <Image src={appearance.logo_url} alt="Logo" width={120} height={60} className="mt-4 rounded-lg object-contain bg-white p-2" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Favicon</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'favicon_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.favicon_url && <Image src={appearance.favicon_url} alt="Favicon" width={32} height={32} className="mt-4 rounded object-contain" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Brand Logo (Header)</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'brand_logo_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.brand_logo_url && <Image src={appearance.brand_logo_url} alt="Brand Logo" width={180} height={40} className="mt-4 h-10 w-auto object-contain bg-white p-2 rounded" />}
                            <p className="text-xs text-slate-400 mt-1">Replaces "HostVoucher" text in header</p>
                        </div>
                    </div>
                </div>

                {/* General Images */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">General Images</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Specialist Image URL</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'specialist_image_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.specialist_image_url && <Image src={appearance.specialist_image_url} alt="Specialist" width={120} height={120} className="mt-4 rounded-lg object-cover" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Floating Promo URL</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'floating_promo_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.floating_promo_url && <Image src={appearance.floating_promo_url} alt="Floating Promo" width={200} height={100} className="mt-4 rounded-lg object-cover" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Popup Modal Image URL</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'popup_modal_image_url')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            {appearance.popup_modal_image_url && <Image src={appearance.popup_modal_image_url} alt="Popup Modal" width={200} height={150} className="mt-4 rounded-lg object-cover" />}
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Color Scheme</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" name="primary_color" value={appearance.primary_color} onChange={handleChange} className="w-12 h-10 rounded border border-slate-600" />
                                <input type="text" name="primary_color" value={appearance.primary_color} onChange={handleChange} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Secondary Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" name="secondary_color" value={appearance.secondary_color} onChange={handleChange} className="w-12 h-10 rounded border border-slate-600" />
                                <input type="text" name="secondary_color" value={appearance.secondary_color} onChange={handleChange} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Banners */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Page Banners Management</h3>
                    <p className="text-slate-400 text-sm">Configure banners for different pages across your website</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Select Page</label>
                            <select
                                name="selected_page_banner"
                                value={appearance.selected_page_banner || 'home'}
                                onChange={handleChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="home">Home Page</option>
                                <option value="landing">Landing Page</option>
                                <option value="hosting">Hosting</option>
                                <option value="web-hosting">Web Hosting</option>
                                <option value="wordpress-hosting">WordPress Hosting</option>
                                <option value="cloud-hosting">Cloud Hosting</option>
                                <option value="vps">VPS</option>
                                <option value="vpn">VPN</option>
                                <option value="domains">Domains</option>
                                <option value="promotional-vouchers">Promotional Vouchers</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Banner Rotation Interval</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="rotation_interval"
                                    value={appearance.rotation_interval}
                                    onChange={handleChange}
                                    min="3"
                                    max="30"
                                    className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-slate-400">seconds</span>
                            </div>
                        </div>
                    </div>

                    {/* Page-specific Banner Configuration */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                            Configuring banners for: {appearance.selected_page_banner ?
                                appearance.selected_page_banner.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Home Page'}
                        </h4>
                        <p className="text-slate-400 text-sm mb-4">
                            These banners will be displayed on the selected page. Configure up to 4 rotating banner slides.
                        </p>
                    </div>

                    {/* Dynamic Banner Slides for Selected Page */}
                    {[1, 2, 3, 4].map(slideNum => {
                        const selectedPage = appearance.selected_page_banner || 'home';
                        const fieldPrefix = `${selectedPage}_banner_slide_${slideNum}`;

                        return (
                            <div key={slideNum} className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-white">Banner Slide {slideNum}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                                            {selectedPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="checkbox"
                                                name={`${fieldPrefix}_enabled`}
                                                checked={appearance[`${fieldPrefix}_enabled`] !== false}
                                                onChange={(e) => handleChange({
                                                    target: { name: e.target.name, value: e.target.checked, type: 'checkbox' }
                                                })}
                                                className="rounded bg-slate-700 border-slate-600"
                                            />
                                            Enabled
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Banner Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleImageUpload(e, `${fieldPrefix}_image`)}
                                            disabled={isUploading}
                                            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        />
                                        {appearance[`${fieldPrefix}_image`] && (
                                            <div className="mt-4 relative">
                                                <Image
                                                    src={appearance[`${fieldPrefix}_image`]}
                                                    alt={`${selectedPage} Banner Slide ${slideNum}`}
                                                    width={400}
                                                    height={200}
                                                    className="rounded-lg object-cover border border-slate-600"
                                                />
                                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {selectedPage} - Slide {slideNum}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Title"
                                            name={`${fieldPrefix}_title`}
                                            value={appearance[`${fieldPrefix}_title`] || ''}
                                            onChange={handleChange}
                                            placeholder={`${selectedPage === 'home' ? 'Welcome to HostVoucher' :
                                                selectedPage === 'web-hosting' ? 'Premium Web Hosting' :
                                                selectedPage === 'wordpress-hosting' ? 'WordPress Hosting Solutions' :
                                                selectedPage === 'cloud-hosting' ? 'Cloud Hosting Services' :
                                                selectedPage === 'vps' ? 'Virtual Private Servers' :
                                                selectedPage === 'vpn' ? 'Secure VPN Services' :
                                                selectedPage === 'domains' ? 'Domain Registration' :
                                                selectedPage === 'promotional-vouchers' ? 'Exclusive Vouchers' :
                                                'Banner Title'}`}
                                        />
                                        <InputField
                                            label="Subtitle"
                                            name={`${fieldPrefix}_subtitle`}
                                            value={appearance[`${fieldPrefix}_subtitle`] || ''}
                                            onChange={handleChange}
                                            placeholder={`${selectedPage === 'home' ? 'Find the best hosting deals' :
                                                selectedPage === 'web-hosting' ? 'Reliable and fast hosting solutions' :
                                                selectedPage === 'wordpress-hosting' ? 'Optimized for WordPress' :
                                                selectedPage === 'cloud-hosting' ? 'Scalable cloud infrastructure' :
                                                selectedPage === 'vps' ? 'Full control and flexibility' :
                                                selectedPage === 'vpn' ? 'Privacy and security online' :
                                                selectedPage === 'domains' ? 'Secure your perfect domain' :
                                                selectedPage === 'promotional-vouchers' ? 'Save more with our deals' :
                                                'Banner subtitle'}`}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Button Text"
                                            name={`${fieldPrefix}_button_text`}
                                            value={appearance[`${fieldPrefix}_button_text`] || ''}
                                            onChange={handleChange}
                                            placeholder={`${selectedPage === 'home' ? 'Explore Deals' :
                                                selectedPage === 'web-hosting' ? 'View Hosting Plans' :
                                                selectedPage === 'wordpress-hosting' ? 'Get WordPress Hosting' :
                                                selectedPage === 'cloud-hosting' ? 'Start with Cloud' :
                                                selectedPage === 'vps' ? 'Choose VPS Plan' :
                                                selectedPage === 'vpn' ? 'Get VPN Now' :
                                                selectedPage === 'domains' ? 'Search Domains' :
                                                selectedPage === 'promotional-vouchers' ? 'Get Vouchers' :
                                                'Get Started'}`}
                                        />
                                        <InputField
                                            label="Button Link"
                                            name={`${fieldPrefix}_button_link`}
                                            value={appearance[`${fieldPrefix}_button_link`] || ''}
                                            onChange={handleChange}
                                            placeholder={`${selectedPage === 'home' ? '/deals' :
                                                selectedPage === 'web-hosting' ? '/web-hosting' :
                                                selectedPage === 'wordpress-hosting' ? '/wordpress-hosting' :
                                                selectedPage === 'cloud-hosting' ? '/cloud-hosting' :
                                                selectedPage === 'vps' ? '/vps' :
                                                selectedPage === 'vpn' ? '/vpn' :
                                                selectedPage === 'domains' ? '/domains' :
                                                selectedPage === 'promotional-vouchers' ? '/vouchers' :
                                                'https://...'}`}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Button Color</label>
                                            <select
                                                name={`${fieldPrefix}_button_color`}
                                                value={appearance[`${fieldPrefix}_button_color`] || 'indigo'}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="indigo">Indigo</option>
                                                <option value="blue">Blue</option>
                                                <option value="green">Green</option>
                                                <option value="red">Red</option>
                                                <option value="purple">Purple</option>
                                                <option value="yellow">Yellow</option>
                                                <option value="pink">Pink</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Text Position</label>
                                            <select
                                                name={`${fieldPrefix}_text_position`}
                                                value={appearance[`${fieldPrefix}_text_position`] || 'center'}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Animation</label>
                                            <select
                                                name={`${fieldPrefix}_animation`}
                                                value={appearance[`${fieldPrefix}_animation`] || 'fade'}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="fade">Fade</option>
                                                <option value="slide">Slide</option>
                                                <option value="zoom">Zoom</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Banner Management Actions */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-lg font-semibold text-white mb-4">Banner Management Actions</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const selectedPage = appearance.selected_page_banner || 'home';
                                    // Copy banners from one page to another
                                    showNotification?.('Banner copy feature coming soon!', 'info');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Banners
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const selectedPage = appearance.selected_page_banner || 'home';
                                    // Reset banners for selected page
                                    if (confirm(`Reset all banners for ${selectedPage}?`)) {
                                        showNotification?.(`Banners reset for ${selectedPage}`, 'success');
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Reset Page Banners
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Preview banners
                                    const selectedPage = appearance.selected_page_banner || 'home';
                                    window.open(`/${selectedPage}`, '_blank');
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Preview Page
                            </button>
                        </div>
                    </div>

                    {/* Banner Statistics */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-lg font-semibold text-white mb-4">Banner Statistics</h4>
                        <div className="grid md:grid-cols-4 gap-4">
                            {['home', 'web-hosting', 'wordpress-hosting', 'cloud-hosting', 'vps', 'vpn', 'domains', 'promotional-vouchers'].map(page => {
                                const enabledBanners = [1, 2, 3, 4].filter(num =>
                                    appearance[`${page}_banner_slide_${num}_enabled`] !== false
                                ).length;

                                return (
                                    <div key={page} className="bg-slate-800/50 p-3 rounded-lg">
                                        <h5 className="text-sm font-medium text-white mb-1">
                                            {page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </h5>
                                        <p className="text-xs text-slate-400">
                                            {enabledBanners}/4 banners active
                                        </p>
                                        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(enabledBanners / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Legacy Banner (for backward compatibility) */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Legacy Banner Section</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Banner Image</label>
                        <input type="file" onChange={(e) => handleImageUpload(e, 'banner_image')} disabled={isUploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        {appearance.banner_image && <Image src={appearance.banner_image} alt="Banner" width={400} height={200} className="mt-4 rounded-lg object-cover" />}
                    </div>
                    <InputField label="Banner Text" name="banner_text" value={appearance.banner_text} onChange={handleChange} placeholder="Welcome to our website!" />
                </div>

                {/* Footer */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Footer</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Footer Text</label>
                        <textarea name="footer_text" value={appearance.footer_text} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" placeholder="© 2024 Your Company. All rights reserved."></textarea>
                    </div>
                </div>

                {/* Donation Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2 flex items-center gap-2">
                        <span className="text-green-500">❤️</span>
                        Charitable Donation Settings
                    </h3>
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Switch
                                    id="donation_enabled"
                                    checked={appearance.donation_enabled}
                                    onCheckedChange={c => setAppearance(prev => ({...prev, donation_enabled: c}))}
                                />
                                <label htmlFor="donation_enabled" className="text-sm font-medium text-slate-300">
                                    Enable Donation Impact Display
                                </label>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">
                                <strong>5% of revenue</strong> is automatically donated to charitable causes.
                                Enable this to show donation impact images when your business becomes profitable.
                            </p>
                        </div>

                        {appearance.donation_enabled && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Donation Impact Images (Upload when profitable)
                                </label>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <div key={num} className="flex items-center gap-3">
                                            <span className="text-xs text-slate-400 w-12">Image {num}:</span>
                                            <input
                                                type="url"
                                                name={`donation_image_${num}`}
                                                value={appearance[`donation_image_${num}`] || ''}
                                                onChange={handleChange}
                                                placeholder="https://example.com/donation-impact-photo.jpg"
                                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    💡 Upload photos of your charitable impact when your business generates profit.
                                    These images will be displayed in the footer to show transparency in giving.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Save Appearance Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Integrations Component
export const IntegrationsPage = ({ settings, onSave, showNotification }: any) => {
    const [integrations, setIntegrations] = useState({
        google_analytics_id: settings?.google_analytics_id || '',
        facebook_pixel_id: settings?.facebook_pixel_id || '',
        stripe_public_key: settings?.stripe_public_key || '',
        stripe_secret_key: settings?.stripe_secret_key || '',
        mailchimp_api_key: settings?.mailchimp_api_key || '',
        discord_webhook_url: settings?.discord_webhook_url || '',
        telegram_bot_token: settings?.telegram_bot_token || '',
        telegram_chat_id: settings?.telegram_chat_id || '',
        ...settings
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIntegrations(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(integrations);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Integrations</h2>
                <p className="text-slate-400">Connect your website with third-party services.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                {/* Analytics */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Analytics</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField label="Google Analytics ID" name="google_analytics_id" value={integrations.google_analytics_id} onChange={handleChange} placeholder="GA-XXXXXXXXX-X" />
                        <InputField label="Facebook Pixel ID" name="facebook_pixel_id" value={integrations.facebook_pixel_id} onChange={handleChange} placeholder="123456789012345" />
                    </div>
                </div>

                {/* Payment */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Payment Processing</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField label="Stripe Public Key" name="stripe_public_key" value={integrations.stripe_public_key} onChange={handleChange} placeholder="pk_live_..." />
                        <InputField label="Stripe Secret Key" name="stripe_secret_key" type="password" value={integrations.stripe_secret_key} onChange={handleChange} placeholder="sk_live_..." />
                    </div>
                </div>

                {/* Email Marketing */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Email Marketing</h3>
                    <InputField label="Mailchimp API Key" name="mailchimp_api_key" type="password" value={integrations.mailchimp_api_key} onChange={handleChange} placeholder="your-api-key-here" />
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Notifications</h3>
                    <div className="space-y-4">
                        <InputField label="Discord Webhook URL" name="discord_webhook_url" value={integrations.discord_webhook_url} onChange={handleChange} placeholder="https://discord.com/api/webhooks/..." />
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputField label="Telegram Bot Token" name="telegram_bot_token" type="password" value={integrations.telegram_bot_token} onChange={handleChange} placeholder="123456:ABC-DEF..." />
                            <InputField label="Telegram Chat ID" name="telegram_chat_id" value={integrations.telegram_chat_id} onChange={handleChange} placeholder="-123456789" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">
                        Save Integration Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

// Global Settings Component
export const GlobalSettingsPage = ({ settings, onSave, showNotification, miningTasks, onUpdateMiningTasks, uploadFileToCPanel }: any) => {
    const [globalSettings, setGlobalSettings] = useState({
        maintenance_mode: settings?.maintenance_mode || false,
        user_registration: settings?.user_registration || true,
        email_verification: settings?.email_verification || false,
        max_upload_size: settings?.max_upload_size || 10,
        session_timeout: settings?.session_timeout || 30,
        backup_frequency: settings?.backup_frequency || 'daily',
        debug_mode: settings?.debug_mode || false,
        cache_enabled: settings?.cache_enabled || true,
        ...settings
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setGlobalSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(globalSettings);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Global Settings</h2>
                <p className="text-slate-400">Configure system-wide settings and preferences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                {/* System Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">System Settings</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-300">Maintenance Mode</label>
                                <p className="text-xs text-slate-400">Put the site in maintenance mode</p>
                            </div>
                            <Switch checked={globalSettings.maintenance_mode} onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, maintenance_mode: checked }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-300">Debug Mode</label>
                                <p className="text-xs text-slate-400">Enable debug logging</p>
                            </div>
                            <Switch checked={globalSettings.debug_mode} onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, debug_mode: checked }))} />
                        </div>
                    </div>
                </div>

                {/* User Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">User Management</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-300">User Registration</label>
                                <p className="text-xs text-slate-400">Allow new user registrations</p>
                            </div>
                            <Switch checked={globalSettings.user_registration} onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, user_registration: checked }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-300">Email Verification</label>
                                <p className="text-xs text-slate-400">Require email verification</p>
                            </div>
                            <Switch checked={globalSettings.email_verification} onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, email_verification: checked }))} />
                        </div>
                    </div>
                </div>

                {/* Currency Rates */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Currency Rates</h3>
                    <CurrencyRatesUpdater settings={settings} showNotification={showNotification} />
                </div>


                {/* Pagination Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Catalog Pagination</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                            label="Items Per Page"
                            name="pagination_itemsPerPage"
                            type="number"
                            value={globalSettings.pagination_settings?.itemsPerPage || 12}
                            onChange={(e) => setGlobalSettings(prev => ({
                                ...prev,
                                pagination_settings: {
                                    ...prev.pagination_settings,
                                    itemsPerPage: parseInt(e.target.value) || 12
                                }
                            }))}
                            min="4"
                            max="50"
                        />
                        <InputField
                            label="Rows Per Page"
                            name="pagination_rowsPerPage"
                            type="number"
                            value={globalSettings.pagination_settings?.rowsPerPage || 3}
                            onChange={(e) => setGlobalSettings(prev => ({
                                ...prev,
                                pagination_settings: {
                                    ...prev.pagination_settings,
                                    rowsPerPage: parseInt(e.target.value) || 3
                                }
                            }))}
                            min="1"
                            max="10"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-300">Show Pagination</p>
                                <p className="text-xs text-slate-400">Enable pagination controls on catalog pages</p>
                            </div>
                            <Switch
                                checked={globalSettings.pagination_settings?.showPagination !== false}
                                onCheckedChange={(checked) => setGlobalSettings(prev => ({
                                    ...prev,
                                    pagination_settings: {
                                        ...prev.pagination_settings,
                                        showPagination: checked
                                    }
                                }))}
                            />
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <label className="text-sm font-medium text-slate-300 block mb-2">Pagination Style</label>
                            <select
                                value={globalSettings.pagination_settings?.paginationStyle || 'numbers'}
                                onChange={(e) => setGlobalSettings(prev => ({
                                    ...prev,
                                    pagination_settings: {
                                        ...prev.pagination_settings,
                                        paginationStyle: e.target.value
                                    }
                                }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="numbers">Numbers (1, 2, 3...)</option>
                                <option value="arrows">Arrows Only</option>
                                <option value="both">Numbers + Arrows</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Performance Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">Performance</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <InputField label="Max Upload Size (MB)" name="max_upload_size" type="number" value={globalSettings.max_upload_size} onChange={handleChange} min="1" max="100" />
                        <InputField label="Session Timeout (minutes)" name="session_timeout" type="number" value={globalSettings.session_timeout} onChange={handleChange} min="5" max="1440" />
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Backup Frequency</label>
                            <select name="backup_frequency" value={globalSettings.backup_frequency} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500">
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Cache Enabled</label>
                            <p className="text-xs text-slate-400">Enable system caching for better performance</p>
                        </div>
                        <Switch checked={globalSettings.cache_enabled} onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, cache_enabled: checked }))} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500">
                        Save Global Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

// Upload Manager Component
export const UploadManager = ({ uploads, onUpload, onDelete, showNotification, uploadFileToCPanel }: any) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadCategory, setUploadCategory] = useState('general');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            showNotification('Please select files to upload', 'warning');
            return;
        }

        setIsUploading(true);
        const uploadResults = [];

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const url = await uploadFileToCPanel(file, showNotification);

                const uploadData = {
                    id: Date.now() + i,
                    name: file.name,
                    url: url,
                    category: uploadCategory,
                    size: file.size,
                    type: file.type,
                    uploaded_at: new Date().toISOString()
                };

                uploadResults.push(uploadData);
            }

            onUpload(uploadResults);
            setSelectedFiles(null);

            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            showNotification('Upload failed', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Upload Manager</h2>
                <p className="text-slate-400">Manage file uploads and media assets.</p>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Upload New Files</h3>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Select Files</label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                value={uploadCategory}
                                onChange={(e) => setUploadCategory(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="general">General</option>
                                <option value="images">Images</option>
                                <option value="documents">Documents</option>
                                <option value="media">Media</option>
                            </select>
                        </div>
                    </div>

                    {selectedFiles && selectedFiles.length > 0 && (
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Files:</h4>
                            <ul className="text-sm text-slate-400 space-y-1">
                                {Array.from(selectedFiles).map((file, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{file.name}</span>
                                        <span>{formatFileSize(file.size)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Upload size={20} />
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-semibold text-white">Uploaded Files ({uploads.length})</h3>
                </div>

                {uploads.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3">File Name</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Size</th>
                                    <th className="px-6 py-3">Uploaded</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploads.map((upload: any) => (
                                    <tr key={upload.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                {upload.type?.startsWith('image/') && (
                                                    <Image src={upload.url} alt={upload.name} width={40} height={40} className="rounded object-cover" />
                                                )}
                                                <span>{upload.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300">
                                                {upload.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{formatFileSize(upload.size)}</td>
                                        <td className="px-6 py-4">{new Date(upload.uploaded_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <a href={upload.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                                                View
                                            </a>
                                            <button onClick={() => navigator.clipboard.writeText(upload.url)} className="text-green-400 hover:text-green-300">
                                                Copy URL
                                            </button>
                                            <button onClick={() => onDelete(upload.id)} className="text-red-400 hover:text-red-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 px-6 text-slate-400">
                        <UploadCloud size={48} className="mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-semibold text-white">No files uploaded</h3>
                        <p>Upload files to see them listed here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Digital Strategy Images Management Component
export const DigitalStrategyImagesPage = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [strategyImages, setStrategyImages] = useState({
        buildDigitalFoundation: settings?.siteAppearance?.strategySectionImages?.[0] || '',
        masterWordPress: settings?.siteAppearance?.strategySectionImages?.[1] || '',
        runFullScaleApps: settings?.siteAppearance?.strategySectionImages?.[2] || '',
        buildCredibility: settings?.siteAppearance?.strategySectionImages?.[3] || '',
        fortifyAssets: settings?.siteAppearance?.strategySectionImages?.[4] || ''
    });
    const [uploading, setUploading] = useState<string | null>(null);

    const strategyItems = [
        {
            key: 'buildDigitalFoundation',
            title: 'Build a Digital Foundation',
            description: 'Image for the digital foundation strategy section'
        },
        {
            key: 'masterWordPress',
            title: 'Master the WordPress Platform',
            description: 'Image for the WordPress mastery strategy section'
        },
        {
            key: 'runFullScaleApps',
            title: 'Run Full-Scale Applications',
            description: 'Image for the full-scale applications strategy section'
        },
        {
            key: 'buildCredibility',
            title: 'Build Professional Credibility',
            description: 'Image for the professional credibility strategy section'
        },
        {
            key: 'fortifyAssets',
            title: 'Fortify Your Digital Asset',
            description: 'Image for the digital asset security strategy section'
        }
    ];

    const handleImageUpload = async (file: File, strategyKey: string) => {
        if (!file) return;

        setUploading(strategyKey);
        try {
            const uploadedUrl = await uploadFileToCPanel(file);
            if (uploadedUrl) {
                const newImages = { ...strategyImages, [strategyKey]: uploadedUrl };
                setStrategyImages(newImages);

                // Save to settings
                const updatedSettings = {
                    ...settings,
                    siteAppearance: {
                        ...settings.siteAppearance,
                        strategySectionImages: [
                            newImages.buildDigitalFoundation,
                            newImages.masterWordPress,
                            newImages.runFullScaleApps,
                            newImages.buildCredibility,
                            newImages.fortifyAssets
                        ]
                    }
                };

                await onSave(updatedSettings);
                showNotification('Strategy image updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Failed to upload image', 'error');
        } finally {
            setUploading(null);
        }
    };

    const handleUrlChange = (strategyKey: string, url: string) => {
        setStrategyImages(prev => ({ ...prev, [strategyKey]: url }));
    };

    const handleSaveUrl = async (strategyKey: string) => {
        try {
            const newImages = { ...strategyImages };

            // Save to settings
            const updatedSettings = {
                ...settings,
                siteAppearance: {
                    ...settings.siteAppearance,
                    strategySectionImages: [
                        newImages.buildDigitalFoundation,
                        newImages.masterWordPress,
                        newImages.runFullScaleApps,
                        newImages.buildCredibility,
                        newImages.fortifyAssets
                    ]
                }
            };

            await onSave(updatedSettings);
            showNotification('Strategy image URL updated successfully!', 'success');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save image URL', 'error');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Digital Strategy Images</h2>
                <p className="text-slate-400 mb-6">
                    Manage images for the "Find Your Winning Digital Strategy" section. Each strategy item can have its own custom image.
                </p>
            </div>

            <div className="grid gap-8">
                {strategyItems.map((item, index) => (
                    <div key={item.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start gap-6">
                            {/* Image Preview */}
                            <div className="flex-shrink-0">
                                <div className="w-48 h-32 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
                                    {strategyImages[item.key as keyof typeof strategyImages] ? (
                                        <Image
                                            src={strategyImages[item.key as keyof typeof strategyImages]}
                                            alt={item.title}
                                            width={192}
                                            height={128}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">🖼️</div>
                                                <div className="text-sm">No Image</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400 mt-2 text-center">
                                    Strategy {index + 1}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-slate-400 text-sm">{item.description}</p>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Upload New Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, item.key);
                                        }}
                                        disabled={uploading === item.key}
                                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:disabled:opacity-50"
                                    />
                                    {uploading === item.key && (
                                        <div className="mt-2 text-sm text-indigo-400">
                                            Uploading image...
                                        </div>
                                    )}
                                </div>

                                {/* URL Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Or Enter Image URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={strategyImages[item.key as keyof typeof strategyImages]}
                                            onChange={(e) => handleUrlChange(item.key, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={() => handleSaveUrl(item.key)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Save URL
                                        </button>
                                    </div>
                                </div>

                                {/* Current URL Display */}
                                {strategyImages[item.key as keyof typeof strategyImages] && (
                                    <div className="text-xs text-slate-400 break-all">
                                        Current: {strategyImages[item.key as keyof typeof strategyImages]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">💡 Tips for Best Results</h3>
                <ul className="text-slate-400 text-sm space-y-2">
                    <li>• <strong>Recommended size:</strong> 600x400 pixels (4:3 aspect ratio)</li>
                    <li>• <strong>File formats:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>File size:</strong> Keep under 500KB for fast loading</li>
                    <li>• <strong>Content:</strong> Use images that represent each strategy concept</li>
                    <li>• <strong>Style:</strong> Maintain consistent visual style across all images</li>
                </ul>
            </div>
        </div>
    );
};

// Advanced Gamification Management System
export const AdvancedGamificationManager = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [gamificationSettings, setGamificationSettings] = useState({
        pointsSystem: {
            catalogClick: 1000,
            socialShare: 5000,
            socialVisit: 1500,
            purchaseProof: 25000000,
            loyalReview: 2500,
            dailyLogin: 500,
            referralBonus: 10000,
            nftMining: 50000
        },
        cooldownHours: {
            catalogClick: 1,
            socialShare: 24,
            socialVisit: 24,
            purchaseProof: 168, // 1 week
            loyalReview: 72, // 3 days
            dailyLogin: 24,
            referralBonus: 0,
            nftMining: 12
        },
        marketingStrategies: {
            viralBonus: true,
            leaderboard: true,
            seasonalEvents: true,
            referralProgram: true,
            nftRewards: true
        },
        nftMining: {
            enabled: true,
            dailyLimit: 10,
            rarityLevels: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'],
            miningCost: 100000, // points required
            web3Integration: true
        },
        ...settings?.gamificationSettings
    });

    const [activeTab, setActiveTab] = useState('points');

    const handleSettingsChange = (category: string, key: string, value: any) => {
        setGamificationSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = async () => {
        try {
            const updatedSettings = {
                ...settings,
                gamificationSettings: gamificationSettings
            };

            await onSave(updatedSettings);
            showNotification('Gamification settings saved successfully!', 'success');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save gamification settings', 'error');
        }
    };

    const tabs = [
        { id: 'points', label: 'Points System', icon: '🎯' },
        { id: 'mining', label: 'Mining Activities', icon: '⛏️' },
        { id: 'nft', label: 'NFT Web3 Mining', icon: '🎨' },
        { id: 'marketing', label: 'Marketing Strategies', icon: '📈' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Advanced Gamification Manager</h2>
                <p className="text-slate-400 mb-6">
                    Comprehensive gamification system for viral marketing and user engagement
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Points System Tab */}
            {activeTab === 'points' && (
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-4">🎯 Points Reward System</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(gamificationSettings.pointsSystem).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={value as number}
                                            onChange={(e) => handleSettingsChange('pointsSystem', key, parseInt(e.target.value))}
                                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                        />
                                        <span className="text-slate-400 text-sm">points</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-4">⏰ Cooldown Periods</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(gamificationSettings.cooldownHours).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={value as number}
                                            onChange={(e) => handleSettingsChange('cooldownHours', key, parseInt(e.target.value))}
                                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                        />
                                        <span className="text-slate-400 text-sm">hours</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mining Activities Tab */}
            {activeTab === 'mining' && (
                <MiningActivitiesManager
                    settings={settings}
                    onSave={onSave}
                    showNotification={showNotification}
                    uploadFileToCPanel={uploadFileToCPanel}
                    miningTasks={settings?.miningTasks || []}
                />
            )}

            {/* NFT Web3 Mining Tab */}
            {activeTab === 'nft' && (
                <NFTWeb3MiningManager
                    settings={gamificationSettings.nftMining}
                    onSettingsChange={(newSettings) => setGamificationSettings(prev => ({...prev, nftMining: newSettings}))}
                    showNotification={showNotification}
                />
            )}

            {/* Marketing Strategies Tab */}
            {activeTab === 'marketing' && (
                <MarketingStrategiesManager
                    settings={gamificationSettings.marketingStrategies}
                    onSettingsChange={(newSettings) => setGamificationSettings(prev => ({...prev, marketingStrategies: newSettings}))}
                    showNotification={showNotification}
                />
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <LeaderboardManager
                    showNotification={showNotification}
                />
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveSettings}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Save Gamification Settings
                </button>
            </div>
        </div>
    );
};

// Mining Activities Manager Component
export const MiningActivitiesManager = ({ settings, onSave, showNotification, uploadFileToCPanel, miningTasks: initialMiningTasks }: any) => {
    const [miningTasks, setMiningTasks] = useState(initialMiningTasks || [
        {
            id: 'screenshot_contributor',
            title: 'Screenshot Contributor',
            description: 'Submits proof of purchase and usage.',
            points: 25000000,
            icon: '📸',
            taskType: 'proof_submission',
            requirements: ['Screenshot of purchase', 'Usage proof', 'Service review'],
            cooldown: 168, // 1 week
            active: true
        },
        {
            id: 'loyal_reviewer',
            title: 'Loyal Reviewer',
            description: 'Provides a rating after using a service.',
            points: 2500,
            icon: '⭐',
            taskType: 'review_submission',
            requirements: ['Service usage', 'Honest review', 'Rating 1-5 stars'],
            cooldown: 72, // 3 days
            active: true
        },
        {
            id: 'social_ambassador',
            title: 'Social Ambassador',
            description: 'Shares deals on social media platforms.',
            points: 5000,
            icon: '📱',
            taskType: 'social_share',
            requirements: ['Share on social media', 'Include hashtags', 'Tag friends'],
            cooldown: 24,
            active: true
        },
        {
            id: 'daily_visitor',
            title: 'Daily Visitor',
            description: 'Visits the website daily and explores deals.',
            points: 500,
            icon: '🌐',
            taskType: 'daily_login',
            requirements: ['Daily website visit', 'Browse at least 3 deals'],
            cooldown: 24,
            active: true
        },
        {
            id: 'referral_master',
            title: 'Referral Master',
            description: 'Brings new users to the platform.',
            points: 10000,
            icon: '👥',
            taskType: 'referral',
            requirements: ['Invite new users', 'User must register', 'User must be active'],
            cooldown: 0,
            active: true
        }
    ]);

    const [editingTask, setEditingTask] = useState<any>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddTask = () => {
        const newTask = {
            id: `custom_task_${Date.now()}`,
            title: '',
            description: '',
            points: 1000,
            icon: '🎯',
            taskType: 'custom',
            requirements: [''],
            cooldown: 24,
            active: true
        };
        setEditingTask(newTask);
        setShowAddForm(true);
    };

    const handleSaveTask = async (task: any) => {
        try {
            // Save individual task to database
            const response = await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'saveProduct',
                    payload: {
                        ...task,
                        table: 'mining_tasks',
                        name: task.title,
                        description: task.description,
                        enabled: task.active
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save mining task');
            }

            const updatedTasks = editingTask?.id && miningTasks.find(t => t.id === editingTask.id)
                ? miningTasks.map(t => t.id === task.id ? task : t)
                : [...miningTasks, task];

            setMiningTasks(updatedTasks);
            showNotification('Mining task saved successfully!', 'success');
            setEditingTask(null);
            setShowAddForm(false);
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save mining task', 'error');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            // Delete from database
            const response = await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'deleteItem',
                    payload: { table: 'mining_tasks', id: taskId }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete mining task');
            }

            const updatedTasks = miningTasks.filter(t => t.id !== taskId);
            setMiningTasks(updatedTasks);
            showNotification('Mining task deleted successfully!', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Failed to delete mining task', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-white">⛏️ Mining Activities Manager</h3>
                    <p className="text-slate-400">Manage tasks that users can complete to earn points</p>
                </div>
                <button
                    onClick={handleAddTask}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Add New Task
                </button>
            </div>

            {/* Tasks List */}
            <div className="grid gap-4">
                {miningTasks.map(task => (
                    <div key={task.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">{task.icon}</div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                                    <p className="text-slate-400 mb-2">{task.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-green-400 font-medium">+{task.points.toLocaleString()} points</span>
                                        <span className="text-slate-400">Cooldown: {task.cooldown}h</span>
                                        <span className={`px-2 py-1 rounded text-xs ${task.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {task.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs text-slate-500 mb-1">Requirements:</p>
                                        <ul className="text-xs text-slate-400 list-disc list-inside">
                                            {task.requirements.map((req: string, index: number) => (
                                                <li key={index}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingTask(task)}
                                    className="text-indigo-400 hover:text-indigo-300 p-2"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-400 hover:text-red-300 p-2"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Editor Modal */}
            {(editingTask || showAddForm) && (
                <TaskEditor
                    task={editingTask}
                    onSave={handleSaveTask}
                    onCancel={() => {
                        setEditingTask(null);
                        setShowAddForm(false);
                    }}
                />
            )}
        </div>
    );
};

// Task Editor Component
export const TaskEditor = ({ task, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
        id: task?.id || `task_${Date.now()}`,
        title: task?.title || '',
        description: task?.description || '',
        points: task?.points || 1000,
        icon: task?.icon || '🎯',
        taskType: task?.taskType || 'custom',
        requirements: task?.requirements || [''],
        cooldown: task?.cooldown || 24,
        active: task?.active !== undefined ? task.active : true
    });

    const handleRequirementChange = (index: number, value: string) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const addRequirement = () => {
        setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
    };

    const removeRequirement = (index: number) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-white mb-4">
                    {task?.id ? 'Edit Mining Task' : 'Add New Mining Task'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                placeholder="🎯"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Points Reward</label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Cooldown (hours)</label>
                            <input
                                type="number"
                                value={formData.cooldown}
                                onChange={(e) => setFormData(prev => ({ ...prev, cooldown: parseInt(e.target.value) }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Task Type</label>
                            <select
                                value={formData.taskType}
                                onChange={(e) => setFormData(prev => ({ ...prev, taskType: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="custom">Custom</option>
                                <option value="proof_submission">Proof Submission</option>
                                <option value="review_submission">Review Submission</option>
                                <option value="social_share">Social Share</option>
                                <option value="daily_login">Daily Login</option>
                                <option value="referral">Referral</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Requirements</label>
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                    placeholder="Enter requirement"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
                                    className="text-red-400 hover:text-red-300 px-3"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                            + Add Requirement
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            className="rounded"
                        />
                        <label htmlFor="active" className="text-sm text-slate-300">Active</label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// NFT Web3 Mining Manager Component
export const NFTWeb3MiningManager = ({ settings, onSettingsChange, showNotification }: any) => {
    const [nftSettings, setNftSettings] = useState({
        enabled: true,
        dailyLimit: 10,
        rarityLevels: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'],
        miningCost: 100000,
        web3Integration: true,
        viralBonus: true,
        seasonalEvents: true,
        blueOceanStrategy: {
            enabled: true,
            viralMultiplier: 2.5,
            socialMediaBonus: 5000,
            influencerProgram: true,
            communityRewards: true
        },
        nftRewards: [
            {
                id: 'hosting_hero',
                name: 'Hosting Hero NFT',
                description: 'Exclusive NFT for hosting service users',
                rarity: 'Rare',
                pointsCost: 500000,
                image: 'https://i.ibb.co/hosting-hero-nft.png',
                benefits: ['10% discount on hosting', 'Priority support', 'Exclusive community access']
            },
            {
                id: 'domain_master',
                name: 'Domain Master NFT',
                description: 'Premium NFT for domain collectors',
                rarity: 'Epic',
                pointsCost: 1000000,
                image: 'https://i.ibb.co/domain-master-nft.png',
                benefits: ['Free domain renewals', 'Premium DNS features', 'VIP status']
            },
            {
                id: 'crypto_pioneer',
                name: 'Crypto Pioneer NFT',
                description: 'Ultra-rare NFT for early adopters',
                rarity: 'Legendary',
                pointsCost: 5000000,
                image: 'https://i.ibb.co/crypto-pioneer-nft.png',
                benefits: ['Lifetime premium access', 'Revenue sharing', 'Governance voting rights']
            }
        ],
        ...settings
    });

    const handleSettingChange = (key: string, value: any) => {
        const newSettings = { ...nftSettings, [key]: value };
        setNftSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const handleBlueOceanChange = (key: string, value: any) => {
        const newBlueOcean = { ...nftSettings.blueOceanStrategy, [key]: value };
        const newSettings = { ...nftSettings, blueOceanStrategy: newBlueOcean };
        setNftSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const addNFTReward = () => {
        const newReward = {
            id: `nft_${Date.now()}`,
            name: 'New NFT',
            description: 'Custom NFT reward',
            rarity: 'Common',
            pointsCost: 100000,
            image: 'https://i.ibb.co/default-nft.png',
            benefits: ['Custom benefit']
        };

        const newRewards = [...nftSettings.nftRewards, newReward];
        handleSettingChange('nftRewards', newRewards);
    };

    const updateNFTReward = (index: number, field: string, value: any) => {
        const newRewards = [...nftSettings.nftRewards];
        newRewards[index] = { ...newRewards[index], [field]: value };
        handleSettingChange('nftRewards', newRewards);
    };

    const removeNFTReward = (index: number) => {
        const newRewards = nftSettings.nftRewards.filter((_, i) => i !== index);
        handleSettingChange('nftRewards', newRewards);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">🎨 NFT Web3 Mining System</h3>
                <p className="text-slate-400">Advanced NFT mining with 2025 blue ocean marketing strategies</p>
            </div>

            {/* Basic NFT Settings */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">⚙️ Basic NFT Settings</h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="nft-enabled"
                                checked={nftSettings.enabled}
                                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="nft-enabled" className="text-slate-300">Enable NFT Mining</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="web3-integration"
                                checked={nftSettings.web3Integration}
                                onChange={(e) => handleSettingChange('web3Integration', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="web3-integration" className="text-slate-300">Web3 Integration</label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Daily Mining Limit</label>
                            <input
                                type="number"
                                value={nftSettings.dailyLimit}
                                onChange={(e) => handleSettingChange('dailyLimit', parseInt(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Mining Cost (Points)</label>
                            <input
                                type="number"
                                value={nftSettings.miningCost}
                                onChange={(e) => handleSettingChange('miningCost', parseInt(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Blue Ocean Marketing Strategy */}
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-700">
                <h4 className="text-lg font-semibold text-white mb-4">🌊 Blue Ocean Marketing 2025</h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="blue-ocean-enabled"
                                checked={nftSettings.blueOceanStrategy.enabled}
                                onChange={(e) => handleBlueOceanChange('enabled', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="blue-ocean-enabled" className="text-slate-300">Enable Blue Ocean Strategy</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="viral-bonus"
                                checked={nftSettings.blueOceanStrategy.viralBonus}
                                onChange={(e) => handleBlueOceanChange('viralBonus', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="viral-bonus" className="text-slate-300">Viral Bonus System</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="influencer-program"
                                checked={nftSettings.blueOceanStrategy.influencerProgram}
                                onChange={(e) => handleBlueOceanChange('influencerProgram', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="influencer-program" className="text-slate-300">Influencer Program</label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Viral Multiplier</label>
                            <input
                                type="number"
                                step="0.1"
                                value={nftSettings.blueOceanStrategy.viralMultiplier}
                                onChange={(e) => handleBlueOceanChange('viralMultiplier', parseFloat(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Social Media Bonus</label>
                            <input
                                type="number"
                                value={nftSettings.blueOceanStrategy.socialMediaBonus}
                                onChange={(e) => handleBlueOceanChange('socialMediaBonus', parseInt(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* NFT Rewards */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">🏆 NFT Rewards Collection</h4>
                    <button
                        onClick={addNFTReward}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Add NFT Reward
                    </button>
                </div>

                <div className="grid gap-4">
                    {nftSettings.nftRewards.map((nft: any, index: number) => (
                        <div key={nft.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-slate-600 rounded-lg overflow-hidden">
                                    <Image
                                        src={nft.image}
                                        alt={nft.name}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=NFT';
                                        }}
                                    />
                                </div>

                                <div className="flex-1 grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={nft.name}
                                            onChange={(e) => updateNFTReward(index, 'name', e.target.value)}
                                            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm mb-2"
                                            placeholder="NFT Name"
                                        />
                                        <textarea
                                            value={nft.description}
                                            onChange={(e) => updateNFTReward(index, 'description', e.target.value)}
                                            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                                            rows={2}
                                            placeholder="NFT Description"
                                        />
                                    </div>

                                    <div>
                                        <select
                                            value={nft.rarity}
                                            onChange={(e) => updateNFTReward(index, 'rarity', e.target.value)}
                                            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm mb-2"
                                        >
                                            {nftSettings.rarityLevels.map((rarity: string) => (
                                                <option key={rarity} value={rarity}>{rarity}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={nft.pointsCost}
                                            onChange={(e) => updateNFTReward(index, 'pointsCost', parseInt(e.target.value))}
                                            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                                            placeholder="Points Cost"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeNFTReward(index)}
                                    className="text-red-400 hover:text-red-300 p-2"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Marketing Strategies Manager Component
export const MarketingStrategiesManager = ({ settings, onSettingsChange, showNotification }: any) => {
    const [strategies, setStrategies] = useState({
        viralBonus: true,
        leaderboard: true,
        seasonalEvents: true,
        referralProgram: true,
        nftRewards: true,
        socialMediaCampaigns: true,
        influencerPartnerships: true,
        communityBuilding: true,
        gamificationElements: true,
        exclusiveContent: true,
        ...settings
    });

    const handleStrategyChange = (key: string, value: boolean) => {
        const newStrategies = { ...strategies, [key]: value };
        setStrategies(newStrategies);
        onSettingsChange(newStrategies);
    };

    const strategyItems = [
        {
            key: 'viralBonus',
            title: 'Viral Bonus System',
            description: 'Extra rewards for content that goes viral',
            icon: '🚀',
            impact: 'High'
        },
        {
            key: 'leaderboard',
            title: 'Public Leaderboard',
            description: 'Competitive ranking system for users',
            icon: '🏆',
            impact: 'High'
        },
        {
            key: 'seasonalEvents',
            title: 'Seasonal Events',
            description: 'Limited-time events with special rewards',
            icon: '🎉',
            impact: 'Medium'
        },
        {
            key: 'referralProgram',
            title: 'Referral Program',
            description: 'Rewards for bringing new users',
            icon: '👥',
            impact: 'High'
        },
        {
            key: 'nftRewards',
            title: 'NFT Rewards',
            description: 'Exclusive NFTs as premium rewards',
            icon: '🎨',
            impact: 'Very High'
        },
        {
            key: 'socialMediaCampaigns',
            title: 'Social Media Campaigns',
            description: 'Integrated social media marketing',
            icon: '📱',
            impact: 'High'
        },
        {
            key: 'influencerPartnerships',
            title: 'Influencer Partnerships',
            description: 'Collaborate with industry influencers',
            icon: '⭐',
            impact: 'Very High'
        },
        {
            key: 'communityBuilding',
            title: 'Community Building',
            description: 'Foster active user communities',
            icon: '🤝',
            impact: 'Medium'
        },
        {
            key: 'gamificationElements',
            title: 'Advanced Gamification',
            description: 'Badges, achievements, and progress tracking',
            icon: '🎮',
            impact: 'High'
        },
        {
            key: 'exclusiveContent',
            title: 'Exclusive Content',
            description: 'Premium content for top users',
            icon: '💎',
            impact: 'Medium'
        }
    ];

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'Very High': return 'text-red-400';
            case 'High': return 'text-orange-400';
            case 'Medium': return 'text-yellow-400';
            default: return 'text-green-400';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">📈 Marketing Strategies</h3>
                <p className="text-slate-400">Configure viral marketing strategies for maximum user engagement</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {strategyItems.map(item => (
                    <div key={item.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{item.icon}</div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                    <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                                    <span className={`text-xs font-medium ${getImpactColor(item.impact)}`}>
                                        {item.impact} Impact
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={strategies[item.key as keyof typeof strategies]}
                                    onChange={(e) => handleStrategyChange(item.key, e.target.checked)}
                                    className="rounded"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-700">
                <h4 className="text-lg font-semibold text-white mb-4">🎯 Strategy Impact Analysis</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-red-400">
                            {strategyItems.filter(s => s.impact === 'Very High' && strategies[s.key as keyof typeof strategies]).length}
                        </div>
                        <div className="text-sm text-slate-400">Very High Impact</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-400">
                            {strategyItems.filter(s => s.impact === 'High' && strategies[s.key as keyof typeof strategies]).length}
                        </div>
                        <div className="text-sm text-slate-400">High Impact</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {strategyItems.filter(s => s.impact === 'Medium' && strategies[s.key as keyof typeof strategies]).length}
                        </div>
                        <div className="text-sm text-slate-400">Medium Impact</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-400">
                            {Object.values(strategies).filter(Boolean).length}
                        </div>
                        <div className="text-sm text-slate-400">Total Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Leaderboard Manager Component
export const LeaderboardManager = ({ showNotification }: any) => {
    const [leaderboardData, setLeaderboardData] = useState([
        { rank: 1, username: 'CryptoKing2025', points: 15750000, nfts: 12, level: 'Legendary' },
        { rank: 2, username: 'HostingHero', points: 12300000, nfts: 8, level: 'Epic' },
        { rank: 3, username: 'DomainMaster', points: 9800000, nfts: 6, level: 'Epic' },
        { rank: 4, username: 'WebWarrior', points: 7500000, nfts: 4, level: 'Rare' },
        { rank: 5, username: 'TechTitan', points: 6200000, nfts: 3, level: 'Rare' }
    ]);

    const [settings, setSettings] = useState({
        publicLeaderboard: true,
        showRealNames: false,
        updateFrequency: 'hourly',
        maxDisplayUsers: 100,
        seasonalReset: false
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Legendary': return 'text-yellow-400';
            case 'Epic': return 'text-purple-400';
            case 'Rare': return 'text-blue-400';
            default: return 'text-green-400';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">🏆 Leaderboard Manager</h3>
                <p className="text-slate-400">Manage competitive rankings and user achievements</p>
            </div>

            {/* Leaderboard Settings */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">⚙️ Leaderboard Settings</h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="public-leaderboard"
                                checked={settings.publicLeaderboard}
                                onChange={(e) => setSettings(prev => ({ ...prev, publicLeaderboard: e.target.checked }))}
                                className="rounded"
                            />
                            <label htmlFor="public-leaderboard" className="text-slate-300">Public Leaderboard</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="show-real-names"
                                checked={settings.showRealNames}
                                onChange={(e) => setSettings(prev => ({ ...prev, showRealNames: e.target.checked }))}
                                className="rounded"
                            />
                            <label htmlFor="show-real-names" className="text-slate-300">Show Real Names</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="seasonal-reset"
                                checked={settings.seasonalReset}
                                onChange={(e) => setSettings(prev => ({ ...prev, seasonalReset: e.target.checked }))}
                                className="rounded"
                            />
                            <label htmlFor="seasonal-reset" className="text-slate-300">Seasonal Reset</label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Update Frequency</label>
                            <select
                                value={settings.updateFrequency}
                                onChange={(e) => setSettings(prev => ({ ...prev, updateFrequency: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="realtime">Real-time</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Max Display Users</label>
                            <input
                                type="number"
                                value={settings.maxDisplayUsers}
                                onChange={(e) => setSettings(prev => ({ ...prev, maxDisplayUsers: parseInt(e.target.value) }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Leaderboard */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">🎖️ Current Leaderboard</h4>

                <div className="space-y-3">
                    {leaderboardData.map(user => (
                        <div key={user.rank} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">#{user.rank}</div>
                            <div className="flex-1">
                                <div className="font-semibold text-white">{user.username}</div>
                                <div className="text-sm text-slate-400">
                                    {user.points.toLocaleString()} points • {user.nfts} NFTs
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                                {user.level}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Enhanced Banner Rotation System
export const EnhancedBannerRotationManager = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [bannerSettings, setBannerSettings] = useState({
        rotationEnabled: true,
        rotationType: 'time', // 'time', 'views', 'clicks'
        timeInterval: {
            value: 30,
            unit: 'seconds' // 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'
        },
        viewsInterval: 1000,
        clicksInterval: 50,
        randomOrder: false,
        fadeTransition: true,
        transitionDuration: 500,
        pauseOnHover: true,
        autoStart: true,
        ...settings?.bannerRotation
    });

    const [banners, setBanners] = useState([
        {
            id: 'banner_1',
            title: 'Premium Hosting Deals',
            description: 'Get up to 75% off on premium hosting services',
            image: 'https://i.ibb.co/banner1.jpg',
            link: '/web-hosting',
            active: true,
            priority: 1,
            schedule: {
                enabled: false,
                startDate: '',
                endDate: '',
                timeSlots: []
            }
        }
    ]);

    const timeUnits = [
        { value: 'seconds', label: 'Seconds', multiplier: 1 },
        { value: 'minutes', label: 'Minutes', multiplier: 60 },
        { value: 'hours', label: 'Hours', multiplier: 3600 },
        { value: 'days', label: 'Days', multiplier: 86400 },
        { value: 'weeks', label: 'Weeks', multiplier: 604800 },
        { value: 'months', label: 'Months', multiplier: 2592000 },
        { value: 'years', label: 'Years', multiplier: 31536000 }
    ];

    const handleSettingChange = (key: string, value: any) => {
        setBannerSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleTimeIntervalChange = (field: string, value: any) => {
        setBannerSettings(prev => ({
            ...prev,
            timeInterval: { ...prev.timeInterval, [field]: value }
        }));
    };

    const addBanner = () => {
        const newBanner = {
            id: `banner_${Date.now()}`,
            title: 'New Banner',
            description: 'Banner description',
            image: 'https://via.placeholder.com/800x400',
            link: '/',
            active: true,
            priority: banners.length + 1,
            schedule: {
                enabled: false,
                startDate: '',
                endDate: '',
                timeSlots: []
            }
        };
        setBanners(prev => [...prev, newBanner]);
    };

    const updateBanner = (index: number, field: string, value: any) => {
        setBanners(prev => {
            const updated = [...prev];
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                updated[index] = {
                    ...updated[index],
                    [parent]: { ...updated[index][parent as keyof typeof updated[index]], [child]: value }
                };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            return updated;
        });
    };

    const removeBanner = (index: number) => {
        setBanners(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveSettings = async () => {
        try {
            const updatedSettings = {
                ...settings,
                bannerRotation: bannerSettings,
                banners: banners
            };

            await onSave(updatedSettings);
            showNotification('Banner rotation settings saved successfully!', 'success');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save banner settings', 'error');
        }
    };

    const getIntervalInSeconds = () => {
        const unit = timeUnits.find(u => u.value === bannerSettings.timeInterval.unit);
        return bannerSettings.timeInterval.value * (unit?.multiplier || 1);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">🎠 Enhanced Banner Rotation</h2>
                <p className="text-slate-400 mb-6">
                    Advanced banner rotation system with precise timing controls
                </p>
            </div>

            {/* Rotation Settings */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">⚙️ Rotation Settings</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="rotation-enabled"
                                checked={bannerSettings.rotationEnabled}
                                onChange={(e) => handleSettingChange('rotationEnabled', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="rotation-enabled" className="text-slate-300">Enable Banner Rotation</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Rotation Type</label>
                            <select
                                value={bannerSettings.rotationType}
                                onChange={(e) => handleSettingChange('rotationType', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="time">Time-based</option>
                                <option value="views">Views-based</option>
                                <option value="clicks">Clicks-based</option>
                            </select>
                        </div>

                        {bannerSettings.rotationType === 'time' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Time Interval</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={bannerSettings.timeInterval.value}
                                        onChange={(e) => handleTimeIntervalChange('value', parseInt(e.target.value))}
                                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                        min="1"
                                    />
                                    <select
                                        value={bannerSettings.timeInterval.unit}
                                        onChange={(e) => handleTimeIntervalChange('unit', e.target.value)}
                                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                    >
                                        {timeUnits.map(unit => (
                                            <option key={unit.value} value={unit.value}>{unit.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    = {getIntervalInSeconds().toLocaleString()} seconds
                                </div>
                            </div>
                        )}

                        {bannerSettings.rotationType === 'views' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Views per Rotation</label>
                                <input
                                    type="number"
                                    value={bannerSettings.viewsInterval}
                                    onChange={(e) => handleSettingChange('viewsInterval', parseInt(e.target.value))}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                        )}

                        {bannerSettings.rotationType === 'clicks' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Clicks per Rotation</label>
                                <input
                                    type="number"
                                    value={bannerSettings.clicksInterval}
                                    onChange={(e) => handleSettingChange('clicksInterval', parseInt(e.target.value))}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="random-order"
                                checked={bannerSettings.randomOrder}
                                onChange={(e) => handleSettingChange('randomOrder', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="random-order" className="text-slate-300">Random Order</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="fade-transition"
                                checked={bannerSettings.fadeTransition}
                                onChange={(e) => handleSettingChange('fadeTransition', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="fade-transition" className="text-slate-300">Fade Transition</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="pause-on-hover"
                                checked={bannerSettings.pauseOnHover}
                                onChange={(e) => handleSettingChange('pauseOnHover', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="pause-on-hover" className="text-slate-300">Pause on Hover</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Transition Duration (ms)</label>
                            <input
                                type="number"
                                value={bannerSettings.transitionDuration}
                                onChange={(e) => handleSettingChange('transitionDuration', parseInt(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Management */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">🖼️ Banner Management</h3>
                    <button
                        onClick={addBanner}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add Banner
                    </button>
                </div>

                <div className="space-y-4">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={banner.title}
                                        onChange={(e) => updateBanner(index, 'title', e.target.value)}
                                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                                        placeholder="Banner Title"
                                    />
                                    <textarea
                                        value={banner.description}
                                        onChange={(e) => updateBanner(index, 'description', e.target.value)}
                                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                                        rows={2}
                                        placeholder="Banner Description"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        value={banner.image}
                                        onChange={(e) => updateBanner(index, 'image', e.target.value)}
                                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                                        placeholder="Image URL"
                                    />
                                    <input
                                        type="text"
                                        value={banner.link}
                                        onChange={(e) => updateBanner(index, 'link', e.target.value)}
                                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                                        placeholder="Link URL"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={banner.priority}
                                            onChange={(e) => updateBanner(index, 'priority', parseInt(e.target.value))}
                                            className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                                            placeholder="Priority"
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={banner.active}
                                                onChange={(e) => updateBanner(index, 'active', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-slate-300 text-sm">Active</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeBanner(index)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                                    >
                                        Remove Banner
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveSettings}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Save Banner Settings
                </button>
            </div>
        </div>
    );
};

// Professional Catalog Image Manager Component
export const ProfessionalCatalogImageManager = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => {
    const [catalogImages, setCatalogImages] = useState({
        webHosting: settings?.catalogImages?.webHosting || '',
        wordpressHosting: settings?.catalogImages?.wordpressHosting || '',
        cloudHosting: settings?.catalogImages?.cloudHosting || '',
        vpsHosting: settings?.catalogImages?.vpsHosting || '',
        dedicatedServer: settings?.catalogImages?.dedicatedServer || '',
        domain: settings?.catalogImages?.domain || '',
        sslCertificate: settings?.catalogImages?.sslCertificate || '',
        vpn: settings?.catalogImages?.vpn || '',
        emailHosting: settings?.catalogImages?.emailHosting || '',
        websiteBuilder: settings?.catalogImages?.websiteBuilder || '',
        cdn: settings?.catalogImages?.cdn || '',
        backupService: settings?.catalogImages?.backupService || '',
        monitoring: settings?.catalogImages?.monitoring || '',
        security: settings?.catalogImages?.security || ''
    });

    const [brandLogos, setBrandLogos] = useState({
        hostgator: settings?.brandLogos?.hostgator || '',
        bluehost: settings?.brandLogos?.bluehost || '',
        siteground: settings?.brandLogos?.siteground || '',
        godaddy: settings?.brandLogos?.godaddy || '',
        namecheap: settings?.brandLogos?.namecheap || ''
    });

    const [uploading, setUploading] = useState<string | null>(null);

    const catalogCategories = [
        { key: 'webHosting', title: 'Web Hosting', description: 'General web hosting services' },
        { key: 'wordpressHosting', title: 'WordPress Hosting', description: 'WordPress optimized hosting' },
        { key: 'cloudHosting', title: 'Cloud Hosting', description: 'Scalable cloud hosting solutions' },
        { key: 'vpsHosting', title: 'VPS Hosting', description: 'Virtual private server hosting' },
        { key: 'dedicatedServer', title: 'Dedicated Server', description: 'Dedicated server solutions' },
        { key: 'domain', title: 'Domain Services', description: 'Domain registration and management' },
        { key: 'sslCertificate', title: 'SSL Certificate', description: 'SSL security certificates' },
        { key: 'vpn', title: 'VPN Services', description: 'Virtual private network services' },
        { key: 'emailHosting', title: 'Email Hosting', description: 'Professional email hosting' },
        { key: 'websiteBuilder', title: 'Website Builder', description: 'Website building tools' },
        { key: 'cdn', title: 'CDN Services', description: 'Content delivery network' },
        { key: 'backupService', title: 'Backup Service', description: 'Data backup solutions' },
        { key: 'monitoring', title: 'Monitoring', description: 'Website monitoring services' },
        { key: 'security', title: 'Security', description: 'Website security solutions' }
    ];

    const brandProviders = [
        { key: 'hostgator', title: 'HostGator', description: 'HostGator brand logo' },
        { key: 'bluehost', title: 'Bluehost', description: 'Bluehost brand logo' },
        { key: 'siteground', title: 'SiteGround', description: 'SiteGround brand logo' },
        { key: 'godaddy', title: 'GoDaddy', description: 'GoDaddy brand logo' },
        { key: 'namecheap', title: 'Namecheap', description: 'Namecheap brand logo' }
    ];

    const handleImageUpload = async (file: File, category: string, type: 'catalog' | 'brand') => {
        if (!file) return;

        setUploading(`${type}_${category}`);
        try {
            const uploadedUrl = await uploadFileToCPanel(file);
            if (uploadedUrl) {
                if (type === 'catalog') {
                    const newImages = { ...catalogImages, [category]: uploadedUrl };
                    setCatalogImages(newImages);
                } else {
                    const newLogos = { ...brandLogos, [category]: uploadedUrl };
                    setBrandLogos(newLogos);
                }

                // Save to settings
                const updatedSettings = {
                    ...settings,
                    catalogImages: type === 'catalog' ? { ...catalogImages, [category]: uploadedUrl } : catalogImages,
                    brandLogos: type === 'brand' ? { ...brandLogos, [category]: uploadedUrl } : brandLogos
                };

                await onSave(updatedSettings);
                showNotification(`${type === 'catalog' ? 'Catalog image' : 'Brand logo'} updated successfully!`, 'success');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification(`Failed to upload ${type === 'catalog' ? 'image' : 'logo'}`, 'error');
        } finally {
            setUploading(null);
        }
    };

    const handleUrlChange = (category: string, url: string, type: 'catalog' | 'brand') => {
        if (type === 'catalog') {
            setCatalogImages(prev => ({ ...prev, [category]: url }));
        } else {
            setBrandLogos(prev => ({ ...prev, [category]: url }));
        }
    };

    const handleSaveUrl = async (category: string, type: 'catalog' | 'brand') => {
        try {
            const updatedSettings = {
                ...settings,
                catalogImages: type === 'catalog' ? catalogImages : settings.catalogImages,
                brandLogos: type === 'brand' ? brandLogos : settings.brandLogos
            };

            await onSave(updatedSettings);
            showNotification(`${type === 'catalog' ? 'Catalog image' : 'Brand logo'} URL updated successfully!`, 'success');
        } catch (error) {
            console.error('Save error:', error);
            showNotification(`Failed to save ${type === 'catalog' ? 'image' : 'logo'} URL`, 'error');
        }
    };

    const [activeTab, setActiveTab] = useState('catalog');

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Professional Catalog Images</h2>
                <p className="text-slate-400 mb-6">
                    Manage professional images for catalog categories and brand logos. Images will be used as fallbacks when products don't have custom images.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('catalog')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'catalog'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    🖼️ Catalog Images
                </button>
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'brands'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    🏷️ Brand Logos
                </button>
            </div>

            {/* Catalog Images Tab */}
            {activeTab === 'catalog' && (
                <div className="grid gap-6">
                    {catalogCategories.map((category, index) => (
                        <div key={category.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="flex items-start gap-6">
                                {/* Image Preview */}
                                <div className="flex-shrink-0">
                                    <div className="w-48 h-32 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
                                        {catalogImages[category.key as keyof typeof catalogImages] ? (
                                            <Image
                                                src={catalogImages[category.key as keyof typeof catalogImages]}
                                                alt={category.title}
                                                width={192}
                                                height={128}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <div className="text-center">
                                                    <div className="text-2xl mb-2">🖼️</div>
                                                    <div className="text-sm">Professional Placeholder</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2 text-center">
                                        Category {index + 1}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">{category.title}</h3>
                                        <p className="text-slate-400 text-sm">{category.description}</p>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Upload Custom Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, category.key, 'catalog');
                                            }}
                                            disabled={uploading === `catalog_${category.key}`}
                                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:disabled:opacity-50"
                                        />
                                        {uploading === `catalog_${category.key}` && (
                                            <div className="mt-2 text-sm text-indigo-400">
                                                Uploading image...
                                            </div>
                                        )}
                                    </div>

                                    {/* URL Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Or Enter Image URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={catalogImages[category.key as keyof typeof catalogImages]}
                                                onChange={(e) => handleUrlChange(category.key, e.target.value, 'catalog')}
                                                placeholder="https://example.com/image.jpg"
                                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                onClick={() => handleSaveUrl(category.key, 'catalog')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                            >
                                                Save URL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Current URL Display */}
                                    {catalogImages[category.key as keyof typeof catalogImages] && (
                                        <div className="text-xs text-slate-400 break-all">
                                            Current: {catalogImages[category.key as keyof typeof catalogImages]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Brand Logos Tab */}
            {activeTab === 'brands' && (
                <div className="grid gap-6">
                    {brandProviders.map((brand, index) => (
                        <div key={brand.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="flex items-start gap-6">
                                {/* Logo Preview */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-20 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
                                        {brandLogos[brand.key as keyof typeof brandLogos] ? (
                                            <img
                                                src={brandLogos[brand.key as keyof typeof brandLogos]}
                                                alt={brand.title}
                                                className="w-full h-full object-contain bg-white"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <div className="text-center">
                                                    <div className="text-xl mb-1">🏷️</div>
                                                    <div className="text-xs">Logo</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2 text-center">
                                        Brand {index + 1}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">{brand.title}</h3>
                                        <p className="text-slate-400 text-sm">{brand.description}</p>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Upload Brand Logo
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, brand.key, 'brand');
                                            }}
                                            disabled={uploading === `brand_${brand.key}`}
                                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:disabled:opacity-50"
                                        />
                                        {uploading === `brand_${brand.key}` && (
                                            <div className="mt-2 text-sm text-indigo-400">
                                                Uploading logo...
                                            </div>
                                        )}
                                    </div>

                                    {/* URL Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Or Enter Logo URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={brandLogos[brand.key as keyof typeof brandLogos]}
                                                onChange={(e) => handleUrlChange(brand.key, e.target.value, 'brand')}
                                                placeholder="https://example.com/logo.png"
                                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                onClick={() => handleSaveUrl(brand.key, 'brand')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                            >
                                                Save URL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Current URL Display */}
                                    {brandLogos[brand.key as keyof typeof brandLogos] && (
                                        <div className="text-xs text-slate-400 break-all">
                                            Current: {brandLogos[brand.key as keyof typeof brandLogos]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">💡 Professional Image Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-md font-medium text-white mb-2">📸 Catalog Images</h4>
                        <ul className="text-slate-400 text-sm space-y-1">
                            <li>• <strong>Size:</strong> 600x400 pixels (3:2 aspect ratio)</li>
                            <li>• <strong>Format:</strong> JPG, PNG, WebP</li>
                            <li>• <strong>Quality:</strong> High resolution, professional</li>
                            <li>• <strong>Content:</strong> Relevant to service category</li>
                            <li>• <strong>Style:</strong> Consistent branding</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-medium text-white mb-2">🏷️ Brand Logos</h4>
                        <ul className="text-slate-400 text-sm space-y-1">
                            <li>• <strong>Size:</strong> 200x100 pixels (2:1 aspect ratio)</li>
                            <li>• <strong>Format:</strong> PNG with transparency preferred</li>
                            <li>• <strong>Background:</strong> Transparent or white</li>
                            <li>• <strong>Quality:</strong> Vector-based or high-res</li>
                            <li>• <strong>Usage:</strong> Official brand logos only</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Landing Page Manager Component with Drag & Drop
export const LandingPageManager = ({ settings, onSave, showNotification }: any) => {
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState<any>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Fetch catalogs from API
    useEffect(() => {
        fetchCatalogs();
    }, []);

    const fetchCatalogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data?type=deals');
            if (response.ok) {
                const data = await response.json();
                const catalogsWithSettings = data.data.map((catalog: any) => ({
                    ...catalog,
                    showOnLanding: catalog.show_on_landing !== false,
                    showOnHome: catalog.show_on_home !== false,
                    displayOrder: catalog.display_order || 999
                }));

                // Sort by display order
                catalogsWithSettings.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
                setCatalogs(catalogsWithSettings);
            }
        } catch (error) {
            console.error('Error fetching catalogs:', error);
            showNotification('Failed to fetch catalogs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, catalog: any, index: number) => {
        setDraggedItem({ catalog, index });
        e.dataTransfer.effectAllowed = 'move';

        // Add visual feedback
        const target = e.target as HTMLElement;
        target.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.index === dropIndex) {
            setDragOverIndex(null);
            return;
        }

        const newCatalogs = [...catalogs];
        const [movedItem] = newCatalogs.splice(draggedItem.index, 1);
        newCatalogs.splice(dropIndex, 0, movedItem);

        // Update display orders
        const updatedCatalogs = newCatalogs.map((catalog: any, index: number) => ({
            ...catalog,
            displayOrder: index + 1
        }));

        setCatalogs(updatedCatalogs);
        setDragOverIndex(null);

        // Save to database
        try {
            await saveCatalogOrder(updatedCatalogs);
            showNotification('Catalog order updated successfully!', 'success');
        } catch (error) {
            console.error('Error saving order:', error);
            showNotification('Failed to save catalog order', 'error');
            // Revert on error
            fetchCatalogs();
        }
    };

    const saveCatalogOrder = async (updatedCatalogs: any[]) => {
        const orderUpdates = updatedCatalogs.map((catalog: any) => ({
            id: catalog.id,
            display_order: catalog.displayOrder,
            show_on_landing: catalog.showOnLanding,
            show_on_home: catalog.showOnHome
        }));

        const response = await fetch('/api/admin/update-catalog-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ catalogs: orderUpdates }),
        });

        if (!response.ok) {
            throw new Error('Failed to update catalog order');
        }
    };

    const toggleVisibility = async (catalogId: string, field: 'showOnLanding' | 'showOnHome') => {
        const updatedCatalogs = catalogs.map((catalog: any) =>
            catalog.id === catalogId
                ? { ...catalog, [field]: !catalog[field] }
                : catalog
        );

        setCatalogs(updatedCatalogs);

        try {
            await saveCatalogOrder(updatedCatalogs);
            showNotification(`Catalog visibility updated!`, 'success');
        } catch (error) {
            console.error('Error updating visibility:', error);
            showNotification('Failed to update visibility', 'error');
            fetchCatalogs(); // Revert on error
        }
    };

    const moveToTop = async (catalogId: string) => {
        const catalogIndex = catalogs.findIndex((c: any) => c.id === catalogId);
        if (catalogIndex <= 0) return;

        const newCatalogs = [...catalogs];
        const [movedItem] = newCatalogs.splice(catalogIndex, 1);
        newCatalogs.unshift(movedItem);

        const updatedCatalogs = newCatalogs.map((catalog: any, index: number) => ({
            ...catalog,
            displayOrder: index + 1
        }));

        setCatalogs(updatedCatalogs);

        try {
            await saveCatalogOrder(updatedCatalogs);
            showNotification('Catalog moved to top!', 'success');
        } catch (error) {
            console.error('Error moving to top:', error);
            showNotification('Failed to move catalog', 'error');
            fetchCatalogs();
        }
    };

    const moveToBottom = async (catalogId: string) => {
        const catalogIndex = catalogs.findIndex((c: any) => c.id === catalogId);
        if (catalogIndex >= catalogs.length - 1) return;

        const newCatalogs = [...catalogs];
        const [movedItem] = newCatalogs.splice(catalogIndex, 1);
        newCatalogs.push(movedItem);

        const updatedCatalogs = newCatalogs.map((catalog: any, index: number) => ({
            ...catalog,
            displayOrder: index + 1
        }));

        setCatalogs(updatedCatalogs);

        try {
            await saveCatalogOrder(updatedCatalogs);
            showNotification('Catalog moved to bottom!', 'success');
        } catch (error) {
            console.error('Error moving to bottom:', error);
            showNotification('Failed to move catalog', 'error');
            fetchCatalogs();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Loading catalogs...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Landing Page Manager</h2>
                <p className="text-slate-400 mb-6">
                    Manage catalog visibility and order on landing page and home page. Drag and drop to reorder catalogs.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-white">{catalogs.length}</div>
                    <div className="text-slate-400 text-sm">Total Catalogs</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-green-400">
                        {catalogs.filter((c: any) => c.showOnLanding).length}
                    </div>
                    <div className="text-slate-400 text-sm">On Landing Page</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-blue-400">
                        {catalogs.filter((c: any) => c.showOnHome).length}
                    </div>
                    <div className="text-slate-400 text-sm">On Home Page</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-purple-400">
                        {catalogs.filter((c: any) => c.showOnLanding && c.showOnHome).length}
                    </div>
                    <div className="text-slate-400 text-sm">On Both Pages</div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-700">
                <h3 className="text-lg font-semibold text-white mb-3">🎯 How to Use</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div>
                        <h4 className="font-medium text-white mb-2">🖱️ Drag & Drop:</h4>
                        <ul className="space-y-1">
                            <li>• Drag catalog cards to reorder them</li>
                            <li>• Drop zones will highlight when dragging</li>
                            <li>• Order saves automatically</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-white mb-2">👁️ Visibility Controls:</h4>
                        <ul className="space-y-1">
                            <li>• Toggle "Landing" to show/hide on landing page</li>
                            <li>• Toggle "Home" to show/hide on home page</li>
                            <li>• Use quick actions for top/bottom moves</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Catalog List */}
            <div className="space-y-4">
                {catalogs.map((catalog: any, index: number) => (
                    <div
                        key={catalog.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, catalog, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`bg-slate-800 rounded-xl p-6 border transition-all duration-200 cursor-move ${
                            dragOverIndex === index
                                ? 'border-indigo-500 bg-slate-700'
                                : 'border-slate-700 hover:border-slate-600'
                        }`}
                    >
                        <div className="flex items-center gap-6">
                            {/* Drag Handle & Order */}
                            <div className="flex-shrink-0 text-center">
                                <div className="text-2xl text-slate-400 mb-1">⋮⋮</div>
                                <div className="text-sm font-bold text-white bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center">
                                    {index + 1}
                                </div>
                            </div>

                            {/* Catalog Image */}
                            <div className="flex-shrink-0">
                                <div className="w-20 h-14 bg-slate-700 rounded-lg overflow-hidden">
                                    <img
                                        src={catalog.image || catalog.catalog_image || 'https://via.placeholder.com/80x56'}
                                        alt={catalog.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Catalog Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">{catalog.name}</h3>
                                <p className="text-slate-400 text-sm">{catalog.provider} • {catalog.type}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-green-400 font-medium">${catalog.price}</span>
                                    {catalog.discount && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                                            {catalog.discount}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Visibility Controls */}
                            <div className="flex-shrink-0 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300 w-16">Landing:</span>
                                    <button
                                        onClick={() => toggleVisibility(catalog.id, 'showOnLanding')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            catalog.showOnLanding
                                                ? 'bg-green-600'
                                                : 'bg-slate-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            catalog.showOnLanding ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300 w-16">Home:</span>
                                    <button
                                        onClick={() => toggleVisibility(catalog.id, 'showOnHome')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            catalog.showOnHome
                                                ? 'bg-blue-600'
                                                : 'bg-slate-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            catalog.showOnHome ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex-shrink-0 flex flex-col gap-2">
                                <button
                                    onClick={() => moveToTop(catalog.id)}
                                    disabled={index === 0}
                                    className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                    title="Move to Top"
                                >
                                    ⬆️
                                </button>
                                <button
                                    onClick={() => moveToBottom(catalog.id)}
                                    disabled={index === catalogs.length - 1}
                                    className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                    title="Move to Bottom"
                                >
                                    ⬇️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {catalogs.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Catalogs Found</h3>
                    <p className="text-slate-400">Add some catalogs to manage their display order.</p>
                </div>
            )}
        </div>
    );
};

// =================================================================================
// SECTION 10: NEW ADMIN FEATURES
// =================================================================================

// Template Management Component
export const TemplateManagement = ({ showNotification }: any) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        // Load templates from localStorage or API
        const loadTemplates = () => {
            try {
                const stored = localStorage.getItem('website_templates');
                if (stored) {
                    setTemplates(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Error loading templates:', error);
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    const handleDeleteTemplate = (templateId: string) => {
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
        localStorage.setItem('website_templates', JSON.stringify(updatedTemplates));
        showNotification('Template deleted successfully', 'success');
    };

    const handleToggleFree = (templateId: string) => {
        const updatedTemplates = templates.map(t =>
            t.id === templateId ? { ...t, is_free: !t.is_free } : t
        );
        setTemplates(updatedTemplates);
        localStorage.setItem('website_templates', JSON.stringify(updatedTemplates));
        showNotification('Template updated successfully', 'success');
    };

    if (loading) {
        return (
            <div className="bg-slate-800 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-blue-400" />
                    Website Templates Management
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowEditor(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Template
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <div key={template.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="aspect-video bg-slate-600 rounded-lg mb-3 overflow-hidden">
                            {template.preview_image ? (
                                <img
                                    src={template.preview_image}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <BookOpen size={32} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                        <p className="text-slate-300 text-sm mb-3">{template.category}</p>

                        <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                                template.is_free
                                    ? 'bg-green-600 text-white'
                                    : 'bg-orange-600 text-white'
                            }`}>
                                {template.is_free ? 'Free' : `$${template.price}`}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs">{template.rating || 5.0}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleToggleFree(template.id)}
                                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded text-sm"
                            >
                                {template.is_free ? 'Make Paid' : 'Make Free'}
                            </button>
                            <button
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No Templates Yet</h3>
                    <p className="text-slate-400 mb-4">Start by adding your first website template</p>
                    <button
                        onClick={() => setShowEditor(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Add First Template
                    </button>
                </div>
            )}
        </div>
    );
};

// Enhanced Email & WhatsApp Marketing Management Component
export const EmailMarketingManagement = ({ showNotification }: any) => {
    const [emails, setEmails] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [emailContent, setEmailContent] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [activeTab, setActiveTab] = useState('email');
    const [followUpSequence, setFollowUpSequence] = useState<any[]>([]);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

    useEffect(() => {
        // Load captured emails and phone numbers
        const loadContacts = () => {
            try {
                const capturedEmails = JSON.parse(localStorage.getItem('captured_emails') || '[]');
                const gamificationEmails = JSON.parse(localStorage.getItem('gamification_users') || '[]');
                const newsletterEmails = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
                const allEmails = [...capturedEmails, ...gamificationEmails, ...newsletterEmails];
                setEmails(allEmails);

                // Load phone numbers from various sources
                const capturedPhones = JSON.parse(localStorage.getItem('captured_phones') || '[]');
                const whatsappContacts = JSON.parse(localStorage.getItem('whatsapp_contacts') || '[]');
                const allPhones = [...capturedPhones, ...whatsappContacts];
                setPhoneNumbers(allPhones);

                // Load existing campaigns
                const existingCampaigns = JSON.parse(localStorage.getItem('email_campaigns') || '[]');
                setCampaigns(existingCampaigns);

                // Load follow-up sequences
                const sequences = JSON.parse(localStorage.getItem('follow_up_sequences') || '[]');
                setFollowUpSequence(sequences);
            } catch (error) {
                console.error('Error loading contacts:', error);
            }
        };
        loadContacts();
    }, []);

    const handleSendEmailBroadcast = async () => {
        if (!emailSubject.trim() || !emailContent.trim()) {
            showNotification('Please fill in subject and content', 'error');
            return;
        }

        if (selectedEmails.length === 0) {
            showNotification('Please select at least one email', 'error');
            return;
        }

        setIsSending(true);
        try {
            // Simulate sending emails with realistic delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const campaign = {
                id: Date.now().toString(),
                type: 'email',
                subject: emailSubject,
                content: emailContent,
                recipients: selectedEmails.length,
                sent_at: new Date().toISOString(),
                status: 'sent',
                open_rate: Math.floor(Math.random() * 40) + 20, // Simulate 20-60% open rate
                click_rate: Math.floor(Math.random() * 15) + 5   // Simulate 5-20% click rate
            };

            const existingCampaigns = JSON.parse(localStorage.getItem('email_campaigns') || '[]');
            existingCampaigns.push(campaign);
            localStorage.setItem('email_campaigns', JSON.stringify(existingCampaigns));
            setCampaigns(existingCampaigns);

            showNotification(`Email sent to ${selectedEmails.length} recipients`, 'success');
            setEmailSubject('');
            setEmailContent('');
            setSelectedEmails([]);

            // Schedule follow-up if enabled
            if (followUpSequence.length > 0) {
                scheduleFollowUp(selectedEmails, followUpSequence);
            }
        } catch (error) {
            showNotification('Failed to send emails', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendWhatsAppBroadcast = async () => {
        if (!whatsappMessage.trim()) {
            showNotification('Please fill in WhatsApp message', 'error');
            return;
        }

        if (phoneNumbers.length === 0) {
            showNotification('No phone numbers available', 'error');
            return;
        }

        setIsSending(true);
        try {
            // Simulate WhatsApp broadcast
            await new Promise(resolve => setTimeout(resolve, 1500));

            const campaign = {
                id: Date.now().toString(),
                type: 'whatsapp',
                message: whatsappMessage,
                recipients: phoneNumbers.length,
                sent_at: new Date().toISOString(),
                status: 'sent',
                delivery_rate: Math.floor(Math.random() * 20) + 80 // Simulate 80-100% delivery rate
            };

            const existingCampaigns = JSON.parse(localStorage.getItem('email_campaigns') || '[]');
            existingCampaigns.push(campaign);
            localStorage.setItem('email_campaigns', JSON.stringify(existingCampaigns));
            setCampaigns(existingCampaigns);

            showNotification(`WhatsApp message sent to ${phoneNumbers.length} contacts`, 'success');
            setWhatsappMessage('');
        } catch (error) {
            showNotification('Failed to send WhatsApp messages', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const scheduleFollowUp = (recipients: string[], sequence: any[]) => {
        sequence.forEach((followUp, index) => {
            setTimeout(() => {
                // Simulate follow-up email sending
                console.log(`Sending follow-up ${index + 1} to ${recipients.length} recipients`);
                showNotification(`Follow-up ${index + 1} scheduled`, 'info');
            }, followUp.delay * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        });
    };

    const generateAIContent = async (type: 'new_catalog' | 'discount' | 'newsletter' | 'voucher' | 'promo' | 'blog' | 'feature') => {
        setAiGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing

            const templates = {
                new_catalog: {
                    subject: '🚀 Fresh Hosting Deals Just Dropped - Don\'t Miss Out!',
                    content: `Hey there, savvy website owner! 👋

We've just unleashed some absolutely incredible hosting deals that are going to blow your mind! 🤯

✨ What's Hot Right Now:
• Premium hosting plans with INSANE discounts (up to 85% OFF!)
• Exclusive coupon codes that'll make your wallet happy
• Limited-time offers from the industry's top providers
• Free domains, SSL certificates, and premium features included

🎯 Why You Need to Act NOW:
• These deals are flying off the virtual shelves
• Save hundreds of dollars on your hosting costs
• Perfect timing for your next big project launch
• Our community is already raving about these offers

💡 Pro Tip: The early bird gets the best deals - and the best hosting!

👉 [Explore All New Deals - Click Here]

Don't let FOMO kick in later. These prices won't last!

Cheers to your success,
The HostVoucher Dream Team 🚀`
                },
                discount: {
                    subject: '⚡ FLASH SALE: 70% OFF Everything - 24 Hours Only!',
                    content: `🚨 URGENT: This is NOT a drill! 🚨

We're having an absolutely MASSIVE flash sale that ends in 24 hours!

🔥 INSANE OFFER ALERT:
• 70% OFF ALL premium hosting plans
• Use code: FLASH70NOW
• FREE domain + SSL certificate included
• Money-back guarantee (because we're that confident!)

💰 What This Means for You:
• Premium hosting for less than a coffee per month
• Professional website setup in minutes
• 24/7 support from real humans (not bots!)
• Lightning-fast loading speeds that Google loves

⏰ COUNTDOWN ACTIVE: Only 24 hours left!

This is the kind of deal that comes once in a blue moon. Our community members are already jumping on this - don't be the one who missed out!

[CLAIM YOUR 70% DISCOUNT NOW - HURRY!]

Time's ticking... ⏰

Your success partner,
HostVoucher Team`
                },
                newsletter: {
                    subject: '📈 Weekly Insider: Secret Deals + Pro Tips That Actually Work',
                    content: `Hello, fellow website warrior! 💪

Welcome to your weekly dose of hosting gold and web wisdom that actually moves the needle! 📊

🏆 This Week's Exclusive Insider Deals:
• Hostinger: 78% OFF + Free Domain (Insider Code: INSIDER78)
• Bluehost: 65% OFF WordPress Hosting + Free Marketing Credits
• SiteGround: 72% OFF Cloud Hosting + Free CDN
• A2 Hosting: 67% OFF + Free Site Migration

💡 Game-Changing Tip of the Week:
"Speed is the new SEO." Websites loading in under 2 seconds get 47% more conversions. Here's how to achieve it: [Read Full Guide]

🎯 What's Trending in Our Community:
• WordPress 6.4: The features that actually matter
• AI tools that are revolutionizing web design
• The hosting mistake that's killing 73% of small businesses

📊 Success Story Spotlight:
"Thanks to HostVoucher's recommendations, my site speed increased by 340% and my sales doubled!" - Sarah M., E-commerce Owner

[Read This Week's Full Newsletter + Exclusive Bonuses]

Keep crushing it!
The HostVoucher Insider Team 🎯`
                },
                voucher: {
                    subject: '🎫 Exclusive Voucher Alert: Your Personal Discount Inside!',
                    content: `Hey there, VIP member! 🌟

We've got something special just for YOU - a personalized voucher that's about to make your day!

🎫 YOUR EXCLUSIVE VOUCHER:
Code: VIP${Math.random().toString(36).substr(2, 8).toUpperCase()}
Discount: 60% OFF any hosting plan
Valid: Next 72 hours only
Bonus: Free premium themes worth $200

🎯 Why This Voucher is Special:
• Hand-picked based on your browsing history
• Higher discount than our public offers
• Includes premium bonuses not available elsewhere
• Priority customer support access

💡 Perfect Timing Because:
• New year, new website goals
• Hosting prices are about to increase industry-wide
• Your current hosting might be holding you back

[REDEEM YOUR EXCLUSIVE VOUCHER NOW]

This voucher is non-transferable and expires in 72 hours. Don't let it go to waste!

Your success is our mission,
HostVoucher VIP Team 💎`
                },
                promo: {
                    subject: '🎉 MEGA PROMO: Stack Multiple Discounts for Maximum Savings!',
                    content: `🎊 PROMO STACKING ALERT! 🎊

We're breaking our own rules and letting you stack multiple promos for INSANE savings!

🔥 THE MEGA PROMO STACK:
• Base Discount: 50% OFF
• Stack Bonus: Additional 20% OFF
• Loyalty Bonus: Extra 10% OFF
• Total Savings: Up to 80% OFF!

💰 How to Stack Your Savings:
1. Choose any premium hosting plan
2. Apply code: MEGASTACK50
3. Add loyalty code: LOYAL20
4. Get automatic 10% bonus applied
5. Watch your savings multiply!

🎯 Limited Time Stacking Rules:
• Maximum 3 codes per order
• Valid for next 48 hours only
• Cannot be combined with other mega offers
• First 100 customers only

⚡ BONUS STACK ITEMS:
• Free domain for life
• Free SSL certificate
• Free website migration
• Free premium themes bundle

[START STACKING YOUR SAVINGS NOW]

This is the biggest promo stack we've ever offered. Our accountant is crying, but our customers are celebrating! 🎉

Stack 'em high!
HostVoucher Promo Team`
                },
                blog: {
                    subject: '📝 New Blog Post: The Hosting Secret That Increased Conversions by 340%',
                    content: `Hey there, growth hacker! 📈

We just published a game-changing blog post that's already causing a stir in the web community!

📝 FRESH FROM THE BLOG:
"The Hidden Hosting Feature That Boosted Conversions by 340% (And Why 90% of Website Owners Don't Know About It)"

🎯 What You'll Discover:
• The overlooked hosting feature that's a conversion goldmine
• Real case studies with actual numbers (not fluff!)
• Step-by-step implementation guide
• Common mistakes that kill conversions
• Free tools to measure your improvement

💡 Why This Matters to You:
• Your hosting choice directly impacts your bottom line
• Small changes can create massive results
• Your competitors probably don't know this secret
• Implementation takes less than 30 minutes

🔥 BONUS CONTENT INCLUDED:
• Free conversion optimization checklist
• Exclusive hosting recommendations
• Video walkthrough (premium content)
• Community discussion access

[READ THE FULL BLOG POST + GET BONUSES]

This isn't just another blog post - it's a roadmap to higher conversions and better business results.

Happy reading (and converting)!
The HostVoucher Content Team 📚`
                },
                feature: {
                    subject: '🚀 NEW FEATURE ALERT: Game-Changing Tool Just Launched!',
                    content: `🎉 EXCITING NEWS ALERT! 🎉

We just launched a revolutionary new feature that's going to transform how you manage your hosting!

🚀 INTRODUCING: Smart Hosting Optimizer
The AI-powered tool that automatically optimizes your hosting performance!

✨ What It Does:
• Analyzes your website's performance in real-time
• Automatically adjusts server resources for peak performance
• Predicts traffic spikes and scales accordingly
• Optimizes database queries for faster loading
• Provides actionable insights and recommendations

🎯 The Results Speak for Themselves:
• 67% faster loading times on average
• 45% reduction in server costs
• 89% fewer performance issues
• 24/7 automatic optimization (while you sleep!)

💡 Why This is a Game-Changer:
• No technical knowledge required
• Works with any hosting provider
• Pays for itself through improved performance
• Your competitors don't have access yet

🔥 LAUNCH WEEK SPECIAL:
• 50% OFF first 3 months
• Free setup and migration
• Personal onboarding session
• 30-day money-back guarantee

[TRY SMART HOSTING OPTIMIZER NOW]

This is the future of hosting management, available today!

Innovation never stops,
HostVoucher Innovation Team 🔬`
                }
            };

            const template = templates[type];
            if (activeTab === 'email') {
                setEmailSubject(template.subject);
                setEmailContent(template.content);
            } else {
                // Generate WhatsApp version (shorter, more casual)
                const whatsappContent = `🚀 ${template.subject.replace(/📧|📨|📬|📰|📝/, '').trim()}

${template.content.split('\n').slice(0, 8).join('\n')}

💬 Reply STOP to unsubscribe
🔗 Full details: hostvoucher.com`;
                setWhatsappMessage(whatsappContent);
            }

            showNotification(`AI content generated for ${type.replace('_', ' ')}`, 'success');
        } catch (error) {
            showNotification('Failed to generate AI content', 'error');
        } finally {
            setAiGenerating(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Mail className="text-green-400" />
                    Enhanced Marketing Broadcast Center
                </h2>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400">
                        📧 Emails: {emails.length} | 📱 WhatsApp: {phoneNumbers.length}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('email')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'email'
                            ? 'bg-green-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    📧 Email Marketing
                </button>
                <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'whatsapp'
                            ? 'bg-green-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    📱 WhatsApp Broadcast
                </button>
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'campaigns'
                            ? 'bg-green-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    📊 Campaign History
                </button>
            </div>

            {/* Email Marketing Tab */}
            {activeTab === 'email' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Email List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">📧 Email Recipients ({emails.length})</h3>
                        <div className="bg-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-4">
                                <button
                                    onClick={() => setSelectedEmails(emails.map(e => e.email))}
                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => setSelectedEmails([])}
                                    className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                >
                                    Clear All
                                </button>
                                <span className="text-xs text-slate-400">
                                    {selectedEmails.length} selected
                                </span>
                            </div>

                            {emails.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No email addresses captured yet</p>
                                </div>
                            ) : (
                                emails.map((email, index) => (
                                    <div key={index} className="flex items-center gap-2 py-2 border-b border-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmails.includes(email.email)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedEmails([...selectedEmails, email.email]);
                                                } else {
                                                    setSelectedEmails(selectedEmails.filter(e => e !== email.email));
                                                }
                                            }}
                                            className="rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="text-white text-sm">{email.email}</div>
                                            <div className="text-slate-400 text-xs">
                                                {email.source || 'Gamification'} • {new Date(email.timestamp || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Email Composer */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">✍️ Compose Email</h3>

                        {/* AI Content Generator */}
                        <div className="bg-slate-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-white mb-3">🤖 AI Marketing Assistant</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => generateAIContent('new_catalog')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                                >
                                    📦 New Catalog
                                </button>
                                <button
                                    onClick={() => generateAIContent('discount')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                                >
                                    💰 Discount Alert
                                </button>
                                <button
                                    onClick={() => generateAIContent('voucher')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-pink-600 text-white px-3 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
                                >
                                    🎫 Voucher Alert
                                </button>
                                <button
                                    onClick={() => generateAIContent('promo')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                    🎉 Mega Promo
                                </button>
                                <button
                                    onClick={() => generateAIContent('blog')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    📝 Blog Post
                                </button>
                                <button
                                    onClick={() => generateAIContent('feature')}
                                    disabled={aiGenerating}
                                    className="text-xs bg-cyan-600 text-white px-3 py-2 rounded hover:bg-cyan-700 disabled:opacity-50"
                                >
                                    🚀 New Feature
                                </button>
                            </div>
                            {aiGenerating && (
                                <div className="mt-2 text-xs text-blue-400 flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    AI is generating content...
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">📧 Subject Line</label>
                            <input
                                type="text"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                                placeholder="Enter compelling subject line..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">✍️ Email Content</label>
                            <textarea
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                rows={12}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                                placeholder="Write your marketing message here..."
                            />
                        </div>

                        <button
                            onClick={handleSendEmailBroadcast}
                            disabled={isSending || selectedEmails.length === 0}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending Emails...
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    📧 Send to {selectedEmails.length} Recipients
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* WhatsApp Marketing Tab */}
            {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">📱 WhatsApp Broadcast Center</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Phone Numbers */}
                            <div className="space-y-4">
                                <h4 className="text-md font-medium text-white">📞 Contact List ({phoneNumbers.length})</h4>
                                <div className="bg-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    {phoneNumbers.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400">
                                            <div className="text-4xl mb-2">📱</div>
                                            <p>No WhatsApp contacts yet</p>
                                            <p className="text-xs mt-1">Contacts will be collected from user interactions</p>
                                        </div>
                                    ) : (
                                        phoneNumbers.map((phone, index) => (
                                            <div key={index} className="flex items-center gap-2 py-2 border-b border-slate-500">
                                                <div className="text-green-400">📱</div>
                                                <div className="text-white text-sm">{phone}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Message Composer */}
                            <div className="space-y-4">
                                <h4 className="text-md font-medium text-white">✍️ Compose WhatsApp Message</h4>

                                {/* AI Templates for WhatsApp */}
                                <div className="bg-slate-600 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-white mb-3">🤖 AI WhatsApp Templates</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => generateAIContent('new_catalog')}
                                            disabled={aiGenerating}
                                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                                        >
                                            📦 New Deals
                                        </button>
                                        <button
                                            onClick={() => generateAIContent('discount')}
                                            disabled={aiGenerating}
                                            className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 disabled:opacity-50"
                                        >
                                            💰 Flash Sale
                                        </button>
                                        <button
                                            onClick={() => generateAIContent('voucher')}
                                            disabled={aiGenerating}
                                            className="text-xs bg-pink-600 text-white px-2 py-1 rounded hover:bg-pink-700 disabled:opacity-50"
                                        >
                                            🎫 Voucher
                                        </button>
                                        <button
                                            onClick={() => generateAIContent('promo')}
                                            disabled={aiGenerating}
                                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                                        >
                                            🎉 Promo
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">📱 WhatsApp Message</label>
                                    <textarea
                                        value={whatsappMessage}
                                        onChange={(e) => setWhatsappMessage(e.target.value)}
                                        rows={8}
                                        className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                                        placeholder="Write your WhatsApp message here... (Keep it short and engaging)"
                                    />
                                    <div className="text-xs text-slate-400 mt-1">
                                        Character count: {whatsappMessage.length}/1000
                                    </div>
                                </div>

                                <button
                                    onClick={handleSendWhatsAppBroadcast}
                                    disabled={isSending || phoneNumbers.length === 0}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                                >
                                    {isSending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending WhatsApp...
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-lg">📱</div>
                                            Send to {phoneNumbers.length} WhatsApp Contacts
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Campaign History Tab */}
            {activeTab === 'campaigns' && (
                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">📊 Campaign History & Analytics</h3>

                        {campaigns.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <div className="text-6xl mb-4">📊</div>
                                <h4 className="text-lg font-medium text-white mb-2">No campaigns sent yet</h4>
                                <p>Your email and WhatsApp campaigns will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((campaign, index) => (
                                    <div key={campaign.id} className="bg-slate-600 rounded-lg p-4 border border-slate-500">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">
                                                        {campaign.type === 'email' ? '📧' : '📱'}
                                                    </span>
                                                    <h4 className="text-white font-medium">
                                                        {campaign.subject || campaign.message?.substring(0, 50) + '...'}
                                                    </h4>
                                                </div>
                                                <div className="text-slate-400 text-sm">
                                                    {new Date(campaign.sent_at).toLocaleString()} • {campaign.recipients} recipients
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    campaign.status === 'sent' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                                }`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                        </div>

                                        {campaign.type === 'email' && (
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-400">{campaign.open_rate}%</div>
                                                    <div className="text-xs text-slate-400">Open Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-400">{campaign.click_rate}%</div>
                                                    <div className="text-xs text-slate-400">Click Rate</div>
                                                </div>
                                            </div>
                                        )}

                                        {campaign.type === 'whatsapp' && (
                                            <div className="text-center mt-3">
                                                <div className="text-2xl font-bold text-green-400">{campaign.delivery_rate}%</div>
                                                <div className="text-xs text-slate-400">Delivery Rate</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Enhanced NFT Gamification Management Component with Annual Activation
export const NFTGamificationManagement = ({ showNotification }: any) => {
    const [nftRequests, setNftRequests] = useState<any[]>([]);
    const [ethAddresses, setEthAddresses] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('redemptions');
    const [nftSettings, setNftSettings] = useState({
        enabled: true,
        pointsRequired: 1000000, // 1 million points
        nftName: 'HostVoucher Premium NFT 2025',
        nftDescription: 'Exclusive NFT for HostVoucher community members with special benefits',
        annualActivation: true,
        activationDate: '2024-10-30', // October 30th
        redemptionWindow: 30, // 30 days window
        maxRedemptions: 1000,
        currentRedemptions: 0,
        nftCollections: [
            {
                id: 'hostvoucher_premium',
                name: 'HostVoucher Premium Collection',
                description: 'Exclusive NFTs for premium members',
                maxSupply: 500,
                currentSupply: 0,
                pointsCost: 1000000,
                benefits: ['10% lifetime discount', 'Priority support', 'Exclusive deals access', 'VIP community access']
            },
            {
                id: 'hostvoucher_legendary',
                name: 'HostVoucher Legendary Collection',
                description: 'Ultra-rare NFTs for top contributors',
                maxSupply: 100,
                currentSupply: 0,
                pointsCost: 5000000,
                benefits: ['25% lifetime discount', 'Personal account manager', 'Beta feature access', 'Revenue sharing program']
            }
        ]
    });

    useEffect(() => {
        // Load NFT data
        const loadNFTData = () => {
            try {
                const requests = JSON.parse(localStorage.getItem('nft_redemption_requests') || '[]');
                const addresses = JSON.parse(localStorage.getItem('eth_addresses') || '[]');
                const settings = JSON.parse(localStorage.getItem('nft_settings') || JSON.stringify(nftSettings));

                setNftRequests(requests);
                setEthAddresses(addresses);
                setNftSettings({...nftSettings, ...settings});
            } catch (error) {
                console.error('Error loading NFT data:', error);
            }
        };
        loadNFTData();
    }, []);

    const handleMarkAsSent = (addressId: string) => {
        const updatedAddresses = ethAddresses.map(addr =>
            addr.id === addressId ? { ...addr, nft_sent: true, sent_date: new Date().toISOString() } : addr
        );
        setEthAddresses(updatedAddresses);
        localStorage.setItem('eth_addresses', JSON.stringify(updatedAddresses));
        showNotification('NFT marked as sent successfully', 'success');
    };

    const handleRejectRedemption = (addressId: string, reason: string) => {
        const updatedAddresses = ethAddresses.map(addr =>
            addr.id === addressId ? {
                ...addr,
                status: 'rejected',
                rejection_reason: reason,
                rejected_date: new Date().toISOString()
            } : addr
        );
        setEthAddresses(updatedAddresses);
        localStorage.setItem('eth_addresses', JSON.stringify(updatedAddresses));
        showNotification('Redemption rejected', 'info');
    };

    const isRedemptionActive = () => {
        if (!nftSettings.annualActivation) return nftSettings.enabled;

        const now = new Date();
        const currentYear = now.getFullYear();
        const activationDate = new Date(`${currentYear}-10-30`);
        const endDate = new Date(activationDate);
        endDate.setDate(endDate.getDate() + nftSettings.redemptionWindow);

        return nftSettings.enabled && now >= activationDate && now <= endDate;
    };

    const getRedemptionStatus = () => {
        if (!nftSettings.enabled) return 'disabled';
        if (!nftSettings.annualActivation) return 'active';

        const now = new Date();
        const currentYear = now.getFullYear();
        const activationDate = new Date(`${currentYear}-10-30`);
        const endDate = new Date(activationDate);
        endDate.setDate(endDate.getDate() + nftSettings.redemptionWindow);

        if (now < activationDate) return 'upcoming';
        if (now > endDate) return 'expired';
        return 'active';
    };

    const handleMarkNFTAsSent = (addressId: string, nftHash?: string) => {
        const updatedAddresses = ethAddresses.map(addr =>
            addr.id === addressId ? {
                ...addr,
                nft_sent: true,
                sent_date: new Date().toISOString(),
                nft_hash: nftHash || '',
                status: 'completed'
            } : addr
        );
        setEthAddresses(updatedAddresses);
        localStorage.setItem('eth_addresses', JSON.stringify(updatedAddresses));
        showNotification('NFT marked as sent successfully', 'success');
    };

    const handleUpdateSettings = () => {
        localStorage.setItem('nft_settings', JSON.stringify(nftSettings));
        showNotification('NFT settings updated successfully', 'success');
    };

    const handleToggleNFTSystem = () => {
        const newSettings = { ...nftSettings, enabled: !nftSettings.enabled };
        setNftSettings(newSettings);
        localStorage.setItem('nft_settings', JSON.stringify(newSettings));
        showNotification(`NFT system ${newSettings.enabled ? 'enabled' : 'disabled'}`, 'success');
    };

    const handleToggleAnnualActivation = () => {
        const newSettings = { ...nftSettings, annualActivation: !nftSettings.annualActivation };
        setNftSettings(newSettings);
        localStorage.setItem('nft_settings', JSON.stringify(newSettings));
        showNotification(`Annual activation ${newSettings.annualActivation ? 'enabled' : 'disabled'}`, 'success');
    };

    const handleUpdateCollection = (collectionId: string, updates: any) => {
        const newCollections = nftSettings.nftCollections.map(collection =>
            collection.id === collectionId ? { ...collection, ...updates } : collection
        );
        const newSettings = { ...nftSettings, nftCollections: newCollections };
        setNftSettings(newSettings);
        localStorage.setItem('nft_settings', JSON.stringify(newSettings));
        showNotification('Collection updated successfully', 'success');
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Gem className="text-purple-400" />
                    NFT Gamification Management
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">NFT System:</span>
                    <button
                        onClick={handleToggleNFTSystem}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                            nftSettings.enabled
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                        }`}
                    >
                        {nftSettings.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('redemptions')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'redemptions'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    💎 Redemption Requests
                </button>
                <button
                    onClick={() => setActiveTab('collections')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'collections'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    🎨 NFT Collections
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'settings'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    ⚙️ Settings
                </button>
            </div>

            {/* Redemption Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${
                getRedemptionStatus() === 'active' ? 'bg-green-900/30 border-green-600' :
                getRedemptionStatus() === 'upcoming' ? 'bg-yellow-900/30 border-yellow-600' :
                getRedemptionStatus() === 'expired' ? 'bg-red-900/30 border-red-600' :
                'bg-gray-900/30 border-gray-600'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {getRedemptionStatus() === 'active' && '🟢 NFT Redemption Active'}
                            {getRedemptionStatus() === 'upcoming' && '🟡 NFT Redemption Coming Soon'}
                            {getRedemptionStatus() === 'expired' && '🔴 NFT Redemption Period Ended'}
                            {getRedemptionStatus() === 'disabled' && '⚫ NFT Redemption Disabled'}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {nftSettings.annualActivation
                                ? `Annual activation: October 30th - ${nftSettings.redemptionWindow} days window`
                                : 'Always active when enabled'
                            }
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                            {nftSettings.currentRedemptions}/{nftSettings.maxRedemptions}
                        </div>
                        <div className="text-xs text-slate-400">Redemptions</div>
                    </div>
                </div>
            </div>

            {/* Redemption Requests Tab */}
            {activeTab === 'redemptions' && (
                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">💎 NFT Redemption Requests</h3>

                        {ethAddresses.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Gem className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h4 className="text-lg font-medium text-white mb-2">No redemption requests yet</h4>
                                <p>Users will appear here when they redeem NFTs with their points</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ethAddresses.map((address) => (
                                    <div key={address.id} className="bg-slate-600 border border-slate-500 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">💎</span>
                                                    <div className="text-white font-medium">{address.email}</div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        address.nft_sent ? 'bg-green-600 text-white' :
                                                        address.status === 'rejected' ? 'bg-red-600 text-white' :
                                                        'bg-yellow-600 text-white'
                                                    }`}>
                                                        {address.nft_sent ? 'Sent' :
                                                         address.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="text-slate-300 text-sm font-mono break-all mb-2">
                                                    🔗 {address.eth_address}
                                                </div>
                                                <div className="text-slate-400 text-xs">
                                                    Points Used: {address.points?.toLocaleString()} •
                                                    Requested: {new Date(address.timestamp).toLocaleDateString()} •
                                                    Collection: {address.collection || 'Premium'}
                                                </div>
                                                {address.nft_hash && (
                                                    <div className="text-green-400 text-xs mt-1">
                                                        NFT Hash: {address.nft_hash}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!address.nft_sent && address.status !== 'rejected' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleMarkNFTAsSent(address.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                                        >
                                                            ✅ Mark as Sent
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRedemption(address.id, 'Invalid address')}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleCopyEthAddress(address.eth_address)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    📋 Copy
                                                </button>
                                            </div>
                                        </div>
                                        {address.nft_sent && address.sent_date && (
                                            <div className="text-green-400 text-xs">
                                                ✅ Sent on: {new Date(address.sent_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        {address.status === 'rejected' && address.rejection_reason && (
                                            <div className="text-red-400 text-xs">
                                                ❌ Rejected: {address.rejection_reason} on {new Date(address.rejected_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NFT Collections Tab */}
            {activeTab === 'collections' && (
                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">🎨 NFT Collections Management</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {nftSettings.nftCollections.map((collection) => (
                                <div key={collection.id} className="bg-slate-600 border border-slate-500 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="text-white font-medium">{collection.name}</h4>
                                            <p className="text-slate-400 text-sm">{collection.description}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                                            {collection.currentSupply}/{collection.maxSupply}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Points Required:</span>
                                            <span className="text-yellow-400 font-medium">
                                                {collection.pointsCost.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Supply Progress:</span>
                                            <span className="text-white">
                                                {Math.round((collection.currentSupply / collection.maxSupply) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm text-slate-400 mb-2">Benefits:</div>
                                        <div className="space-y-1">
                                            {collection.benefits.map((benefit, index) => (
                                                <div key={index} className="text-xs text-green-400 flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                                                    {benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="w-full bg-slate-500 rounded-full h-2 mb-3">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full"
                                            style={{width: `${(collection.currentSupply / collection.maxSupply) * 100}%`}}
                                        ></div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdateCollection(collection.id, { currentSupply: collection.currentSupply + 1 })}
                                        disabled={collection.currentSupply >= collection.maxSupply}
                                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                                    >
                                        Mint NFT (+1)
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic NFT Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">⚙️ Basic NFT Settings</h3>
                        <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Default Points Required for NFT
                                </label>
                                <input
                                    type="number"
                                    value={nftSettings.pointsRequired}
                                    onChange={(e) => setNftSettings({
                                        ...nftSettings,
                                        pointsRequired: parseInt(e.target.value) || 1000000
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    NFT Collection Name
                                </label>
                                <input
                                    type="text"
                                    value={nftSettings.nftName}
                                    onChange={(e) => setNftSettings({
                                        ...nftSettings,
                                        nftName: e.target.value
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    NFT Description
                                </label>
                                <textarea
                                    value={nftSettings.nftDescription}
                                    onChange={(e) => setNftSettings({
                                        ...nftSettings,
                                        nftDescription: e.target.value
                                    })}
                                    rows={3}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Maximum Redemptions
                                </label>
                                <input
                                    type="number"
                                    value={nftSettings.maxRedemptions}
                                    onChange={(e) => setNftSettings({
                                        ...nftSettings,
                                        maxRedemptions: parseInt(e.target.value) || 1000
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>

                            <button
                                onClick={handleUpdateSettings}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                💾 Update Basic Settings
                            </button>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">🔧 Advanced Settings</h3>
                        <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium">Annual Activation</div>
                                    <div className="text-slate-400 text-sm">Enable NFT redemption only on October 30th annually</div>
                                </div>
                                <button
                                    onClick={handleToggleAnnualActivation}
                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                        nftSettings.annualActivation
                                            ? 'bg-green-600 text-white'
                                            : 'bg-red-600 text-white'
                                    }`}
                                >
                                    {nftSettings.annualActivation ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            {nftSettings.annualActivation && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Redemption Window (Days)
                                        </label>
                                        <input
                                            type="number"
                                            value={nftSettings.redemptionWindow}
                                            onChange={(e) => setNftSettings({
                                                ...nftSettings,
                                                redemptionWindow: parseInt(e.target.value) || 30
                                            })}
                                            className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                        />
                                        <div className="text-xs text-slate-400 mt-1">
                                            How many days after October 30th redemption stays open
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Activation Date
                                        </label>
                                        <input
                                            type="date"
                                            value={nftSettings.activationDate}
                                            onChange={(e) => setNftSettings({
                                                ...nftSettings,
                                                activationDate: e.target.value
                                            })}
                                            className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="border-t border-slate-600 pt-4">
                                <div className="text-white font-medium mb-2">🛡️ Security Settings</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Anti-fraud protection:</span>
                                        <span className="text-green-400">✅ Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Address validation:</span>
                                        <span className="text-green-400">✅ Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Points verification:</span>
                                        <span className="text-green-400">✅ Active</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateSettings}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                🔧 Update Advanced Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics Footer */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {ethAddresses.length}
                    </div>
                    <div className="text-slate-400 text-sm">Total Redemptions</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {ethAddresses.filter(a => a.nft_sent).length}
                    </div>
                    <div className="text-slate-400 text-sm">NFTs Sent</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                        {ethAddresses.filter(a => !a.nft_sent && a.status !== 'rejected').length}
                    </div>
                    <div className="text-slate-400 text-sm">Pending</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {ethAddresses.filter(a => a.status === 'rejected').length}
                    </div>
                    <div className="text-slate-400 text-sm">Rejected</div>
                </div>
            </div>
        </div>
    );
};

// AI Marketing Assistant Component
export const AIMarketingAssistant = ({ showNotification }: any) => {
    const [activeTab, setActiveTab] = useState('generator');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [contentType, setContentType] = useState('email');
    const [businessInfo, setBusinessInfo] = useState({
        name: 'HostVoucher',
        industry: 'Web Hosting & Digital Services',
        target_audience: 'Small businesses, entrepreneurs, developers',
        tone: 'professional'
    });
    const [prompt, setPrompt] = useState('');
    const [contentHistory, setContentHistory] = useState<any[]>([]);

    useEffect(() => {
        // Load content history
        const history = JSON.parse(localStorage.getItem('ai_content_history') || '[]');
        setContentHistory(history);
    }, []);

    const contentTypes = [
        { id: 'email', name: 'Email Campaign', icon: '📧', description: 'Marketing emails and newsletters' },
        { id: 'social', name: 'Social Media', icon: '📱', description: 'Posts for Facebook, Instagram, Twitter' },
        { id: 'blog', name: 'Blog Post', icon: '📝', description: 'SEO-optimized blog articles' },
        { id: 'ad', name: 'Advertisement', icon: '📢', description: 'Google Ads, Facebook Ads copy' },
        { id: 'product', name: 'Product Description', icon: '🛍️', description: 'Compelling product descriptions' },
        { id: 'landing', name: 'Landing Page', icon: '🎯', description: 'High-converting landing page copy' },
        { id: 'press', name: 'Press Release', icon: '📰', description: 'Professional press releases' },
        { id: 'sms', name: 'SMS Marketing', icon: '💬', description: 'Short promotional messages' }
    ];

    const toneOptions = [
        { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
        { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
        { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
        { id: 'urgent', name: 'Urgent', description: 'Creates sense of urgency' },
        { id: 'luxury', name: 'Luxury', description: 'Premium and exclusive' },
        { id: 'playful', name: 'Playful', description: 'Fun and energetic' }
    ];

    const generateAIContent = async () => {
        setIsGenerating(true);
        try {
            // Simulate AI content generation
            await new Promise(resolve => setTimeout(resolve, 3000));

            const templates = {
                email: {
                    subject: `🚀 Exclusive ${businessInfo.name} Offer - Limited Time Only!`,
                    content: `Hi there!

We hope this email finds you well and thriving in your business journey!

🎯 **Special Announcement for ${businessInfo.target_audience}**

At ${businessInfo.name}, we understand the challenges you face in the ${businessInfo.industry} space. That's why we're excited to share something special with you.

✨ **What's New:**
• Premium hosting solutions starting at just $2.99/month
• Free SSL certificates and domain registration
• 24/7 expert support from real humans
• 99.9% uptime guarantee with money-back promise

🔥 **Limited Time Offer:**
Use code SAVE50 to get 50% off your first year - but hurry, this offer expires in 48 hours!

💡 **Why Choose ${businessInfo.name}?**
• Trusted by 50,000+ businesses worldwide
• Award-winning customer support
• Lightning-fast loading speeds
• Easy one-click installations

Ready to take your online presence to the next level?

[Get Started Now - 50% OFF]

Best regards,
The ${businessInfo.name} Team

P.S. Have questions? Reply to this email or chat with us 24/7. We're here to help! 🤝`
                },
                social: {
                    content: `🚀 GAME CHANGER ALERT!

${businessInfo.name} just dropped something INCREDIBLE for ${businessInfo.target_audience}!

✨ What you get:
• Premium hosting at 50% OFF
• FREE domain + SSL certificate
• 24/7 expert support
• 99.9% uptime guarantee

💰 Use code: SAVE50
⏰ Valid for 48 hours only!

This is the deal you've been waiting for. Don't let your competitors get ahead while you're stuck with slow hosting!

👆 Link in bio to claim your discount!

#WebHosting #SmallBusiness #Entrepreneur #DigitalMarketing #WebDevelopment #OnlineBusiness`
                },
                blog: {
                    title: `The Ultimate Guide to Choosing the Right Web Hosting for Your ${businessInfo.industry} Business`,
                    content: `# The Ultimate Guide to Choosing the Right Web Hosting for Your ${businessInfo.industry} Business

## Introduction

In today's digital landscape, choosing the right web hosting provider is crucial for ${businessInfo.target_audience}. Your hosting choice can make or break your online success.

## Why Web Hosting Matters

### 1. Website Speed & Performance
Fast loading times are essential for user experience and SEO rankings. Studies show that 40% of visitors abandon a website that takes more than 3 seconds to load.

### 2. Reliability & Uptime
Your website needs to be accessible 24/7. Even 1% downtime can cost you significant revenue and damage your reputation.

### 3. Security Features
With cyber threats on the rise, robust security features including SSL certificates, malware scanning, and regular backups are non-negotiable.

## Key Features to Look For

### Essential Features:
- **SSD Storage**: Faster data access and improved performance
- **Free SSL Certificate**: Essential for security and SEO
- **24/7 Customer Support**: Get help when you need it most
- **Easy Control Panel**: User-friendly interface for managing your site
- **One-Click Installs**: Quick setup for popular applications

### Advanced Features:
- **CDN Integration**: Global content delivery for faster loading
- **Automated Backups**: Protect your data automatically
- **Staging Environment**: Test changes safely before going live
- **Advanced Security**: DDoS protection and malware scanning

## ${businessInfo.name} Advantage

At ${businessInfo.name}, we understand the unique needs of ${businessInfo.target_audience}. Our hosting solutions are specifically designed to help your business thrive online.

### Why Choose Us:
- ✅ 99.9% uptime guarantee
- ✅ Lightning-fast SSD storage
- ✅ Free domain and SSL certificate
- ✅ 24/7 expert support
- ✅ 30-day money-back guarantee

## Conclusion

Choosing the right web hosting provider is an investment in your business's future. Don't compromise on quality – your success depends on it.

Ready to experience the ${businessInfo.name} difference? Get started today with our special offer!

[Get 50% OFF Your First Year - Use Code: SAVE50]

---

*Have questions about web hosting? Our experts are here to help 24/7. Contact us today!*`
                },
                ad: {
                    headline: `${businessInfo.name} - Premium Web Hosting Starting at $2.99/month`,
                    content: `🚀 **Transform Your Online Presence Today!**

**Why ${businessInfo.name}?**
✅ 99.9% Uptime Guarantee
✅ Lightning-Fast SSD Storage
✅ Free Domain + SSL Certificate
✅ 24/7 Expert Support
✅ 30-Day Money-Back Guarantee

**Perfect for:** ${businessInfo.target_audience}

**Special Offer:** 50% OFF First Year
**Promo Code:** SAVE50
**Limited Time:** 48 Hours Only!

Don't let slow hosting kill your business. Join 50,000+ satisfied customers who trust ${businessInfo.name} for their web hosting needs.

**[Start Your Website Today - 50% OFF]**

*Free setup • No hidden fees • Cancel anytime*`
                },
                product: {
                    title: `Premium Web Hosting - Perfect for ${businessInfo.target_audience}`,
                    content: `**Supercharge Your Website with ${businessInfo.name} Premium Hosting**

🚀 **Lightning-Fast Performance**
Our SSD-powered servers deliver blazing-fast loading speeds that keep your visitors engaged and boost your search engine rankings.

🛡️ **Enterprise-Grade Security**
Protect your business with free SSL certificates, DDoS protection, malware scanning, and automated daily backups.

⚡ **99.9% Uptime Guarantee**
Your website stays online when your customers need it most. We guarantee 99.9% uptime or your money back.

🎯 **Perfect for ${businessInfo.target_audience}**
Whether you're launching your first website or scaling your existing business, our hosting solutions grow with you.

**What's Included:**
• Free domain registration (worth $15)
• Free SSL certificate (worth $50)
• Unlimited bandwidth
• 24/7 expert support
• One-click app installs
• Website builder included
• Email accounts included
• 30-day money-back guarantee

**Special Launch Price:** Starting at just $2.99/month (reg. $9.99)
**Save 70%** with annual billing

**[Get Started Now - Limited Time Offer]**

*Join 50,000+ businesses who trust ${businessInfo.name} for their web hosting needs.*`
                }
            };

            const template = templates[contentType as keyof typeof templates];
            setGeneratedContent(JSON.stringify(template, null, 2));

            // Save to history
            const newHistoryItem = {
                id: Date.now(),
                type: contentType,
                prompt: prompt || `Generate ${contentType} content for ${businessInfo.name}`,
                content: template,
                created_at: new Date().toISOString(),
                business_info: businessInfo
            };

            const updatedHistory = [newHistoryItem, ...contentHistory.slice(0, 19)]; // Keep last 20 items
            setContentHistory(updatedHistory);
            localStorage.setItem('ai_content_history', JSON.stringify(updatedHistory));

            showNotification(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content generated successfully!`, 'success');
        } catch (error) {
            showNotification('Failed to generate content', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('Content copied to clipboard!', 'success');
    };

    const saveContent = (content: any) => {
        const savedContent = JSON.parse(localStorage.getItem('saved_ai_content') || '[]');
        const newSavedContent = {
            id: Date.now(),
            type: contentType,
            content: content,
            saved_at: new Date().toISOString()
        };
        savedContent.push(newSavedContent);
        localStorage.setItem('saved_ai_content', JSON.stringify(savedContent));
        showNotification('Content saved successfully!', 'success');
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <div className="text-3xl">🤖</div>
                    AI Marketing Assistant
                </h2>
                <div className="text-sm text-slate-400">
                    Powered by Advanced AI
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('generator')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'generator'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    🎯 Content Generator
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'history'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    📚 Content History
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'settings'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                >
                    ⚙️ AI Settings
                </button>
            </div>

            {/* Content Generator Tab */}
            {activeTab === 'generator' && (
                <div className="space-y-6">
                    {/* Content Type Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">📝 Choose Content Type</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {contentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setContentType(type.id)}
                                    className={`p-3 rounded-lg border text-left transition-all ${
                                        contentType === type.id
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{type.icon}</div>
                                    <div className="font-medium text-sm">{type.name}</div>
                                    <div className="text-xs opacity-75">{type.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">💭 Custom Instructions (Optional)</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Add specific instructions for the AI... (e.g., 'Focus on Black Friday sale', 'Include testimonials', 'Mention free shipping')"
                            rows={3}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="text-center">
                        <button
                            onClick={generateAIContent}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl text-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    AI is Creating Magic...
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl">✨</div>
                                    Generate {contentTypes.find(t => t.id === contentType)?.name}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Generated Content */}
                    {generatedContent && (
                        <div className="bg-slate-700 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">🎉 Generated Content</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(generatedContent)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        onClick={() => saveContent(JSON.parse(generatedContent))}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        💾 Save
                                    </button>
                                </div>
                            </div>
                            <pre className="bg-slate-800 p-4 rounded-lg text-slate-300 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                                {generatedContent}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {/* Content History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">📚 Content Generation History</h3>
                        <div className="text-sm text-slate-400">
                            {contentHistory.length} items generated
                        </div>
                    </div>

                    {contentHistory.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-6xl mb-4">📝</div>
                            <h4 className="text-lg font-medium text-white mb-2">No content generated yet</h4>
                            <p>Start generating AI content to see your history here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {contentHistory.map((item) => (
                                <div key={item.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">
                                                    {contentTypes.find(t => t.id === item.type)?.icon}
                                                </span>
                                                <span className="text-white font-medium">
                                                    {contentTypes.find(t => t.id === item.type)?.name}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className="text-slate-400 text-sm mb-2">
                                                {new Date(item.created_at).toLocaleString()}
                                            </div>
                                            <div className="text-slate-300 text-sm">
                                                <strong>Prompt:</strong> {item.prompt}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(JSON.stringify(item.content, null, 2))}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                            >
                                                📋 Copy
                                            </button>
                                            <button
                                                onClick={() => setGeneratedContent(JSON.stringify(item.content, null, 2))}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                                            >
                                                👁️ View
                                            </button>
                                        </div>
                                    </div>

                                    {item.content.subject && (
                                        <div className="text-slate-300 text-sm">
                                            <strong>Subject:</strong> {item.content.subject}
                                        </div>
                                    )}
                                    {item.content.title && (
                                        <div className="text-slate-300 text-sm">
                                            <strong>Title:</strong> {item.content.title}
                                        </div>
                                    )}
                                    {item.content.headline && (
                                        <div className="text-slate-300 text-sm">
                                            <strong>Headline:</strong> {item.content.headline}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AI Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">⚙️ AI Assistant Configuration</h3>

                    {/* Business Information */}
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h4 className="text-md font-medium text-white mb-4">🏢 Business Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={businessInfo.name}
                                    onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                                <input
                                    type="text"
                                    value={businessInfo.industry}
                                    onChange={(e) => setBusinessInfo({...businessInfo, industry: e.target.value})}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                                <input
                                    type="text"
                                    value={businessInfo.target_audience}
                                    onChange={(e) => setBusinessInfo({...businessInfo, target_audience: e.target.value})}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                                    placeholder="e.g., Small businesses, entrepreneurs, developers"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tone Settings */}
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h4 className="text-md font-medium text-white mb-4">🎭 Default Tone & Style</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {toneOptions.map((tone) => (
                                <button
                                    key={tone.id}
                                    onClick={() => setBusinessInfo({...businessInfo, tone: tone.id})}
                                    className={`p-3 rounded-lg border text-left transition-all ${
                                        businessInfo.tone === tone.id
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : 'bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500'
                                    }`}
                                >
                                    <div className="font-medium text-sm">{tone.name}</div>
                                    <div className="text-xs opacity-75">{tone.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Model Settings */}
                    <div className="bg-slate-700 rounded-lg p-6">
                        <h4 className="text-md font-medium text-white mb-4">🤖 AI Model Configuration</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Creativity Level</label>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-sm">Conservative</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        defaultValue="70"
                                        className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-slate-400 text-sm">Creative</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Content Length</label>
                                <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                                    <option value="short">Short (50-150 words)</option>
                                    <option value="medium" selected>Medium (150-300 words)</option>
                                    <option value="long">Long (300-500 words)</option>
                                    <option value="very_long">Very Long (500+ words)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="include_emojis" defaultChecked className="rounded" />
                                <label htmlFor="include_emojis" className="text-slate-300 text-sm">Include emojis in content</label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="include_cta" defaultChecked className="rounded" />
                                <label htmlFor="include_cta" className="text-slate-300 text-sm">Always include call-to-action</label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="seo_optimized" defaultChecked className="rounded" />
                                <label htmlFor="seo_optimized" className="text-slate-300 text-sm">SEO optimized content</label>
                            </div>
                        </div>
                    </div>

                    {/* Save Settings */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                localStorage.setItem('ai_business_info', JSON.stringify(businessInfo));
                                showNotification('AI settings saved successfully!', 'success');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
                        >
                            💾 Save AI Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// All components are already exported individually above