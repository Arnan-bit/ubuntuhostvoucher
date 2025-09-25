
'use client';

// =================================================================================
// HOSTVOUCHER - ADMIN PANEL PAGE (app/admin/page.tsx) - MySQL Integrated
// =================================================================================
// Halaman ini berfungsi sebagai pusat kendali operasional untuk seluruh website.
// Semua pengambilan data sekarang terintegrasi penuh dengan API /api/data (MySQL).
// Semua tindakan (simpan/hapus) terintegrasi dengan API /api/action (MySQL).

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { app, auth } from '@/lib/firebase-client';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import * as apiClient from '@/lib/api-client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
    AdminSidebar,
    DashboardView,
    CatalogView,
    AddEditProductView,
    TestimonialManagement,
    RequestsView,
    GamificationUserPanel,
    Notification
} from './AdminComponents';
import { AlertCircle } from 'lucide-react';


// =================================================================================
// BAGIAN 1: KONFIGURASI INTI & UTILITAS
// =================================================================================
const AUTHORIZED_EMAILS = ["hostvouchercom@gmail.com", "garudandne87@gmail.com"];

const uploadFileToCPanel = async (file: File, showNotification: Function): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('http://localhost:8800/api/upload', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Upload failed due to a server error.');
        }
        showNotification('File uploaded successfully!', 'success');
        return result.url;
    } catch (error: any) {
        console.error('cPanel Upload Error:', error);
        showNotification(`Upload failed: ${error.message}`, 'error');
        throw error;
    }
};

const awardAdminPoints = (points: number) => {
    const currentPoints = parseInt(localStorage.getItem('adminPoints') || '0', 10);
    const newPoints = currentPoints + points;
    localStorage.setItem('adminPoints', newPoints.toString());
    window.dispatchEvent(new Event('storage'));
};

// =================================================================================
// BAGIAN 2: KOMPONEN UTAMA DASHBOARD
// =================================================================================

const AdminDashboard = ({ onLogout, userId }: { onLogout: () => void; userId: string | null; }) => {
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
    
    const { data, loading: isLoading, error, reload } = useClientData(async () => {
        const [
            deals, 
            clickEvents, 
            submittedVouchers, 
            dealRequests, 
            testimonials, 
            nftShowcase, 
            hostvoucherTestimonials, 
            settings, 
            achievements, 
            gamificationUsers,
            nftRedemptionRequests
        ] = await Promise.all([
            dataApi.getDeals(),
            dataApi.fetchData('click_events'), 
            dataApi.fetchData('submitted_vouchers'),
            dataApi.fetchData('deal_requests'),
            dataApi.getTestimonials(),
            dataApi.getNftShowcase(),
            dataApi.getHostVoucherTestimonials(),
            dataApi.getSiteSettings(),
            dataApi.fetchData('achievements'),
            dataApi.fetchData('gamification_users'),
            dataApi.fetchData('nft_redemption_requests'),
        ]);
        
        // Add clicks to deals
        const dealsWithClicks = deals.map((deal: any) => ({
            ...deal,
            clicks: clickEvents.filter((e: any) => e.product_id === deal.id).length
        }));

        return { 
            deals: dealsWithClicks, 
            clickEvents, 
            submittedVouchers, 
            dealRequests, 
            testimonials, 
            nftShowcase, 
            hostvoucherTestimonials, 
            settings, 
            achievements, 
            gamificationUsers, 
            nftRedemptionRequests 
        };
    });

    const showNotification = useCallback((message: any, type = 'info', duration = 4000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification(n => ({ ...n, show: false })), duration);
    }, []);

    const sectionRefs: any = { dashboard: useRef(null), catalog: useRef(null), add: useRef(null), requests: useRef(null), testimonials: useRef(null), gamification: useRef(null) };

    const handleAction = async (action: () => Promise<any>, successMessage: string) => {
        try { 
            await action(); 
            showNotification(successMessage, 'success'); 
            reload(); 
            return true;
        } 
        catch (e: any) { 
            showNotification(e.message || 'An error occurred', 'error'); 
            return false;
        }
    };

    const handleSaveProduct = async (productData: any) => {
        const success = await handleAction(() => apiClient.saveProduct(productData), "Product saved successfully!");
        if (success) {
            setEditingProduct(null);
            sectionRefs.catalog.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteProduct = (id: string) => handleAction(() => apiClient.deleteItem('products', id), "Product deleted.");
    const handleSaveTestimonial = (testimonialData: any) => handleAction(() => apiClient.saveTestimonial(testimonialData), "Testimonial saved!");
    const handleDeleteTestimonial = (id: string) => handleAction(() => apiClient.deleteItem('testimonials', id), "Testimonial deleted.");
    const handleDeleteVoucher = (id: string) => handleAction(() => apiClient.deleteItem('submitted_vouchers', id), "Submitted voucher deleted.");
    const handleDeleteAllVouchers = () => handleAction(() => apiClient.deleteAll('submitted_vouchers'), "All submitted vouchers deleted.");
    const handleDeleteDeal = (id: string) => handleAction(() => apiClient.deleteItem('deal_requests', id), "Deal request deleted.");
    const handleDeleteAllDeals = () => handleAction(() => apiClient.deleteAll('deal_requests'), "All deal requests deleted.");
    const handleDeleteNftShowcase = (id: string) => handleAction(() => apiClient.deleteItem('nft_showcase', id), "NFT Showcase item deleted.");
    const handleDeleteSiteTestimonial = (id: string) => handleAction(() => apiClient.deleteItem('hostvoucher_testimonials', id), "Site testimonial deleted.");
    const handleDeleteNftRedemptionRequest = (id: string) => handleAction(() => apiClient.deleteItem('nft_redemption_requests', id), "NFT redemption request rejected and deleted.");
    const handleAwardNft = (userId: string) => handleAction(() => apiClient.awardNft(userId), "NFT Awarded!");
    const handleAdjustPoints = (userId: string, amount: number, reason: string) => handleAction(() => apiClient.adjustPoints(userId, amount, reason), "Points adjusted!");

    const handleAddNewClick = useCallback(() => { setEditingProduct(null); sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.add]);
    const handleEditClick = useCallback((product: any) => { setEditingProduct(product); sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.add]);
    const handleCancelEdit = useCallback(() => { setEditingProduct(null); sectionRefs.catalog.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.catalog]);
    const handleConvertToCatalog = useCallback((voucher: any) => { 
        setEditingProduct({
            name: `${voucher.provider} Voucher`,
            provider: voucher.provider,
            type: 'Voucher',
            code: voucher.voucher_code,
            seo_description: voucher.description, // Corrected field name
            target_url: voucher.link // Corrected field name
        });
        sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' });
        showNotification(`Form pre-filled from voucher. Please complete and save.`, "info");
    }, [showNotification, sectionRefs.add]);
    
    const handleLinkClick = (product: any) => {
        if (product.target_url) {
            window.open(product.target_url, '_blank');
            awardAdminPoints(10); // Award 10 points for each click
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin"></div></div>;
    if (error) return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={20} />Failed to load admin data.</div></div>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-200 font-sans">
            <Notification {...notification} />
            <AdminSidebar sectionRefs={sectionRefs} onAddNew={handleAddNewClick} onLogout={onLogout} />
            <main id="admin-main-panel" className="flex-1 flex flex-col overflow-x-hidden">
                 <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div ref={sectionRefs.dashboard} className="mb-16"><DashboardView products={data?.deals || []} clickEvents={data?.clickEvents || []} achievements={data?.achievements || {}} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.gamification} className="mb-16"><GamificationUserPanel users={data?.gamificationUsers || []} onAwardNft={handleAwardNft} onAdjustPoints={handleAdjustPoints} showNotification={showNotification} /></div>
                    <div ref={sectionRefs.catalog} className="mb-16"><CatalogView products={data?.deals || []} onDelete={handleDeleteProduct} onLinkClick={handleLinkClick} onEdit={handleEditClick} onAddNew={handleAddNewClick} catalogNumberPrefix={data?.settings?.catalog_number_prefix || 'HV'} settings={data?.settings || {}} /></div>
                    <div ref={sectionRefs.add} className="mb-16"><AddEditProductView onSave={handleSaveProduct} onCancel={handleCancelEdit} existingProduct={editingProduct} catalogNumberPrefix={data?.settings?.catalog_number_prefix || 'HV'} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.testimonials} className="mb-16"><TestimonialManagement testimonials={data?.testimonials || []} onSave={handleSaveTestimonial} onDelete={handleDeleteTestimonial} editingTestimonial={editingTestimonial} setEditingTestimonial={setEditingTestimonial} showNotification={showNotification} uploadFileToCPanel={uploadFileToCPanel} /></div>
                    <div ref={sectionRefs.requests} className="mb-16"><RequestsView submittedVoucher={data?.submittedVouchers || []} dealRequests={data?.dealRequests || []} nftShowcase={data?.nftShowcase || []} hostvoucherTestimonials={data?.hostvoucherTestimonials || []} nftRedemptionRequests={data?.nftRedemptionRequests || []} onConvertToCatalog={handleConvertToCatalog} onDeleteVoucher={handleDeleteVoucher} onDeleteAllVouchers={handleDeleteAllVouchers} onDeleteDeal={handleDeleteDeal} onDeleteAllDeals={handleDeleteAllDeals} onDeleteNftShowcase={handleDeleteNftShowcase} onDeleteSiteTestimonial={handleDeleteSiteTestimonial} onDeleteNftRedemptionRequest={handleDeleteNftRedemptionRequest} /></div>
                </div>
                 <footer className="p-4 bg-slate-800 border-t border-slate-700 text-center text-sm text-slate-400 flex-shrink-0">HostVoucher Admin Panel © {new Date().getFullYear()}</footer>
            </main>
        </div>
    );
}


// =================================================================================
// BAGIAN 3: KOMPONEN UTAMA HALAMAN (ORKESTRATOR)
// =================================================================================
export default function AdminPage() {
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
              <div className="text-center mb-8"><h2 className="text-3xl font-bold text-white mb-2">HostVoucher Admin</h2><p className="text-slate-400">Secure Access</p></div>
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
    
    return <AdminDashboard onLogout={handleLogout} userId={user?.uid || null} />;
}
