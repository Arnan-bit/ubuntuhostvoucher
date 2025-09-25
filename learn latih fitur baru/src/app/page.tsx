

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ServiceCard, AnimatedVoucherCard, FAQSection, TestimonialsSection, CountdownTimer, CallToActionSection, RotatingBanner } from '@/components/hostvoucher/UIComponents';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Briefcase, Database, Mail, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import { Skeleton } from '@/components/ui/skeleton';


const PageSkeleton = () => (
  <div className="space-y-16 py-16">
    <div className="container mx-auto">
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
    <div className="container mx-auto">
       <Skeleton className="h-10 w-1/2 mx-auto mb-10" />
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
       </div>
    </div>
  </div>
);


const OfferCard = ({ deal }: any) => {
  return (
    <Link href={deal.targetUrl || '/'} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-white text-black shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="font-semibold text-lg">{deal.provider}</h3>
      <p className="text-sm text-gray-700">{deal.name}</p>
      <span className="mt-2 inline-block text-blue-700 font-semibold">View Details →</span>
    </Link>
  );
}

const StrategySection = ({ siteAppearance, translations }: any) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = [
        {
            name: "Build a Digital Foundation",
            content: "For the visionaries, brands, and businesses ready to launch their online existence with authority. This is the first and most critical step. We provide an unshakeable foundation with our Web Hosting, designed for superior speed and absolute reliability from day one. Don't just create a website, build a monument.",
            buttonText: "Explore Web Hosting Plans",
            href: "/web-hosting",
            icon: <Briefcase size={20} />
        },
        {
            name: "Master the WordPress Platform",
            content: "For those who understand the power of the world's #1 ecosystem and refuse to be average. If you run on WordPress, you require an obsessively optimized environment. Our WordPress Hosting is a high-speed fortress built specifically to serve WordPress, granting it speed and security that standard hosting cannot match.",
            buttonText: "See the WordPress Advantage",
            href: "/wordpress-hosting",
            icon: <Zap size={20} />
        },
        {
            name: "Run Full-Scale Applications",
            content: "For the developers, tech startups, and enterprises that demand raw computing power under their full control. When shared hosting is no longer enough, you require absolute authority. Our Cloud VPS gives you isolated resources, instant scalability, and the freedom to deploy complex applications, game servers, or custom infrastructure. This isn't hosting; this is your server sovereignty.",
            buttonText: "Claim Your Cloud VPS Resources",
            href: "/vps",
            icon: <Database size={20} />
        },
        {
            name: "Build Professional Credibility",
            content: "For businesses that understand perception is reality. An address like you@yourbusiness.com is not a feature; it is a symbol of authority. Our Email Hosting service ensures every message you send builds trust, signals professionalism, and secures your business correspondence from spies and delivery failures.",
            buttonText: "Secure Your Professional Email",
            href: "/#", // Update with correct link when available
            icon: <Mail size={20} />
        },
        {
            name: "Fortify Your Digital Assets",
            content: "For leaders who know that an attack is no longer a matter of 'if,' but 'when.' Your customer trust and your data are priceless assets. With our Premium SSL Certificates and Strategic VPN Services, you don't just encrypt data; you build a multi-layered fortress around your digital empire, protecting your reputation and your revenue from all threats.",
            buttonText: "Fortify Your Security Now",
            href: "/vpn",
            icon: <Shield size={20} />
        }
    ];

    const strategyImages = siteAppearance?.strategySectionImages || [];

    return (
        <section className="bg-gray-100 dark:bg-gray-800/50 py-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Find Your Winning Digital Strategy</h2>
                <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10">
                    Every ambition requires a unique strategy. At HostVoucher, we don't just compare products; we provide a tailored arsenal engineered for every stage of your domination. This isn't about your "needs"—it's about your endgame. Choose your path below to see precisely how we engineer your victory.
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide">
                            {tabs.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${activeTab === index
                                            ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                  {tab.icon} {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 text-left">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tabs[activeTab].content}</p>
                                <Link href={tabs[activeTab].href} passHref>
                                    <Button variant="outline" className="mt-6">
                                        {tabs[activeTab].buttonText}
                                    </Button>
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <Image
                                    src={strategyImages[activeTab] || "https://placehold.co/600x400.png"}
                                    alt="Digital Strategy Illustration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-md aspect-[4/3] object-cover"
                                    data-ai-hint="hosting packages"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const CategoryShowcase = ({ title, deals, viewMoreLink, isVoucher = false, settings, translations }: any) => {
  const { toast } = useToast();
  
  const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      toast({
          title: "Copied!",
          description: `Coupon code "${code}" copied to clipboard.`,
      });
  };

  const formatPrice = (price: any, currency?: any) => `$${price}`;
  
  if (!deals || deals.length === 0) return null;

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800/50 first:pt-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            <Link href={viewMoreLink} passHref>
                <Button variant="outline">View More</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal: any, index: number) => (
              isVoucher ? (
                <AnimatedVoucherCard 
                    key={`${deal.id}-${index}`}
                    {...deal}
                    language="en" 
                    onCopy={handleCopy} 
                    index={index}
                    settings={settings}
                />
              ) : (
                <ServiceCard 
                  key={deal.id}
                  {...deal}
                  language="en"
                  currency={{code: 'USD'}}
                  formatPrice={formatPrice}
                  settings={settings}
                />
              )
            ))}
          </div>
        </div>
      </section>
  );
};

const CompetitiveChoiceSection = () => (
    <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                The Battlefield is Digital. Your Hosting is Your Weapon.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Your competitors are choosing their tools right now. Those who choose cheap, slow hosting will be left behind. Those who choose powerful, optimized hosting—the kind we curate—will dominate the market. The choice is simple: <span className="font-bold text-white">Equip yourself to win, or prepare to be defeated.</span> HostVoucher is where winners gear up.
            </p>
            <Link href="/web-hosting">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    Outsmart Your Competition
                </Button>
            </Link>
        </div>
    </section>
);


export default function IndexPage() {
  const { toast } = useToast();
  
  const { data, loading } = useClientData(async () => {
    const [allDeals, allPosts, allTestimonials, siteSettings] = await Promise.all([
      dataApi.getDeals(),
      dataApi.getBlogPosts(),
      dataApi.getTestimonials(),
      dataApi.getSiteSettings(),
    ]);
    return { allDeals, allPosts, allTestimonials, siteSettings };
  });

  if (loading || !data) {
    return <PageSkeleton />;
  }

  const { allDeals, allPosts, allTestimonials, siteSettings } = data;
  const translations = dataApi.translations;
  const homeBannerConfig = siteSettings.page_banners?.['home'];
  const showHomeBanner = homeBannerConfig?.slides && homeBannerConfig.slides.length > 0 && homeBannerConfig.slides.some((s:any) => s.imageUrl);

  const heroBgImageUrl = siteSettings.site_appearance?.heroBackgroundImageUrl;


  const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      toast({
          title: "Copied!",
          description: `Coupon code "${code}" copied to clipboard.`,
      });
  };

  const categoriesToShow = [
    { title: "Top Web Hosting Deals", type: "Web Hosting", link: "/web-hosting" },
    { title: "Top WordPress Hosting Deals", type: "WordPress Hosting", link: "/wordpress-hosting" },
    { title: "Top Cloud Hosting Deals", type: "Cloud Hosting", link: "/cloud-hosting" },
    { title: "Top VPS Offers", type: "VPS", link: "/vps" },
    { title: "Top VPN Deals", type: "VPN", link: "/vpn" },
    { title: "Top Domain Deals", type: "Domain", link: "/domain" },
    { title: "Popular Vouchers", type: "Voucher", link: "/coupons", isVoucher: true },
  ];

  const getTopDeals = (type: string, count = 3) => {
    return allDeals
      .filter((d: any) => d.type === type)
      .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, count)
      .map((d: any) => type === 'Voucher' ? ({
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
      }) : d);
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {showHomeBanner ? <RotatingBanner bannerConfig={homeBannerConfig} /> : (
        <section 
          className="relative pt-16 pb-16 text-white text-center bg-cover bg-center bg-no-repeat"
          style={heroBgImageUrl ? { backgroundImage: `url(${heroBgImageUrl})` } : {}}
        >
          {!heroBgImageUrl && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-500"></div>}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Find the Best Hosting Deals in One Click
            </h1>
            <p className="text-lg md:text-xl mb-8">
              We compare, you save. Discover promos for domains, VPS, cloud hosting, and more.
            </p>
            <Link href="/web-hosting">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Search Hosting Deals
              </Button>
            </Link>
          </div>
        </section>
      )}

      <TestimonialsSection testimonials={allTestimonials} />
      
      <CompetitiveChoiceSection />

      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">⚡ Flash Deals Ending Soon!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Don't miss out on these limited-time offers.</p>
            <CountdownTimer />
        </div>
      </section>

      <StrategySection siteAppearance={siteSettings.siteAppearance} translations={translations} />

      {categoriesToShow.map(category => (
        <CategoryShowcase
          key={category.type}
          title={category.title}
          deals={getTopDeals(category.type)}
          viewMoreLink={category.link}
          isVoucher={category.isVoucher}
          settings={{}}
          translations={translations}
        />
      ))}
      <CallToActionSection />
      <div className="py-12 bg-gray-100 dark:bg-gray-800/50">
        <FAQSection page="home" language="en" translations={translations}/>
      </div>

    </div>
  );
}
