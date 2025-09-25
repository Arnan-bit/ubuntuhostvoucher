'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, TrendingUp, DollarSign, Calendar, Globe } from 'lucide-react';

interface Campaign {
    id: string;
    campaign_name: string;
    campaign_source: string;
    campaign_medium: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    target_countries: string;
    budget: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
}

const CampaignCard = ({ campaign, onEdit, onDelete, onToggleStatus }: any) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">{campaign.campaign_name}</h3>
                <p className="text-slate-400 text-sm">{campaign.campaign_source} • {campaign.campaign_medium}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.is_active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                }`}>
                    {campaign.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">Budget: ${campaign.budget}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">
                    {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                </span>
            </div>
        </div>

        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 text-sm">Target Countries:</span>
            </div>
            <p className="text-white text-sm">{campaign.target_countries || 'All countries'}</p>
        </div>

        <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
                Created: {new Date(campaign.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onToggleStatus(campaign.id, !campaign.is_active)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                        campaign.is_active
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                >
                    {campaign.is_active ? 'Pause' : 'Activate'}
                </button>
                <button
                    onClick={() => onEdit(campaign)}
                    className="p-2 rounded-md hover:bg-slate-600 text-blue-400"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(campaign.id)}
                    className="p-2 rounded-md hover:bg-slate-600 text-red-400"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
);

const CampaignForm = ({ campaign, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(campaign || {
        campaign_name: '',
        campaign_source: '',
        campaign_medium: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        target_countries: '',
        budget: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">
                {campaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name</label>
                        <input
                            type="text"
                            name="campaign_name"
                            value={formData.campaign_name}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Budget ($)</label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Source</label>
                        <input
                            type="text"
                            name="campaign_source"
                            value={formData.campaign_source}
                            onChange={handleChange}
                            placeholder="e.g., google, facebook, twitter"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Medium</label>
                        <input
                            type="text"
                            name="campaign_medium"
                            value={formData.campaign_medium}
                            onChange={handleChange}
                            placeholder="e.g., cpc, banner, email"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">UTM Source</label>
                        <input
                            type="text"
                            name="utm_source"
                            value={formData.utm_source}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">UTM Medium</label>
                        <input
                            type="text"
                            name="utm_medium"
                            value={formData.utm_medium}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">UTM Campaign</label>
                        <input
                            type="text"
                            name="utm_campaign"
                            value={formData.utm_campaign}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Countries</label>
                    <input
                        type="text"
                        name="target_countries"
                        value={formData.target_countries}
                        onChange={handleChange}
                        placeholder="e.g., US, UK, CA, AU (comma separated)"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-slate-300">Campaign is active</label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-500"
                    >
                        {campaign ? 'Update Campaign' : 'Create Campaign'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const CampaignManager = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now - replace with actual API call
        const mockCampaigns: Campaign[] = [
            {
                id: '1',
                campaign_name: 'Google Ads - Hosting Deals',
                campaign_source: 'google',
                campaign_medium: 'cpc',
                utm_source: 'google',
                utm_medium: 'cpc',
                utm_campaign: 'hosting_deals_2024',
                target_countries: 'US, UK, CA, AU',
                budget: 5000,
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z'
            },
            {
                id: '2',
                campaign_name: 'Facebook - VPN Promotions',
                campaign_source: 'facebook',
                campaign_medium: 'social',
                utm_source: 'facebook',
                utm_medium: 'social',
                utm_campaign: 'vpn_promo_q1',
                target_countries: 'US, DE, FR, IT',
                budget: 3000,
                start_date: '2024-01-15',
                end_date: '2024-03-31',
                is_active: false,
                created_at: '2024-01-15T00:00:00Z'
            }
        ];
        
        setCampaigns(mockCampaigns);
        setLoading(false);
    }, []);

    const handleCreateNew = () => {
        setEditingCampaign(null);
        setShowForm(true);
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setShowForm(true);
    };

    const handleSave = (campaignData: any) => {
        if (editingCampaign) {
            // Update existing campaign
            setCampaigns(prev => prev.map(c => 
                c.id === editingCampaign.id ? { ...c, ...campaignData } : c
            ));
        } else {
            // Create new campaign
            const newCampaign = {
                ...campaignData,
                id: Date.now().toString(),
                created_at: new Date().toISOString()
            };
            setCampaigns(prev => [...prev, newCampaign]);
        }
        setShowForm(false);
        setEditingCampaign(null);
    };

    const handleDelete = (campaignId: string) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        }
    };

    const handleToggleStatus = (campaignId: string, isActive: boolean) => {
        setCampaigns(prev => prev.map(c => 
            c.id === campaignId ? { ...c, is_active: isActive } : c
        ));
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCampaign(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Campaign Management</h2>
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Campaign
                </button>
            </div>

            {showForm && (
                <CampaignForm
                    campaign={editingCampaign}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.map(campaign => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                ))}
            </div>

            {campaigns.length === 0 && !showForm && (
                <div className="text-center py-12">
                    <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">No campaigns yet</h3>
                    <p className="text-slate-500 mb-4">Create your first marketing campaign to start tracking performance</p>
                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500"
                    >
                        Create Campaign
                    </button>
                </div>
            )}
        </div>
    );
};
