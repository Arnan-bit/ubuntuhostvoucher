

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ServiceCard, AnimatedVoucherCard, FAQSection, TestimonialsSection, CountdownTimer, CallToActionSection, RotatingBanner, DomaiNesiaImageBanner } from '@/components/hostvoucher/UIComponents';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Briefcase, Database, Mail, Shield, Zap, Star, Users, Award } from 'lucide-react';
import Image from 'next/image';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';
import {
    FadeInUp,
    FadeInLeft,
    FadeInRight,
    ScaleIn,
    StaggerContainer,
    StaggerItem,
    ParallaxScroll,
    FloatingElement,
    TypewriterText,
    PageTransition
} from '@/components/animations/ProfessionalAnimations';


// Rating & Review Component
const RatingReviewSection = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing deals and excellent customer service! Saved me hundreds on hosting.",
      service: "Web Hosting",
      date: "2 days ago"
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Best VPN deals I've found anywhere. Fast and reliable service.",
      service: "VPN Service",
      date: "1 week ago"
    },
    {
      name: "Emma Wilson",
      rating: 4,
      comment: "Great domain deals and easy setup process. Highly recommended!",
      service: "Domain Registration",
      date: "2 weeks ago"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(5)}
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">4.9</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  2,847+ Happy Customers
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Trusted Platform
                </span>
              </div>
            </div>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <StaggerItem key={index} index={index}>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  "{review.comment}"
                </p>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  {review.service}
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
};

const OfferCard = ({ deal }: any) => {
  return (
    <ScaleIn>
      <Link href={deal.targetUrl || '/'} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-white text-black shadow hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
        <h3 className="font-semibold text-lg">{deal.provider}</h3>
        <p className="text-sm text-gray-700">{deal.name}</p>
        <span className="mt-2 inline-block text-blue-700 font-semibold">View Details →</span>
      </Link>
    </ScaleIn>
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
                <FadeInUp>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Find Your Winning Digital Strategy</h2>
                </FadeInUp>
                <FadeInUp delay={0.2}>
                    <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10">
                        Every ambition requires a unique strategy. At HostVoucher, we don't just compare products; we provide a tailored arsenal engineered for every stage of your domination. This isn't about your "needs"—it's about your endgame. Choose your path below to see precisely how we engineer your victory.
                    </p>
                </FadeInUp>

                <ScaleIn delay={0.4}>
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
                            <FadeInLeft>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tabs[activeTab].content}</p>
                                    <Link href={tabs[activeTab].href} passHref>
                                        <Button variant="outline" className="mt-6">
                                            {tabs[activeTab].buttonText}
                                        </Button>
                                    </Link>
                                </div>
                            </FadeInLeft>
                            <FadeInRight>
                                <div className="hidden md:block">
                                    <FloatingElement intensity={5} duration={4}>
                                        <Image
                                            src={strategyImages[activeTab] || "https://placehold.co/600x400.png"}
                                            alt="Digital Strategy Illustration"
                                            width={600}
                                            height={400}
                                            className="rounded-lg shadow-md aspect-[4/3] object-cover"
                                            data-ai-hint="hosting packages"
                                        />
                                    </FloatingElement>
                                </div>
                            </FadeInRight>
                        </div>
                    </div>
                    </div>
                </ScaleIn>
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
          <FadeInUp>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">{title}</h2>
              <Link href={viewMoreLink} passHref>
                  <Button variant="outline">View More</Button>
              </Link>
            </div>
          </FadeInUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal: any, index: number) => (
              <StaggerItem key={`${deal.id}-${index}`}>
                {isVoucher ? (
                  <AnimatedVoucherCard
                      {...deal}
                      language="en"
                      onCopy={handleCopy}
                      index={index}
                      settings={settings}
                  />
                ) : (
                  <ServiceCard
                    {...deal}
                    language="en"
                    currency={{code: 'USD'}}
                    formatPrice={formatPrice}
                    settings={settings}
                  />
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
  );
};

const CompetitiveChoiceSection = () => (
    <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeInUp>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    <TypewriterText
                        text="The Battlefield is Digital. Your Hosting is Your Weapon."
                        delay={500}
                        speed={80}
                    />
                </h2>
            </FadeInUp>
            <FadeInUp delay={0.3}>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Your competitors are choosing their tools right now. Those who choose cheap, slow hosting will be left behind. Those who choose powerful, optimized hosting—the kind we curate—will dominate the market. The choice is simple: <span className="font-bold text-white">Equip yourself to win, or prepare to be defeated.</span> HostVoucher is where winners gear up.
                </p>
            </FadeInUp>
            <ScaleIn delay={0.6}>
                <Link href="/web-hosting">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                        Outsmart Your Competition
                    </Button>
                </Link>
            </ScaleIn>
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
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  const { allDeals, allPosts, allTestimonials, siteSettings } = data;
  const translations = dataApi.translations;

  // Get home page banner configuration
  const homeBannerConfig = siteSettings.page_banners?.['home'];
  const showHomeBanner = homeBannerConfig?.slides && homeBannerConfig.slides.length > 0 &&
    homeBannerConfig.slides.some((s: any) => s.imageUrl && s.imageUrl.trim() !== '');

  const heroBgImageUrl = siteSettings.site_appearance?.heroBackgroundImageUrl;

  const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      toast({
          title: "Copied!",
          description: `Coupon code "${code}" copied to clipboard.`,
      });
  };

  const categoriesToShow = [
    { title: "Premium Web Hosting Offers", type: "Web Hosting", link: "/web-hosting" },
    { title: "Exclusive WordPress Hosting Promos", type: "WordPress Hosting", link: "/wordpress-hosting" },
    { title: "Top Cloud Hosting Savings", type: "Cloud Hosting", link: "/cloud-hosting" },
    { title: "Best VPS Server Offers", type: "VPS", link: "/vps" },
    { title: "Ultimate VPN Promos", type: "VPN", link: "/vpn" },
    { title: "Premium Domain Offers", type: "Domain", link: "/domain" },
    { title: "Exclusive Voucher Codes", type: "Voucher", link: "/coupons", isVoucher: true },
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
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Use DomaiNesia-style image banner */}
        <DomaiNesiaImageBanner bannerConfig={homeBannerConfig} />

        <FadeInUp>
          <RatingReviewSection />
        </FadeInUp>

        <FadeInUp>
          <TestimonialsSection testimonials={allTestimonials} />
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <CompetitiveChoiceSection />
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">⚡ Exclusive Offers Ending Soon!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Don't miss out on these premium limited-time savings.</p>
                <CountdownTimer />
            </div>
          </section>
        </FadeInUp>

        <StrategySection siteAppearance={siteSettings.siteAppearance} translations={translations} />

        {categoriesToShow.map((category, index) => (
          <FadeInUp key={category.type} delay={index * 0.1}>
            <CategoryShowcase
              title={category.title}
              deals={getTopDeals(category.type)}
              viewMoreLink={category.link}
              isVoucher={category.isVoucher}
              settings={{}}
              translations={translations}
            />
          </FadeInUp>
        ))}

        <FadeInUp>
          <CallToActionSection />
        </FadeInUp>

        <FadeInUp>
          <div className="py-12 bg-gray-100 dark:bg-gray-800/50">
            <FAQSection page="home" language="en" translations={translations}/>
          </div>
        </FadeInUp>

      </div>
    </PageTransition>
  );
}
