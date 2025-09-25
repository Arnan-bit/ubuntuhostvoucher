'use client';

import React from 'react';
import { LandingPageCatalog } from '@/components/catalog/LandingPageCatalog';

export default function CatalogPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Complete Product Catalog
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Browse our complete collection of hosting services, digital products, and exclusive deals. 
                        Use filters and search to find exactly what you need.
                    </p>
                </div>
                
                <LandingPageCatalog
                    title=""
                    subtitle=""
                    showFilters={true}
                    showSearch={true}
                    maxItems={1000} // Show all items with pagination
                    categories={[]}
                    className="bg-transparent"
                />
            </div>
        </div>
    );
}
