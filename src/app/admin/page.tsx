
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
    TemplateManagement,
    EmailMarketingManagement,
    NFTGamificationManagement,
    Notification,
    InputField
} from './AdminComponents';
import { AlertCircle, Trash2, Info, CheckCircle, X, Search, Users, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components directly to avoid chunk loading issues
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { CampaignManager } from '@/components/admin/CampaignManager';
import { CatalogColorManager } from '@/components/admin/CatalogColorManager';
import { FloatingPromoManager } from '@/components/FloatingPromoImage';




// =================================================================================
// BAGIAN 1: KONFIGURASI INTI & UTILITAS
// =================================================================================
const AUTHORIZED_EMAILS = ["hostvouchercom@gmail.com", "garudandne87@gmail.com"];

const uploadFileToCPanel = async (file: File, showNotification?: Function): Promise<string> => {
    console.log('🔄 Starting file upload:', {
        name: file.name,
        size: file.size,
        type: file.type
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
        if (showNotification) {
            showNotification('Uploading file...', 'info');
        }

        // Try Next.js API route first (more reliable)
        console.log('📤 Attempting upload via Next.js API...');
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('📥 Upload response:', result);

        if (!response.ok || !result.success) {
            throw new Error(result.error || result.details || 'Upload failed due to a server error.');
        }

        if (showNotification) {
            showNotification(`File uploaded successfully: ${result.filename}`, 'success');
        }

        console.log('✅ Upload successful:', result.url);
        return result.url;

    } catch (error: any) {
        console.error('❌ Primary Upload Error:', error);

        // Fallback to external API if Next.js route fails
        try {
            console.log('🔄 Trying fallback upload server...');
            if (showNotification) {
                showNotification('Primary upload failed, trying fallback...', 'warning');
            }

            const fallbackResponse = await fetch('http://localhost:9003/api/upload', {
                method: 'POST',
                body: formData
            });

            const fallbackResult = await fallbackResponse.json();
            console.log('📥 Fallback response:', fallbackResult);

            if (!fallbackResponse.ok || !fallbackResult.success) {
                throw new Error(fallbackResult.error || 'Fallback upload failed.');
            }

            if (showNotification) {
                showNotification(`File uploaded via fallback: ${fallbackResult.filename}`, 'success');
            }

            console.log('✅ Fallback upload successful:', fallbackResult.url);
            return fallbackResult.url;

        } catch (fallbackError: any) {
            console.error('❌ Fallback Upload Error:', fallbackError);
            const errorMessage = `Upload failed: ${error.message}. Fallback also failed: ${fallbackError.message}`;

            if (showNotification) {
                showNotification(errorMessage, 'error');
            }
            throw new Error(errorMessage);
        }
    }
};

const awardAdminPoints = (points: number) => {
    const currentPoints = parseInt(localStorage.getItem('adminPoints') || '0', 10);
    const newPoints = currentPoints + points;
    localStorage.setItem('adminPoints', newPoints.toString());
    window.dispatchEvent(new Event('storage'));
};

// =================================================================================
// BAGIAN 2: KOMPONEN TAMBAHAN YANG BELUM ADA
// =================================================================================

// Enhanced TestimonialManagement Component
const EnhancedTestimonialManagement = ({ testimonials, onSave, onDelete, editingTestimonial, setEditingTestimonial, showNotification, uploadFileToCPanel }: any) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Manage Testimonials</h2>
                    <p className="text-slate-400">Add, edit, or delete customer testimonials that appear on the site.</p>
                </div>
                <button
                    onClick={() => setEditingTestimonial({ id: null, name: '', role: '', review: '', imageUrl: '', rating: 5 })}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 flex items-center gap-2"
                >
                    Add New Testimonial
                </button>
            </div>

            {editingTestimonial ? (
                <TestimonialEditor
                    existingTestimonial={editingTestimonial}
                    onSave={onSave}
                    onCancel={() => setEditingTestimonial(null)}
                    showNotification={showNotification}
                    uploadFileToCPanel={uploadFileToCPanel}
                />
            ) : (
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
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            {testimonial.imageUrl && (
                                                <img src={testimonial.imageUrl} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                                            )}
                                            <div>
                                                <div>{testimonial.name}</div>
                                                <div className="text-xs text-slate-400">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{testimonial.review}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => setEditingTestimonial(testimonial)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                        <button onClick={() => onDelete(testimonial.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// TestimonialEditor Component
const TestimonialEditor = ({ existingTestimonial, onSave, onCancel, showNotification, uploadFileToCPanel }: any) => {
    const [testimonial, setTestimonial] = useState(existingTestimonial || { name: '', role: '', review: '', imageUrl: '', rating: 5 });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTestimonial((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating: number) => {
        setTestimonial((prev: any) => ({ ...prev, rating }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadFileToCPanel(file, showNotification);
            setTestimonial((prev: any) => ({ ...prev, imageUrl }));
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
                    {testimonial.imageUrl && <img src={testimonial.imageUrl} alt="Preview" className="w-24 h-24 mt-4 rounded-full object-cover" />}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Rating (1-5)</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button" onClick={() => handleRatingChange(star)}>
                                <span className={`text-2xl ${star <= testimonial.rating ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-300 transition-colors`}>★</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Review Content</label>
                    <textarea name="review" value={testimonial.review} onChange={handleChange} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" required></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">{isUploading ? 'Uploading...' : 'Save Testimonial'}</button>
                </div>
            </form>
        </div>
    );
};

// Enhanced RequestsView Component
const EnhancedRequestsView = ({ submittedVoucher, dealRequests, nftShowcase, hostvoucherTestimonials, onConvertToCatalog, onDeleteVoucher, onDeleteAllVouchers, onDeleteDeal, onDeleteAllDeals, onDeleteNftShowcase, onDeleteSiteTestimonial }: any) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">User Requests & Submissions</h2>

            {/* Vouchers Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Submitted Vouchers ({submittedVoucher.length})</h3>
                    {submittedVoucher.length > 0 && (
                        <button onClick={onDeleteAllVouchers} className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500">
                            Delete All
                        </button>
                    )}
                </div>
                {submittedVoucher.length > 0 ? (
                    <div className="space-y-2">
                        {submittedVoucher.map((req: any) => (
                            <div key={req.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div>
                                    <span className="font-medium">{req.provider}: {req.voucher_code}</span>
                                    <p className="text-sm text-slate-400">{req.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onConvertToCatalog(req)} className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-400">
                                        Convert to Catalog
                                    </button>
                                    <button onClick={() => onDeleteVoucher(req.id)} className="text-red-400 hover:text-red-300 p-1">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No submitted vouchers found.</p>
                )}
            </div>

            {/* Deal Requests Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Deal Requests ({dealRequests.length})</h3>
                    {dealRequests.length > 0 && (
                        <button onClick={onDeleteAllDeals} className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500">
                            Delete All
                        </button>
                    )}
                </div>
                {dealRequests.length > 0 ? (
                    <div className="space-y-2">
                        {dealRequests.map((req: any) => (
                            <div key={req.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div>
                                    <span className="font-medium">{req.user_email}</span>
                                    <p className="text-sm text-slate-400">requested a deal for {req.provider_name} ({req.service_type})</p>
                                </div>
                                <button onClick={() => onDeleteDeal(req.id)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No deal requests found.</p>
                )}
            </div>

            {/* NFT Showcase Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-4">NFT Showcase ({nftShowcase.length})</h3>
                {nftShowcase.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nftShowcase.map((nft: any) => (
                            <div key={nft.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                <h4 className="font-medium mb-2">{nft.title}</h4>
                                {nft.nft_image_url && (
                                    <img src={nft.nft_image_url} alt={nft.title} className="w-full h-32 object-cover rounded-md mb-2" />
                                )}
                                <p className="text-sm text-slate-400 mb-2">By: {nft.user_email}</p>
                                <div className="flex justify-between items-center">
                                    <a href={nft.marketplace_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
                                        View on Marketplace
                                    </a>
                                    <button onClick={() => onDeleteNftShowcase(nft.id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No NFT showcase items found.</p>
                )}
            </div>

            {/* Site Testimonials Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-4">Site Testimonials ({hostvoucherTestimonials.length})</h3>
                {hostvoucherTestimonials.length > 0 ? (
                    <div className="space-y-2">
                        {hostvoucherTestimonials.map((testimonial: any) => (
                            <div key={testimonial.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div>
                                    <span className="font-medium">{testimonial.name}</span>
                                    <p className="text-sm text-slate-400">{testimonial.message}</p>
                                </div>
                                <button onClick={() => onDeleteSiteTestimonial(testimonial.id)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No site testimonials found.</p>
                )}
            </div>
        </div>
    );
};

// AdjustPointsModal Component
const AdjustPointsModal = ({ modalState, onClose, onAdjust }: any) => {
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!modalState.isOpen) {
            setAmount(0);
            setReason('');
        }
    }, [modalState.isOpen]);

    if (!modalState.isOpen) return null;

    const { user } = modalState;

    const handleAdjust = () => {
        if (amount !== 0 && reason.trim() !== '') {
            onAdjust(user.id, amount, reason);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Adjust Points for {user.email}</h3>
                <p className="text-sm text-slate-400">Current Points: {(user.points || 0).toLocaleString()}</p>
                <InputField
                    label="Points to Add/Subtract (use '-' for subtraction)"
                    type="number"
                    value={amount}
                    onChange={(e: any) => setAmount(parseInt(e.target.value, 10) || 0)}
                />
                <InputField
                    label="Reason for Adjustment"
                    placeholder="e.g., Bonus for contest winner"
                    value={reason}
                    onChange={(e: any) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500">
                        Cancel
                    </button>
                    <button onClick={handleAdjust} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                        Apply Adjustment
                    </button>
                </div>
            </div>
        </div>
    );
};

// Paginator Component
const Paginator = ({ currentPage, totalPages, onPageChange }: any) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
                Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
                Next
            </button>
        </div>
    );
};

// Enhanced GamificationUserPanel Component
const EnhancedGamificationUserPanel = ({ users, onAwardNft, onAdjustPoints, showNotification }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [adjustPointsModal, setAdjustPointsModal] = useState({ isOpen: false, user: null });

    const filteredUsers = useMemo(() =>
        (users || []).filter((u: any) =>
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.eth_address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleCopyEthAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        showNotification("ETH Address copied to clipboard!", "success");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users /> User Gamification Management
                </h2>
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
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {paginatedUsers.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Points</th>
                                    <th className="px-6 py-3">Total Clicks</th>
                                    <th className="px-6 py-3">Last Active</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user: any) => (
                                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {user.email}
                                            <br/>
                                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                                {user.eth_address}
                                                <Copy size={12} className="cursor-pointer" onClick={() => handleCopyEthAddress(user.eth_address)}/>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-yellow-400">
                                            {user.points?.toLocaleString('en-US') || 0}
                                        </td>
                                        <td className="px-6 py-4">{user.total_clicks || 0}</td>
                                        <td className="px-6 py-4">{new Date(user.last_active).toLocaleString()}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => setAdjustPointsModal({isOpen: true, user: user})}
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 px-6 text-slate-400">
                            <h3 className="text-lg font-semibold text-white">No gamification users found.</h3>
                            <p>Users will appear here after they sign up on the Request & Submit NFT page.</p>
                        </div>
                    )}
                </div>
                <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            <AdjustPointsModal
                modalState={adjustPointsModal}
                onClose={() => setAdjustPointsModal({ isOpen: false, user: null })}
                onAdjust={onAdjustPoints}
            />
        </div>
    );
};

// Enhanced Notification Component
const EnhancedNotification = ({ show, message, type }: any) => {
    const notificationStyles: any = {
        info: { bg: 'bg-blue-500/20', border: 'border-blue-500', icon: <Info size={20} className="text-blue-300"/> },
        success: { bg: 'bg-green-500/20', border: 'border-green-500', icon: <CheckCircle size={20} className="text-green-300"/> },
        warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: <AlertCircle size={20} className="text-yellow-300"/> },
        error: { bg: 'bg-red-500/20', border: 'border-red-500', icon: <X size={20} className="text-red-300"/> },
    };

    const style = notificationStyles[type] || notificationStyles.info;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 20, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className={`fixed top-0 left-1/2 z-[100] p-4 rounded-lg border ${style.bg} ${style.border} text-white shadow-lg flex items-center gap-3`}
                >
                    {style.icon}
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// =================================================================================
// BAGIAN 4: KOMPONEN UTAMA DASHBOARD
// =================================================================================

const AdminDashboard = React.memo(({ onLogout }: { onLogout: () => void; userId: string | null; }) => {
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
    
    // Optimized data loading with caching and error handling
    const { data, loading: isLoading, error, reload } = useClientData(async () => {
        try {
            // Load essential data first
            const essentialData = await Promise.allSettled([
                dataApi.getDeals(),
                dataApi.getSiteSettings(),
            ]);

            const deals = essentialData[0].status === 'fulfilled' ? essentialData[0].value : [];
            const settings = essentialData[1].status === 'fulfilled' ? essentialData[1].value : {};

            // Load secondary data with timeout
            const secondaryDataPromise = Promise.allSettled([
                dataApi.fetchData('click_events'),
                dataApi.fetchData('submitted_vouchers'),
                dataApi.fetchData('deal_requests'),
                dataApi.getTestimonials(),
                dataApi.getNftShowcase(),
                dataApi.getHostVoucherTestimonials(),
                dataApi.fetchData('achievements'),
                dataApi.fetchData('gamification_users'),
                dataApi.fetchData('nft_redemption_requests'),
            ]);

            // Set timeout for secondary data
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Data loading timeout')), 10000)
            );

            const secondaryData = await Promise.race([secondaryDataPromise, timeoutPromise]) as any[];

            const [
                clickEventsResult,
                submittedVouchersResult,
                dealRequestsResult,
                testimonialsResult,
                nftShowcaseResult,
                hostvoucherTestimonialsResult,
                achievementsResult,
                gamificationUsersResult,
                nftRedemptionRequestsResult
            ] = secondaryData;

            const clickEvents = clickEventsResult.status === 'fulfilled' ? clickEventsResult.value : [];
            const submittedVouchers = submittedVouchersResult.status === 'fulfilled' ? submittedVouchersResult.value : [];
            const dealRequests = dealRequestsResult.status === 'fulfilled' ? dealRequestsResult.value : [];
            const testimonials = testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : [];
            const nftShowcase = nftShowcaseResult.status === 'fulfilled' ? nftShowcaseResult.value : [];
            const hostvoucherTestimonials = hostvoucherTestimonialsResult.status === 'fulfilled' ? hostvoucherTestimonialsResult.value : [];
            const achievements = achievementsResult.status === 'fulfilled' ? achievementsResult.value : {};
            const gamificationUsers = gamificationUsersResult.status === 'fulfilled' ? gamificationUsersResult.value : [];
            const nftRedemptionRequests = nftRedemptionRequestsResult.status === 'fulfilled' ? nftRedemptionRequestsResult.value : [];

            // Add clicks to deals efficiently
            const clickMap = new Map();
            clickEvents.forEach((e: any) => {
                clickMap.set(e.product_id, (clickMap.get(e.product_id) || 0) + 1);
            });

            const dealsWithClicks = deals.map((deal: any) => ({
                ...deal,
                clicks: clickMap.get(deal.id) || 0
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
        } catch (error) {
            console.error('Data loading error:', error);
            // Return minimal data to prevent complete failure
            return {
                deals: [],
                clickEvents: [],
                submittedVouchers: [],
                dealRequests: [],
                testimonials: [],
                nftShowcase: [],
                hostvoucherTestimonials: [],
                settings: {},
                achievements: {},
                gamificationUsers: [],
                nftRedemptionRequests: []
            };
        }
    });

    const showNotification = useCallback((message: any, type = 'info', duration = 4000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification(n => ({ ...n, show: false })), duration);
    }, []);

    const sectionRefs: any = {
        dashboard: useRef(null),
        analytics: useRef(null),
        campaigns: useRef(null),
        templates: useRef(null),
        'email-marketing': useRef(null),
        'nft-gamification': useRef(null),
        'catalog-colors': useRef(null),
        'floating-promo': useRef(null),
        gamification: useRef(null),
        catalog: useRef(null),
        add: useRef(null),
        testimonials: useRef(null),
        requests: useRef(null)
    };

    const handleAction = async (action: () => Promise<any>, successMessage: string) => {
        try { await action(); showNotification(successMessage, 'success'); reload(); } 
        catch (e: any) { showNotification(e.message || 'An error occurred', 'error'); }
    };

    const handleSaveProduct = (productData: any) => handleAction(() => apiClient.saveProduct(productData), "Product saved successfully!").then(() => setEditingProduct(null));
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
    const handleReorderCatalog = (reorderedProducts: any[]) => handleAction(() => apiClient.reorderCatalog(reorderedProducts), "Catalog order updated successfully!");

    const handleAddNewClick = useCallback(() => { setEditingProduct(null); sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.add]);
    const handleEditClick = useCallback((product: any) => { setEditingProduct(product); sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.add]);
    const handleCancelEdit = useCallback(() => { setEditingProduct(null); sectionRefs.catalog.current?.scrollIntoView({ behavior: 'smooth' }); }, [sectionRefs.catalog]);
    const handleConvertToCatalog = useCallback((voucher: any) => { setEditingProduct({ name: `${voucher.provider} Voucher`, provider: voucher.provider, type: 'Voucher', code: voucher.voucher_code, seoDescription: voucher.description, targetUrl: voucher.link }); sectionRefs.add.current?.scrollIntoView({ behavior: 'smooth' }); showNotification(`Form pre-filled from voucher. Please complete and save.`, "info"); }, [showNotification, sectionRefs.add]);
    const handleLinkClick = (product: any) => {
        if (product.target_url) {
            window.open(product.target_url, '_blank');
            awardAdminPoints(10); // Award 10 points for each click
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading admin dashboard...</p>
                    <p className="text-slate-500 text-sm mt-2">This may take a few moments</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
                <div className="text-center max-w-md">
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-6 rounded-lg">
                        <AlertCircle size={48} className="mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load admin data</h3>
                        <p className="text-sm text-red-200 mb-4">There was an error loading the dashboard data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-200 font-sans">
            <EnhancedNotification {...notification} />
            <AdminSidebar sectionRefs={sectionRefs} onAddNew={handleAddNewClick} onLogout={onLogout} />
            <main id="admin-main-panel" className="flex-1 flex flex-col overflow-x-hidden">
                 <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div ref={sectionRefs.dashboard} className="mb-16">
                        <DashboardView
                            products={data?.deals || []}
                            clickEvents={data?.clickEvents || []}
                            achievements={data?.achievements || {}}
                            showNotification={showNotification}
                        />
                    </div>

                    <div ref={sectionRefs.analytics} className="mb-16">
                        <AnalyticsDashboard />
                    </div>

                    <div ref={sectionRefs.campaigns} className="mb-16">
                        <CampaignManager />
                    </div>

                    <div ref={sectionRefs.templates} className="mb-16">
                        <TemplateManagement showNotification={showNotification} />
                    </div>

                    <div ref={sectionRefs['email-marketing']} className="mb-16">
                        <EmailMarketingManagement showNotification={showNotification} />
                    </div>

                    <div ref={sectionRefs['nft-gamification']} className="mb-16">
                        <NFTGamificationManagement showNotification={showNotification} />
                    </div>

                    <div ref={sectionRefs['catalog-colors']} className="mb-16">
                        <CatalogColorManager
                            products={data?.deals || []}
                            onSaveColorSettings={(settings) => console.log('Color settings saved:', settings)}
                            showNotification={showNotification}
                        />
                    </div>

                    <div ref={sectionRefs['floating-promo']} className="mb-16">
                        <FloatingPromoManager
                            onSave={(data) => console.log('Promo data saved:', data)}
                            showNotification={showNotification}
                        />
                    </div>

                    <div ref={sectionRefs.gamification} className="mb-16">
                        <EnhancedGamificationUserPanel
                            users={data?.gamificationUsers || []}
                            onAwardNft={handleAwardNft}
                            onAdjustPoints={handleAdjustPoints}
                            showNotification={showNotification}
                        />
                    </div>

                    <div ref={sectionRefs.catalog} className="mb-16">
                        <CatalogView
                            products={data?.deals || []}
                            onDelete={handleDeleteProduct}
                            onLinkClick={handleLinkClick}
                            onEdit={handleEditClick}
                            onAddNew={handleAddNewClick}
                            catalogNumberPrefix={data?.settings?.catalog_number_prefix || 'HV'}
                            settings={data?.settings || {}}
                            onReorder={handleReorderCatalog}
                        />
                    </div>

                    <div ref={sectionRefs.add} className="mb-16">
                        <AddEditProductView
                            onSave={handleSaveProduct}
                            onCancel={handleCancelEdit}
                            existingProduct={editingProduct}
                            catalogNumberPrefix={data?.settings?.catalog_number_prefix || 'HV'}
                            showNotification={showNotification}
                            uploadFileToCPanel={uploadFileToCPanel}
                        />
                    </div>

                    <div ref={sectionRefs.testimonials} className="mb-16">
                        <EnhancedTestimonialManagement
                            testimonials={data?.testimonials || []}
                            onSave={handleSaveTestimonial}
                            onDelete={handleDeleteTestimonial}
                            editingTestimonial={editingTestimonial}
                            setEditingTestimonial={setEditingTestimonial}
                            showNotification={showNotification}
                            uploadFileToCPanel={uploadFileToCPanel}
                        />
                    </div>

                    <div ref={sectionRefs.requests} className="mb-16">
                        <EnhancedRequestsView
                            submittedVoucher={data?.submittedVouchers || []}
                            dealRequests={data?.dealRequests || []}
                            nftShowcase={data?.nftShowcase || []}
                            hostvoucherTestimonials={data?.hostvoucherTestimonials || []}
                            nftRedemptionRequests={data?.nftRedemptionRequests || []}
                            onConvertToCatalog={handleConvertToCatalog}
                            onDeleteVoucher={handleDeleteVoucher}
                            onDeleteAllVouchers={handleDeleteAllVouchers}
                            onDeleteDeal={handleDeleteDeal}
                            onDeleteAllDeals={handleDeleteAllDeals}
                            onDeleteNftShowcase={handleDeleteNftShowcase}
                            onDeleteSiteTestimonial={handleDeleteSiteTestimonial}
                            onDeleteNftRedemptionRequest={handleDeleteNftRedemptionRequest}
                        />
                    </div>
                </div>
                 <footer className="p-4 bg-slate-800 border-t border-slate-700 text-center text-sm text-slate-400 flex-shrink-0">HostVoucher Admin Panel © {new Date().getFullYear()}</footer>
            </main>
        </div>
    );
});


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
        let mounted = true;

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            if (mounted) {
                setLoadingAuthState(false);
            }
        }, 5000);

        if (!auth) {
            if (mounted) setLoadingAuthState(false);
            clearTimeout(timeoutId);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!mounted) return;

            try {
                if (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email!)) {
                    setUser(currentUser);
                    setIsAuthorized(true);
                } else {
                    setUser(null);
                    setIsAuthorized(false);
                    if (currentUser) {
                        signOut(auth).catch(console.error);
                    }
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
                setIsAuthorized(false);
            } finally {
                setLoadingAuthState(false);
                clearTimeout(timeoutId);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            unsubscribe();
        };
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
