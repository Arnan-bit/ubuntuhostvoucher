
'use client';
import { ComparisonPage } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';

export default function DomainPage() {

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

  const domainDeals = allDeals.filter(
    (d: any) => d.type === 'Domain'
  );

  const pageData = {
    "Domain Deals": domainDeals,
  };

  return (
    <ComparisonPage
      page="domain"
      title={translations.en.domains}
      data={pageData}
      allDeals={allDeals}
      bannerConfig={siteSettings.pageBanners?.['domain']}
      translations={translations}
      siteAppearance={siteSettings.siteAppearance}
    />
  );
}
