'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    description: string;
    image_url: string;
    link_url?: string;
    target_page: string;
    position: string;
    active: boolean;
    rotation_settings?: {
        enabled: boolean;
        interval: number;
        schedule: string;
    };
}

interface BannerRotationProps {
    banners: Banner[];
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
    currentPage: string;
    className?: string;
}

export const BannerRotation: React.FC<BannerRotationProps> = ({
    banners,
    position,
    currentPage,
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    // Filter banners for current page and position
    const activeBanners = banners.filter(banner => 
        banner.active && 
        banner.position === position &&
        (banner.target_page === 'all' || banner.target_page === currentPage)
    );

    // Auto rotation effect
    useEffect(() => {
        if (!isAutoRotating || activeBanners.length <= 1) return;

        const currentBanner = activeBanners[currentIndex];
        const interval = currentBanner?.rotation_settings?.enabled 
            ? currentBanner.rotation_settings.interval * 1000 
            : 5000;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                (prevIndex + 1) % activeBanners.length
            );
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, activeBanners, isAutoRotating]);

    // Check if banner should be shown based on schedule
    const shouldShowBanner = (banner: Banner) => {
        if (!banner.rotation_settings?.schedule || banner.rotation_settings.schedule === 'always') {
            return true;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

        switch (banner.rotation_settings.schedule) {
            case 'business_hours':
                return currentHour >= 9 && currentHour <= 17 && currentDay >= 1 && currentDay <= 5;
            case 'weekends':
                return currentDay === 0 || currentDay === 6;
            default:
                return true;
        }
    };

    // Filter banners by schedule
    const scheduledBanners = activeBanners.filter(shouldShowBanner);

    if (scheduledBanners.length === 0) {
        return null;
    }

    const currentBanner = scheduledBanners[currentIndex % scheduledBanners.length];

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? scheduledBanners.length - 1 : prevIndex - 1
        );
        setIsAutoRotating(false);
        setTimeout(() => setIsAutoRotating(true), 10000); // Resume auto-rotation after 10s
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex + 1) % scheduledBanners.length
        );
        setIsAutoRotating(false);
        setTimeout(() => setIsAutoRotating(true), 10000); // Resume auto-rotation after 10s
    };

    const BannerContent = () => (
        <div className="relative group overflow-hidden rounded-lg">
            <div className="relative w-full h-48 md:h-64">
                <Image
                    src={currentBanner.image_url}
                    alt={currentBanner.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Banner Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{currentBanner.title}</h3>
                    {currentBanner.description && (
                        <p className="text-sm opacity-90">{currentBanner.description}</p>
                    )}
                </div>
            </div>

            {/* Navigation Controls */}
            {scheduledBanners.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                        aria-label="Next banner"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {scheduledBanners.length > 1 && (
                <div className="absolute bottom-2 right-2 flex space-x-1">
                    {scheduledBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsAutoRotating(false);
                                setTimeout(() => setIsAutoRotating(true), 10000);
                            }}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                index === currentIndex % scheduledBanners.length
                                    ? 'bg-white'
                                    : 'bg-white/50'
                            }`}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    // Render with or without link
    return (
        <div className={`banner-rotation ${className}`}>
            {currentBanner.link_url ? (
                <Link href={currentBanner.link_url} className="block">
                    <BannerContent />
                </Link>
            ) : (
                <BannerContent />
            )}
        </div>
    );
};

// Hook to fetch banners from API
export const useBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/data?type=banners');
                const data = await response.json();
                setBanners(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to fetch banners');
                console.error('Error fetching banners:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    return { banners, loading, error };
};

export default BannerRotation;
