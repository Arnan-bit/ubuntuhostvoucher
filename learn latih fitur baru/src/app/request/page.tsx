

'use client';

import React from 'react';
import { RequestAndSubmitPage as RequestAndSubmitPageComponent } from '@/components/hostvoucher/PageComponents';
import { useClientData } from '@/hooks/use-client-data';
import * as dataApi from '@/lib/hostvoucher-data';

export default function RequestPage() {
    const { data, loading } = useClientData(async () => {
        const [
            settings,
            deals,
            tasks,
            showcase,
            testimonials,
        ] = await Promise.all([
            dataApi.getSiteSettings(),
            dataApi.getDeals(),
            dataApi.getMiningTasks(),
            dataApi.getNftShowcase(),
            dataApi.getHostVoucherTestimonials(),
        ]);
        return {
            siteSettings: settings,
            allDeals: deals,
            miningTasks: tasks,
            nftShowcase: showcase,
            hostvoucherTestimonials: testimonials,
            translations: dataApi.translations
        };
    });

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <RequestAndSubmitPageComponent
            translations={data.translations}
            allDeals={data.allDeals}
            siteSettings={data.siteSettings}
            miningTasks={data.miningTasks}
            nftShowcase={data.nftShowcase}
            hostvoucherTestimonials={data.hostvoucherTestimonials}
        />
    );
}
