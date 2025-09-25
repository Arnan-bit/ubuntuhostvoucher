
'use client';
import { ComparisonPage } from '@/components/hostvoucher/PageComponents';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
    <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
    <div className="mb-6">
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  </div>
);


export default function WebHostingPage() {
  
  const { data, loading } = useClientData(async () => {
    const [allDeals, siteSettings] = await Promise.all([
        dataApi.getDeals(),
        dataApi.getSiteSettings()
    ]);
    return { allDeals, siteSettings };
  });

  if (loading || !data) {
    return <PageSkeleton />;
  }

  const { allDeals, siteSettings } = data;
  const translations = dataApi.translations;

  const webHostingDeals = allDeals.filter(
    (d: any) => d.type === 'Web Hosting'
  );

  const pageData = {
    Personal: webHostingDeals.filter((d: any) => d.tier === 'Personal'),
    Business: webHostingDeals.filter((d: any) => d.tier === 'Business'),
    Enterprise: webHostingDeals.filter((d: any) => d.tier === 'Enterprise'),
  };

  return (
    <ComparisonPage
      page="web-hosting"
      title={translations.en.webHosting}
      data={pageData}
      allDeals={allDeals}
      bannerConfig={siteSettings.pageBanners?.['web-hosting']}
      translations={translations}
      siteAppearance={siteSettings.siteAppearance}
    />
  );
}
