

'use client';

import React from 'react';
import { HomePage as LandingPageContent } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { Skeleton } from '@/components/ui/skeleton';


const PageSkeleton = () => (
    <div className="container mx-auto max-w-2xl p-4 pt-8 md:pt-16">
        <div className="text-center mb-12">
            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="mt-8 flex justify-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>
        </div>
        <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    </div>
);

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
        return <PageSkeleton />;
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
            siteAppearance={data.siteSettings.siteAppearance}
            bannerConfig={data.siteSettings.pageBanners?.['home'] || { images: [] }}
            popupConfig={data.siteSettings.popupModal}
            translations={data.translations}
            allTestimonials={data.allTestimonials}
            isLandingPage={true}
        />
    );
}
