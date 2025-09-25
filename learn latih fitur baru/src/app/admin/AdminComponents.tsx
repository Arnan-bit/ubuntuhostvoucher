

// src/app/admin/AdminComponents.tsx
'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getBadgesForUser } from '@/lib/utils';
import {
    LayoutDashboard, ShoppingBag, PlusCircle, Link2, BarChart3, Menu, X, Trash2, ExternalLink, Edit, Save,
    Shield, Server, Cloud, Power, Sparkles, BrainCircuit, Share2, Image as ImageIcon,
    Search, Filter, Calendar, TrendingUp, Settings, MessageSquare, Zap, CheckCircle, LogOut,
    Trophy, Star, Info, Mail, UploadCloud, Brush, AlertCircle, Gem, Medal, Lock,
    BookOpen, Users, Copy, Award, Crown, Rocket, DollarSign
} from 'lucide-react';
import { badgeTiers } from '@/lib/data';

// =================================================================================
// SECTION 1: UTILITIES & HELPERS
// =================================================================================
const formatCurrency = (amount: any) => {
    const num = parseFloat(amount);
    if (typeof num !== 'number' || isNaN(num)) return "N/A";
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD',
        }).format(num);
    } catch (e) { return `USD ${num.toFixed(2)}`; }
};

const generateSlug = () => Math.random().toString(36).substring(2, 8);
const EMOJIS = ['🚀', '💼', '💻', '☁️', '🌐', '🎁', '📦', '🔧', '💡', '📈'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', ' #00c49f', '#ffbb28', '#f44336', '#e91e63', '#9c27b0'];


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
        { id: 'gamification', label: 'User Gamification', icon: Users },
        { id: 'catalog', label: 'Catalog', icon: ShoppingBag },
        { id: 'add', label: 'Add/Edit', icon: PlusCircle },
        { id: 'testimonials', label: 'Manage Testimonials', icon: MessageSquare },
        { id: 'requests', label: 'User Requests', icon: Mail },
    ];
    const NavList = () => (<nav><ul>{navItems.map(item => (<li key={item.id}><a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}><item.icon size={20} /><span>{item.label}</span></a></li>))}<li><Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700/50 text-slate-300"><Settings size={20} /><span>Go to Settings</span></Link></li><li key="logout"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-800/50 text-red-400"><LogOut size={20} /><span>Logout</span></button></li></ul></nav>);
    return (<><aside className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 flex flex-col sticky top-0 h-screen hidden md:flex"><div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0"><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Link2 /> HostVoucher</h1></div><div className="p-4 overflow-y-auto flex-grow"><button onClick={onAddNew} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 mb-4"><PlusCircle size={20} /><span>Add New Catalog</span></button><NavList /></div></aside><header className="md:hidden sticky top-0 z-40 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center"><h1 className="text-xl font-bold text-white flex items-center gap-2"><Link2 /> HostVoucher</h1><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">{mobileMenuOpen ? <X/> : <Menu/>}</button></header><AnimatePresence>{mobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-800 border-b border-slate-700 p-4"><button onClick={onAddNew} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 mb-4"><PlusCircle size={20} /><span>Add New Catalog</span></button><NavList /></motion.div>)}</AnimatePresence></>);
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
            uniqueVisitors: new Set(clickEvents.map((e:any) => e.ip_address)).size
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

export const CatalogView = ({ products, onDelete, onLinkClick, onEdit, onAddNew, catalogNumberPrefix, settings }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredProducts = useMemo(() =>
        products.filter((p: any) =>
            (p.name?.toLowerCase() || p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.provider?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ), [products, searchTerm]);
    
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Catalog Management</h2>
                <div className="relative">
                    <input type="text" placeholder="Search catalog..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800"><tr><th className="px-6 py-3">Catalog No.</th><th className="px-6 py-3">Name/Title</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Price (USD)</th><th className="px-6 py-3">Clicks</th><th className="px-6 py-3">Actions</th></tr></thead>
                    <tbody>
                        {filteredProducts.map((product: any) => (
                            <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">{`${catalogNumberPrefix}${product.catalog_number}`}</td>
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center gap-3">
                                    {product.provider_logo ? <Image src={product.provider_logo} alt={product.provider} width={32} height={32} className="w-8 h-8 object-contain" /> : product.image ? <Image src={product.image} alt={product.name} width={32} height={32} className="w-8 h-8 rounded-md object-cover" /> : <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-slate-500"><ImageIcon size={16}/></div>}
                                    {product.name || product.title}
                                </td>
                                <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300">{product.type || 'N/A'}</span></td>
                                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4">{product.clicks || 0}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => onEdit(product)} className="p-2 rounded-md hover:bg-slate-600 text-yellow-400" title="Edit"><Edit size={16} /></button>
                                    <button onClick={() => onLinkClick(product)} className="p-2 rounded-md hover:bg-slate-600 text-sky-400" title="Open Link"><ExternalLink size={16} /></button>
                                    <button onClick={() => onDelete(product.id)} className="p-2 rounded-md hover:bg-slate-600 text-red-400" title="Delete"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AddEditProductView = ({ onSave, onCancel, existingProduct, catalogNumberPrefix, showNotification, uploadFileToCPanel }: any) => {
    const initialProductState = { id: null, catalog_number: '', name: '', title: '', provider: '', type: 'Web Hosting', tier: '', price: '', original_price: '', discount: '', features: '', link: '', target_url: '', image: '', provider_logo: '', rating: '0', num_reviews: '0', clicks: 0, code: '', short_link: '', seo_title: '', seo_description: '', color: 'blue', button_color: 'blue', is_featured: false, featured_display_style: 'vertical' };
    const [product, setProduct] = useState(initialProductState);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        if (existingProduct) {
            setProduct({
                ...initialProductState,
                ...existingProduct,
                features: Array.isArray(existingProduct.features) ? existingProduct.features.join('\n') : (existingProduct.features || ''),
                rating: String(existingProduct.rating || '0'),
                num_reviews: String(existingProduct.num_reviews || '0'),
            });
        } else {
            setProduct(initialProductState);
        }
    }, [existingProduct]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'provider_logo') => {
        const file = event.target.files?.[0]; if (!file) return; setIsUploading(true);
        try { const url = await uploadFileToCPanel(file, showNotification); setProduct(prev => ({ ...prev, [field]: url })); } 
        catch (error) { /* Error handled in helper */ } 
        finally { setIsUploading(false); }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave = {
            ...product,
            features: typeof product.features === 'string' ? product.features.split('\n').filter(f => f.trim() !== '') : [],
            price: parseFloat(product.price) || 0,
            original_price: parseFloat(product.original_price) || 0,
            rating: parseFloat(product.rating) || 0,
            num_reviews: parseInt(product.num_reviews, 10) || 0,
            is_featured: !!product.is_featured
        };
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
        <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-white mb-6">{existingProduct ? `Edit Catalog (#${catalogNumberPrefix}${existingProduct.catalog_number})` : 'Add New Catalog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Product Name/Title" name="name" value={product.name || product.title || ''} onChange={handleChange} required />
                    <InputField label="Provider" name="provider" value={product.provider || ''} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <SelectField label="Type" name="type" value={product.type} onChange={handleChange} options={productTypes} />
                    <InputField label="Tier (Personal, Business)" name="tier" value={product.tier || ''} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <InputField label="Price (USD)" name="price" type="number" step="0.01" value={product.price} onChange={handleChange} />
                    <InputField label="Original Price" name="original_price" type="number" step="0.01" value={product.original_price} onChange={handleChange} />
                    <InputField label="Discount (%)" name="discount" value={product.discount || ''} onChange={handleChange} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Rating (e.g., 4.5)" name="rating" type="number" step="0.1" max="5" min="0" value={product.rating} onChange={handleChange} />
                    <InputField label="Number of Reviews" name="num_reviews" type="number" step="1" value={product.num_reviews} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">SEO Description</label>
                    <textarea name="seo_description" value={product.seo_description || ''} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" placeholder="Short, catchy description for cards and search results."></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Target / Affiliate URL" name="target_url" type="url" value={product.target_url || ''} onChange={handleChange} required />
                    <InputField label="Short Link (auto-generated if empty)" name="short_link" value={product.short_link || ''} onChange={handleChange} readOnly/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Features (one per line)</label>
                    <textarea name="features" value={product.features} onChange={handleChange} rows={5} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Main Image</label>
                        <input type="file" onChange={e => handleImageUpload(e, 'image')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700" />
                        {product.image && <Image src={product.image} alt="Preview" width={100} height={100} className="mt-2 rounded-md" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Provider Logo</label>
                        <input type="file" onChange={e => handleImageUpload(e, 'provider_logo')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700"/>
                        {product.provider_logo && <Image src={product.provider_logo} alt="Logo" width={100} height={50} className="mt-2 object-contain bg-white p-1 rounded" />}
                    </div>
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <InputField label="Voucher Code" name="code" value={product.code || ''} onChange={handleChange} />
                    {product.type === 'Voucher' ? 
                        <SelectField label="Voucher Color" name="color" value={product.color} onChange={handleChange} options={voucherColors} />
                        : <SelectField label="Button Color" name="button_color" value={product.button_color} onChange={handleChange} options={buttonColors} />
                    }
                </div>
                <div className="flex items-center gap-4">
                    <Switch id="is_featured" checked={!!product.is_featured} onCheckedChange={c => setProduct(p => ({...p, is_featured: c}))} />
                    <label htmlFor="is_featured" className="text-sm font-medium text-slate-300">Tampilkan di Landing Page (Featured)</label>
                </div>
                 {product.is_featured && (
                    <SelectField label="Featured Display Style" name="featured_display_style" value={product.featured_display_style} onChange={handleChange} options={['vertical', 'horizontal']} />
                )}
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">{isUploading ? 'Uploading...' : 'Save Product'}</button>
                </div>
            </form>
        </div>
    );
};


export const TestimonialManagement = ({ testimonials, onSave, onDelete, editingTestimonial, setEditingTestimonial, showNotification, uploadFileToCPanel }: any) => { return (<div><h2 className="text-3xl font-bold text-white">Manage Testimonials</h2><p className="text-slate-400">Add, edit, or delete customer testimonials that appear on the site.</p></div>); };

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

export const GamificationUserPanel = ({ users, onAwardNft, onAdjustPoints, showNotification }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [adjustPointsModal, setAdjustPointsModal] = useState({ isOpen: false, user: null });

    const filteredUsers = useMemo(() =>
        (users || []).filter((u: any) =>
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.eth_address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleCopyEthAddress = (address: string) => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        showNotification("ETH Address copied to clipboard!", "success");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Users /> User Gamification Management</h2>
                <div className="relative">
                    <input type="text" placeholder="Search by email or ETH address..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredUsers.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Points</th>
                                    <th className="px-6 py-3">Total Clicks</th>
                                    <th className="px-6 py-3">Achieved Badges</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user: any) => {
                                    const userBadges = getBadgesForUser(user);
                                    return (
                                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-white">{user.email}<br /><span className="text-xs text-slate-400 font-mono flex items-center gap-1">{user.eth_address} {user.eth_address && <Copy size={12} className="cursor-pointer" onClick={() => handleCopyEthAddress(user.eth_address)} />}</span></td>
                                        <td className="px-6 py-4 font-bold text-yellow-400">{user.points?.toLocaleString('en-US') || 0}</td>
                                        <td className="px-6 py-4">{user.total_clicks || 0}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {userBadges.slice(0, 5).map((badge:any) => {
                                                    const { Icon, color, bg, name } = badge;
                                                    return (
                                                        <span key={name} title={name} className={`flex items-center justify-center w-7 h-7 rounded-full ${bg}`}>
                                                            <Icon size={16} className={color} />
                                                        </span>
                                                    )
                                                })}
                                                {userBadges.length > 5 && <span className="text-xs text-slate-400 self-center">+{userBadges.length - 5}</span>}
                                                {userBadges.length === 0 && <span className="text-xs text-slate-500">No badges</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => setAdjustPointsModal({ isOpen: true, user: user })} className="text-xs bg-indigo-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-indigo-500">Adjust Points</button>
                                            <button onClick={() => onAwardNft(user.id)} className="text-xs bg-purple-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-purple-500">Award NFT</button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 px-6 text-slate-400">
                            <h3 className="text-lg font-semibold text-white">No gamification users found.</h3>
                            <p>Users will appear here after they sign up on the Request & Submit NFT page.</p>
                        </div>
                    )}
                </div>
                <Paginator currentPage={currentPage} totalPages={Math.ceil(filteredUsers.length / itemsPerPage)} onPageChange={setCurrentPage} />
            </div>
            <AdjustPointsModal modalState={adjustPointsModal} onClose={() => setAdjustPointsModal({ isOpen: false, user: null })} onAdjust={onAdjustPoints} />
        </div>
    );
};


export const BlogManagement = ({ posts, onSave, onDelete, editingPost, setEditingPost, showNotification, uploadFileToCPanel }: any) => { return(<div></div>)};
export const NewsletterView = ({ subscriptions, onDeleteSubscription }: any) => { return(<div></div>)};
export const SiteAppearancePage = ({ settings, onSave, showNotification, uploadFileToCPanel }: any) => { return(<div></div>)};
export const IntegrationsPage = ({ settings, onSave, showNotification }: any) => { return(<div></div>)};
export const GlobalSettingsPage = ({ settings, onSave, showNotification, miningTasks, onUpdateMiningTasks, uploadFileToCPanel }: any) => { return(<div></div>)};

    
