'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveCatalogCard } from './ResponsiveCatalogCard';
import { Pagination, PaginationInfo } from '@/components/ui/Pagination';
import { Filter, Grid, List, Search, Loader2 } from 'lucide-react';

interface CatalogItem {
    id: string;
    name: string;
    title?: string;
    provider: string;
    type: string;
    tier?: string;
    price: number;
    original_price?: number;
    discount?: string;
    features?: string[];
    target_url: string;
    image?: string;
    provider_logo?: string;
    catalog_image?: string;
    brand_logo?: string;
    brand_logo_text?: string;
    rating: number;
    num_reviews: number;
    clicks: number;
    code?: string;
    color?: string;
    button_color?: string;
    is_featured: boolean;
    show_on_landing: boolean;
    display_style: 'vertical' | 'horizontal';
}

interface LandingPageCatalogProps {
    title?: string;
    subtitle?: string;
    showFilters?: boolean;
    showSearch?: boolean;
    maxItems?: number;
    categories?: string[];
    className?: string;
}

export const LandingPageCatalog: React.FC<LandingPageCatalogProps> = ({
    title = "Featured Products",
    subtitle = "Discover our handpicked selection of digital products and AI tools",
    showFilters = true,
    showSearch = true,
    maxItems = 12,
    categories = [],
    className = ''
}) => {
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
    const [paginatedItems, setPaginatedItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'featured' | 'price' | 'rating' | 'name'>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationSettings, setPaginationSettings] = useState({
        itemsPerPage: 12,
        rowsPerPage: 3,
        showPagination: true,
        paginationStyle: 'both' as 'numbers' | 'arrows' | 'both'
    });

    // Fetch catalog data and settings
    useEffect(() => {
        const fetchCatalogData = async () => {
            try {
                setLoading(true);
                const [catalogResponse, settingsResponse] = await Promise.all([
                    fetch('/api/data'),
                    fetch('/api/data?type=siteSettings')
                ]);

                const catalogData = await catalogResponse.json();
                const settingsData = await settingsResponse.json();

                // Filter only items that should show on landing page
                const landingItems = (catalogData.products || []).filter((item: CatalogItem) =>
                    item.show_on_landing
                );

                setCatalogItems(landingItems);
                setFilteredItems(landingItems);

                // Set pagination settings from admin
                if (settingsData.pagination_settings) {
                    setPaginationSettings(settingsData.pagination_settings);
                }
            } catch (error) {
                console.error('Error fetching catalog data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogData();
    }, []);

    // Handle pagination
    useEffect(() => {
        const startIndex = (currentPage - 1) * paginationSettings.itemsPerPage;
        const endIndex = startIndex + paginationSettings.itemsPerPage;
        setPaginatedItems(filteredItems.slice(startIndex, endIndex));
    }, [filteredItems, currentPage, paginationSettings.itemsPerPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortBy]);

    // Filter and search logic
    useEffect(() => {
        let filtered = catalogItems;

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => 
                item.type.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'featured':
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    return b.rating - a.rating;
                case 'price':
                    return a.price - b.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        // Apply max items limit
        if (maxItems > 0) {
            filtered = filtered.slice(0, maxItems);
        }

        setFilteredItems(filtered);
    }, [catalogItems, searchTerm, selectedCategory, sortBy, maxItems]);

    // Get unique categories
    const availableCategories = Array.from(
        new Set(catalogItems.map(item => item.type))
    ).sort();

    const handleItemClick = (item: CatalogItem) => {
        // Track click
        fetch('/api/track-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: item.id,
                productName: item.name,
                productType: item.type
            })
        }).catch(console.error);

        // Open link
        if (item.target_url) {
            window.open(item.target_url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className={`py-16 ${className}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                        <p className="text-gray-600 dark:text-gray-400">Loading catalog...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className={`py-16 bg-gray-50 dark:bg-gray-900 ${className}`}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Filters and Controls */}
                {(showFilters || showSearch) && (
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        {showSearch && (
                            <div className="relative max-w-md mx-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Filter Controls */}
                        {showFilters && (
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {/* Category Filter */}
                                <div className="flex items-center gap-2">
                                    <Filter size={20} className="text-gray-500" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Categories</option>
                                        {availableCategories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="featured">Featured First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="name">Name: A to Z</option>
                                </select>

                                {/* View Mode Toggle */}
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Count and Pagination Info */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-gray-600 dark:text-gray-400">
                        {paginationSettings.showPagination ? (
                            <PaginationInfo
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredItems.length / paginationSettings.itemsPerPage)}
                                totalItems={filteredItems.length}
                                itemsPerPage={paginationSettings.itemsPerPage}
                            />
                        ) : (
                            <p>Showing {filteredItems.length} of {catalogItems.length} products</p>
                        )}
                    </div>
                </div>

                {/* Catalog Grid/List */}
                {paginatedItems.length > 0 ? (
                    <>
                        <div className={
                            viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-6"
                        }>
                            {paginatedItems.map((item) => (
                            <ResponsiveCatalogCard
                                key={item.id}
                                item={{
                                    ...item,
                                    display_style: viewMode === 'list' ? 'horizontal' : item.display_style
                                }}
                                onItemClick={handleItemClick}
                                className={viewMode === 'list' ? 'w-full' : ''}
                            />
                        ))}
                        </div>

                        {/* Pagination Controls */}
                        {paginationSettings.showPagination && filteredItems.length > paginationSettings.itemsPerPage && (
                            <div className="mt-12 flex flex-col items-center space-y-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredItems.length / paginationSettings.itemsPerPage)}
                                    onPageChange={setCurrentPage}
                                    style={paginationSettings.paginationStyle}
                                    className="justify-center"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LandingPageCatalog;
