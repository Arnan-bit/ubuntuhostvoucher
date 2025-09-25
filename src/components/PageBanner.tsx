'use client';

import React from 'react';
import { BannerRotation, useBanners } from './BannerRotation';

interface PageBannerProps {
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
    currentPage: string;
    className?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
    position,
    currentPage,
    className = ''
}) => {
    const { banners, loading, error } = useBanners();

    if (loading) {
        return (
            <div className={`animate-pulse bg-slate-200 rounded-lg h-48 md:h-64 ${className}`}>
                <div className="h-full bg-gradient-to-r from-slate-300 to-slate-200 rounded-lg"></div>
            </div>
        );
    }

    if (error || !banners.length) {
        return null;
    }

    return (
        <BannerRotation
            banners={banners}
            position={position}
            currentPage={currentPage}
            className={className}
        />
    );
};

export default PageBanner;
