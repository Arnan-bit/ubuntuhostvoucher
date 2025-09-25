
'use client';
import { CouponsPage } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { CountdownTimer } from '@/components/hostvoucher/UIComponents';

export default function Coupons() {

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

  const coupons = allDeals.filter(
    (d: any) => d.type === 'Voucher'
  ).map((d: any) => ({
      id: d.id,
      title: d.name || d.title,
      discount: d.discount || 'Special Offer',
      description: d.seoDescription || 'Exclusive offer from HostVoucher',
      code: d.code || 'USE-LINK',
      url: d.targetUrl || d.link,
      provider: d.provider,
      type: d.type,
      color: d.color || 'blue',
      tier: d.tier
  }));

  return (
    <>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">⚡ Flash Deals Ending Soon!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Don't miss out on these limited-time offers.</p>
            <CountdownTimer />
        </div>
      </section>
      <CouponsPage
        page="coupons"
        allCoupons={coupons}
        allDeals={allDeals}
        bannerConfig={siteSettings.pageBanners?.['Voucher']}
        translations={translations}
        siteAppearance={siteSettings.siteAppearance}
      />
    </>
  );
}
