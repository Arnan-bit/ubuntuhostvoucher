

'use client';

import React from 'react';
import { HomePage as LandingPageContent } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { PageLoader } from '@/components/ui/ModernLoader';

export default function LandingPage() {
    const { data, loading } = useClientData(async () => {
        const [deals, settings, testimonials] = await Promise.all([
            dataApi.getDeals(),
            dataApi.getSiteSettings(),
            dataApi.getTestimonials(),
        ]);
        return {
            allDeals: deals,
            siteSettings: settings,
            translations: dataApi.translations,
            allTestimonials: testimonials,
        };
    });

    if (loading || !data) {
        return <PageLoader text="Loading amazing deals..." />;
    }

    const featuredDeals = data.allDeals
        .filter((d: any) => d.is_featured)
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

    const scrollerItems = data.allDeals
        .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 10);

    return (
        <LandingPageContent
            featuredDeals={featuredDeals}
            allDeals={data.allDeals}
            scrollerItems={scrollerItems}
            siteAppearance={data.siteSettings.site_appearance || data.siteSettings.siteAppearance || {}}
            bannerConfig={data.siteSettings.pageBanners?.['home'] || { images: [] }}
            popupConfig={data.siteSettings.popupModal}
            translations={data.translations}
            allTestimonials={data.allTestimonials}
            isLandingPage={true}
        />
    );
}
