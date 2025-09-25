
'use client';
import { CouponsPage } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { CountdownTimer } from '@/components/hostvoucher/UIComponents';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
      <div className="mb-6">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
);

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
        <div className="space-y-12 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <Skeleton className="h-8 w-1/3 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
                <Skeleton className="h-20 w-full max-w-md mx-auto" />
            </div>
            <PageSkeleton />
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
      description: d.seo_description || 'Exclusive offer from HostVoucher',
      code: d.code || 'USE-LINK',
      url: d.target_url || d.link,
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
