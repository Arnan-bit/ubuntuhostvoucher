'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessionalCatalogCard } from './ProfessionalCatalogCard';
import { Plus, Minus, Eye, EyeOff, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

interface LandingPageCatalogManagerProps {
    allCatalogs: any[];
    landingPageCatalogs: string[];
    onUpdateLandingCatalogs: (catalogIds: string[]) => void;
    isAdminMode?: boolean;
    itemsPerPage?: number;
    showPagination?: boolean;
}

export const LandingPageCatalogManager: React.FC<LandingPageCatalogManagerProps> = ({
    allCatalogs,
    landingPageCatalogs,
    onUpdateLandingCatalogs,
    isAdminMode = false,
    itemsPerPage = 12,
    showPagination = true
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [localLandingCatalogs, setLocalLandingCatalogs] = useState<string[]>(landingPageCatalogs);

    useEffect(() => {
        setLocalLandingCatalogs(landingPageCatalogs);
    }, [landingPageCatalogs]);

    // Filter catalogs that are shown on landing page
    const displayedCatalogs = allCatalogs.filter(catalog => 
        localLandingCatalogs.includes(catalog.id)
    );

    // Pagination
    const totalPages = Math.ceil(displayedCatalogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCatalogs = displayedCatalogs.slice(startIndex, startIndex + itemsPerPage);

    const handleToggleCatalog = (catalogId: string) => {
        const newLandingCatalogs = localLandingCatalogs.includes(catalogId)
            ? localLandingCatalogs.filter(id => id !== catalogId)
            : [...localLandingCatalogs, catalogId];
        
        setLocalLandingCatalogs(newLandingCatalogs);
        onUpdateLandingCatalogs(newLandingCatalogs);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    if (isAdminMode) {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Landing Page Catalog Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Select which catalogs should appear on the landing page. This won't affect their visibility on other pages.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allCatalogs.map((catalog) => (
                            <div
                                key={catalog.id}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                    localLandingCatalogs.includes(catalog.id)
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {catalog.title || catalog.name}
                                    </h4>
                                    <button
                                        onClick={() => handleToggleCatalog(catalog.id)}
                                        className={`p-2 rounded-full transition-all duration-300 ${
                                            localLandingCatalogs.includes(catalog.id)
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                    >
                                        {localLandingCatalogs.includes(catalog.id) ? (
                                            <Minus size={16} />
                                        ) : (
                                            <Plus size={16} />
                                        )}
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>{catalog.provider}</span>
                                    <span>•</span>
                                    <span>{catalog.type}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        ${catalog.price}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {localLandingCatalogs.includes(catalog.id) ? (
                                            <Eye size={16} className="text-green-500" />
                                        ) : (
                                            <EyeOff size={16} className="text-gray-400" />
                                        )}
                                        <span className="text-xs">
                                            {localLandingCatalogs.includes(catalog.id) ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Currently showing {localLandingCatalogs.length} catalogs on landing page
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Changes are saved automatically. Catalogs removed from landing page will still be visible on their respective category pages.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Public view
    return (
        <div className="space-y-6">
            {/* View Controls */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Featured Offers
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'list'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Catalog Grid/List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                }
            >
                <AnimatePresence>
                    {paginatedCatalogs.map((catalog) => (
                        <motion.div
                            key={catalog.id}
                            variants={itemVariants}
                            layout
                        >
                            <ProfessionalCatalogCard
                                item={catalog}
                                layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                                showAnimation={true}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {displayedCatalogs.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <EyeOff size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No catalogs to display
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        No catalogs are currently selected for the landing page.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LandingPageCatalogManager;
