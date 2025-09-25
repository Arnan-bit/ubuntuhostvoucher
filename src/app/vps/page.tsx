
'use client';
import { ComparisonPage } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';

export default function VpsPage() {

  const { data, loading } = useClientData(async () => {
    const [allDeals, siteSettings] = await Promise.all([
        dataApi.getDeals(),
        dataApi.getSiteSettings()
    ]);
    return { allDeals, siteSettings };
  });

  if (loading || !data) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  const { allDeals, siteSettings } = data;
  const translations = dataApi.translations;

  const vpsDeals = allDeals.filter(
    (d: any) => d.type === 'VPS'
  );

  const pageData = {
    "Best VPS Server Offers": vpsDeals,
  };

  return (
    <ComparisonPage
      page="vps"
      title="VPS"
      data={pageData}
      allDeals={allDeals}
      bannerConfig={siteSettings.pageBanners?.['vps']}
      translations={translations}
      siteAppearance={siteSettings.siteAppearance}
    />
  );
}
