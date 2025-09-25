'use client';

import React, { useEffect, useState } from 'react';

export const BannerDebug = () => {
    const [bannerData, setBannerData] = useState(null);
    const [siteSettings, setSiteSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch site settings
                const settingsResponse = await fetch('/api/data?type=siteSettings');
                const settings = await settingsResponse.json();
                setSiteSettings(settings);

                // Fetch banners specifically
                const bannersResponse = await fetch('/api/data?type=banners');
                const banners = await bannersResponse.json();
                setBannerData(banners);

                console.log('Site Settings:', settings);
                console.log('Banner Data:', banners);
                console.log('Home Banner Config:', settings.page_banners?.home);
                
            } catch (err: any) {
                setError(err.message);
                console.error('Debug fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-4 bg-yellow-100 text-yellow-800">Loading debug data...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-800">Error: {error}</div>;

    const homeBannerConfig = siteSettings?.page_banners?.home;
    const showHomeBanner = homeBannerConfig?.slides && homeBannerConfig.slides.length > 0 && 
        homeBannerConfig.slides.some((s: any) => s.imageUrl && s.imageUrl.trim() !== '');

    return (
        <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-auto">
            <h3 className="font-bold mb-2">Banner Debug Info</h3>
            <div className="text-sm space-y-2">
                <div>
                    <strong>Show Home Banner:</strong> {showHomeBanner ? 'YES' : 'NO'}
                </div>
                <div>
                    <strong>Home Banner Slides:</strong> {homeBannerConfig?.slides?.length || 0}
                </div>
                {homeBannerConfig?.slides?.map((slide: any, index: number) => (
                    <div key={index} className="border p-2 rounded">
                        <div><strong>Slide {index + 1}:</strong></div>
                        <div>Image: {slide.imageUrl ? '✓' : '✗'}</div>
                        <div>Title: {slide.title || 'No title'}</div>
                        <div>Subtitle: {slide.subtitle || 'No subtitle'}</div>
                        <div>Button: {slide.buttonText || 'No button'}</div>
                        {slide.imageUrl && (
                            <img 
                                src={slide.imageUrl} 
                                alt="Preview" 
                                className="w-full h-20 object-cover mt-1 rounded"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                ))}
                <div className="mt-4">
                    <strong>Raw Data:</strong>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(homeBannerConfig, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};
