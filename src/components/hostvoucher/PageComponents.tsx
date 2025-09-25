

'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SparklesIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './IconComponents';
import { SocialIcons } from './LayoutComponents';
import { ServiceCard, UniversalSearchResultCard, StarRating, HorizontalFilter, FAQSection, AboutHostVoucherSection, PopularBrands, RotatingBanner, PopupModal, HorizontalDealScroller, CircularShareButton, AnimatedVoucherCard, useGamification, useAnimation } from './UIComponents';
import { useToast } from "@/hooks/use-toast";
import * as apiClient from '@/lib/api-client';
import { badgeTiers as allBadgeTiers } from '@/lib/hostvoucher-data';
import { getIconByTierName, findBadgeInfo } from '@/lib/utils';
import { DollarSign, UploadCloud, Youtube, Twitter, MessageCircle, MonitorPlay, Share2, Check, Edit, Lock, ExternalLink, ImageIcon, Star, HelpCircle, Gift, ShoppingCart, Crown, Rocket, Shield, Gem, Medal } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { AvatarSystem } from '@/components/gamification/AvatarSystem';

const appId = 'HostVoucher-ai-tracking-stable';


export const HomePage = ({ featuredDeals, allDeals, scrollerItems, siteAppearance, bannerConfig, popupConfig, translations, allTestimonials, isLandingPage }: any) => {
    const [showPopup, setShowPopup] = useState(false);
    
    const animatedCardId = useAnimation(
      (featuredDeals || []).map((d: any) => d.isFeatured ? `deal-${d.id}` : d.id),
      siteAppearance?.animationSettings,
      isLandingPage ? 'landing' : 'home'
    );
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (popupConfig?.images && popupConfig.images.length > 0) {
                setShowPopup(true);
            }
        }, 3000); // Show popup after 3 seconds
        return () => clearTimeout(timer);
    }, [popupConfig]);

    if (!translations || !translations.en) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div></div>;
    }
    
    const { awardPoints } = useGamification();
    const handleSocialClick = (platform: string) => {
        awardPoints('visit', platform);
    };

    if (isLandingPage) {
        return (
             <div className="container mx-auto max-w-2xl p-4 pt-8 md:pt-16">
                <div className="text-center mb-12">
                     <Link href="/landing">
                        <Image src={siteAppearance?.specialistImageUrl || "https://i.ibb.co/QdBBzJL/specialist-profile.jpg"} width={128} height={128} data-ai-hint="professional man portrait" alt="HostVoucher Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-orange-500 shadow-lg object-cover"/>
                    </Link>
                    <Link href="/landing">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">@HostVoucher</h1>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{translations.en.tagline.replace('Your ', '')}</p>
                     <div className="mt-8">
                         <SocialIcons colorful={true} onSocialClick={handleSocialClick} />
                    </div>
                </div>

                <div className="mt-12 space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b-2 border-orange-500/50 inline-block">
                            👇 Choose Your Perfect Deal Below 👇
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                    {(featuredDeals || []).map((deal: any) => {
                        const animationClass = deal.id === animatedCardId ? siteAppearance?.animationSettings?.style : 'none';
                        return (
                           <UniversalSearchResultCard 
                                key={`featured-${deal.id}`} 
                                item={deal}
                                language="en"
                                currency={{code: 'USD'}}
                                formatPrice={(p: any) => `$${p}`}
                                onCopy={() => {}}
                                animationStyle={animationClass}
                            />
                        );
                    })}
                    </div>
                </div>
                
                <div className="mt-16">
                    <HorizontalDealScroller items={scrollerItems} language="en" currency={{code: 'USD'}} formatPrice={(p:any) => `$${p}`} translations={translations} />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-7xl p-4 pt-8 md:pt-16">
            <PopupModal isVisible={showPopup} onClose={() => setShowPopup(false)} config={popupConfig} />
            <RotatingBanner bannerConfig={bannerConfig} />
            
            <div className="mt-12 space-y-12 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b-2 border-orange-500/50 inline-block">
                    {translations?.en.picksAndDealsTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(featuredDeals || []).map((deal: any) => {
                    const animationClass = deal.id === animatedCardId ? siteAppearance?.animationSettings?.style : 'none';
                    return (
                       <ServiceCard 
                            key={`featured-${deal.id}`} 
                            {...deal} 
                            language="en"
                            currency={{code: 'USD'}}
                            formatPrice={(p: any) => `$${p}`}
                             animationStyle={animationClass}
                        />
                    );
                })}
                </div>
            </div>
            
            <div className="mt-16">
                <HorizontalDealScroller items={scrollerItems} language="en" currency={{code: 'USD'}} formatPrice={(p:any) => `$${p}`} translations={translations} />
            </div>
        </div>
    );
}

export const ComparisonPage = ({ page, title, data, allDeals, bannerConfig, translations, siteAppearance }: any) => {
    const [tier, setTier] = useState(Object.keys(data)[0] || 'Personal');
    const [sort, setSort] = useState('rating');
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const { toast } = useToast();
    const [isAiRecommending, setIsAiRecommending] = useState(false);
    const [recommendedDealId, setRecommendedDealId] = useState(null);
    const catalogRef = useRef<HTMLDivElement>(null);

    const itemsToDisplay = useMemo(() => {
        let items = data[tier] || [];
        
        if (brandFilter) {
            items = items.filter((item: any) => item.provider === brandFilter);
        }

        const sortFunctions: any = {
            rating: (a: any, b: any) => (b.rating || 0) - (a.rating || 0),
            price_asc: (a: any, b: any) => parseFloat(a.price) - parseFloat(b.price),
            price_desc: (a: any, b: any) => parseFloat(b.price) - parseFloat(a.price),
            newest: (a: any, b: any) => (new Date(b.created_at) as any) - (new Date(a.created_at) as any),
            discount: (a: any, b: any) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0),
            reviews: (a: any, b: any) => (b.num_reviews || 0) - (a.num_reviews || 0),
            sales: (a: any,b: any) => (b.sales || 0) - a.sales || 0,
        };

        if (sortFunctions[sort]) {
            items = [...items].sort(sortFunctions[sort]);
        }
        
        return items;
    }, [data, tier, sort, brandFilter]);

     const animatedCardId = useAnimation(
      (itemsToDisplay || []).map((d: any) => `deal-${d.id}`),
      siteAppearance?.animationSettings,
      page
    );

     const handleAiRecommend = () => {
        if (itemsToDisplay.length === 0) return;
        setIsAiRecommending(true);
        setRecommendedDealId(null);

        setTimeout(() => {
            const recommended = [...itemsToDisplay].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))[0];
            setRecommendedDealId(recommended.id);
            const cardElement = document.getElementById(`deal-${recommended.id}`);
            cardElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
             setIsAiRecommending(false);
        }, 2000);
    };

    if (!translations || !translations.en) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div></div>;
    }

    const sortOptions = [
        {key: 'rating', label: translations.en.sortRating}, {key: 'price_asc', label: translations.en.sortPriceAsc},
        {key: 'price_desc', label: translations.en.sortPriceDesc}, {key: 'newest', label: translations.en.sortNewest},
        {key: 'discount', label: translations.en.sortDiscount}, {key: 'reviews', label: translations.en.sortReviews},
        {key: 'sales', label: translations.en.sortSales},
    ];

    const formatPrice = (priceInput: any) => `$${priceInput}`;
    const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: 'smooth' });

    return (
      <section className="py-16">
        <RotatingBanner bannerConfig={bannerConfig} showMarketingOverlay={true} onButtonClick={scrollToCatalog}/>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-4">{title}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">{translations.en.findPlan}</p>
          <HorizontalFilter options={Object.keys(data).map(t => ({key: t, label: t}))} active={tier} setActive={setTier} />
          <div className="text-center mb-8">
              <button onClick={handleAiRecommend} disabled={isAiRecommending} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait mx-auto"><SparklesIcon />{isAiRecommending ? translations.en.aiLoading : translations.en.aiRecommendButton}</button>
          </div>
          <HorizontalFilter options={sortOptions} active={sort} setActive={setSort} />
          <div ref={catalogRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((plan: any) => {
                    const animationClass = `deal-${plan.id}` === animatedCardId ? siteAppearance?.animationSettings?.style : 'none';
                    return <ServiceCard key={`${plan.id}-${sort}`} {...plan} language="en" currency={{code: 'USD'}} formatPrice={formatPrice} onAiSummary={() => {}} isRecommended={plan.id === recommendedDealId}  animationStyle={animationClass}/>
                })
            ) : (<p className="col-span-full text-center text-gray-500 dark:text-gray-400 text-xl">{translations.en.noDeals}</p>)}
          </div>
          <AboutHostVoucherSection language="en" translations={translations}/>
           <GotACouponSection language="en" translations={translations} />
          <PopularBrands onBrandClick={setBrandFilter} activeBrand={brandFilter} language="en" translations={translations} />
          <FAQSection page={page} language="en" translations={translations} />
        </div>
      </section>
    );
};

export const CouponsPage = ({ page, allCoupons, allDeals, bannerConfig, translations, siteAppearance }: any) => {
    const [sort, setSort] = useState('newest');
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const { toast } = useToast();

    const itemsToDisplay = useMemo(() => {
        let items = allCoupons || [];
        if (brandFilter) items = items.filter((item: any) => item.provider === brandFilter);
        const sortFunctions: any = {
            newest: (a: any, b: any) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any),
            provider: (a: any, b: any) => (a.provider || '').localeCompare(b.provider || ''),
        };
        if (sortFunctions[sort]) items = [...items].sort(sortFunctions[sort]);
        return items;
    }, [allCoupons, sort, brandFilter]);
    
    const animatedCardId = useAnimation((itemsToDisplay || []).map((d: any) => `deal-${d.id}`), siteAppearance?.animationSettings, 'coupons');
    
    if (!translations || !translations.en) return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div></div>;
    
    const handleCopy = (code: string) => { navigator.clipboard.writeText(code); toast({ title: "Copied!", description: `Coupon code "${code}" copied to clipboard.` }); };
    const sortOptions = [{key: 'newest', label: translations.en.sortNewest}, {key: 'provider', label: "By Provider"}];

    return (
      <section className="py-16">
        <RotatingBanner bannerConfig={bannerConfig} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-4">{translations.en.promotionalVouchers}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">{translations.en.findPlan}</p>
          <HorizontalFilter options={sortOptions} active={sort} setActive={setSort} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((coupon: any, index: number) => {
                    const animationClass = `deal-${coupon.id}` === animatedCardId ? siteAppearance?.animationSettings?.style : 'none';
                    return <AnimatedVoucherCard key={`${coupon.id}-${index}`} {...coupon} language="en" onCopy={handleCopy} index={index} animationStyle={animationClass}/>
                })
            ) : (<p className="col-span-full text-center text-gray-500 dark:text-gray-400 text-xl">{translations.en.noCouponsFound}</p>)}
          </div>
          <AboutHostVoucherSection language="en" translations={translations}/>
           <GotACouponSection language="en" translations={translations} />
          <PopularBrands onBrandClick={setBrandFilter} activeBrand={brandFilter} language="en" translations={translations} />
          <FAQSection page={page} language="en" translations={translations} />
        </div>
      </section>
    );
};

const GamificationDisplay = () => {
    const [state, setState] = useState({ points: 0, badgeName: 'Newcomer' });
    const [hasMounted, setHasMounted] = useState(false);
    const [coinAnimations, setCoinAnimations] = useState<any[]>([]);
    const lastPointsRef = useRef(0);
    const triggerCoinAnimation = useCallback(() => { const newCoins = Array.from({ length: 5 }).map((_, i) => ({ id: Date.now() + i, style: { left: `${Math.random() * 80 + 10}%`, animationDelay: `${Math.random() * 0.5}s`, '--throw-x': `${(Math.random() - 0.5) * 400}px`, '--throw-y': `${(Math.random() - 0.8) * -300}px`, } as React.CSSProperties })); setCoinAnimations(prev => [...prev, ...newCoins]); setTimeout(() => { setCoinAnimations(prev => prev.slice(newCoins.length)); }, 2000); }, []);
    useEffect(() => { setHasMounted(true); const updateState = () => { const storedState = localStorage.getItem('gamificationState'); if (storedState) { const parsed = JSON.parse(storedState); const currentPoints = parsed.points || 0; if (currentPoints > lastPointsRef.current) triggerCoinAnimation(); lastPointsRef.current = currentPoints; setState({ points: currentPoints, badgeName: parsed.badge?.name || 'Newcomer', }); } }; updateState(); const intervalId = setInterval(updateState, 1000); window.addEventListener('storage', updateState); return () => { clearInterval(intervalId); window.removeEventListener('storage', updateState); }; }, [hasMounted, triggerCoinAnimation]);
    if (!hasMounted) return null;
    const badgeInfo = findBadgeInfo(state.badgeName); const BadgeIcon = getIconByTierName(badgeInfo?.icon) || Gem;
    return (<div className="mt-16 text-center"><h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Mining Progress</h3><div className="relative inline-flex items-center justify-center p-4 bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-700" style={{ perspective: '1000px' }}><div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 blur-xl"></div>{coinAnimations.map(coin => (<div key={coin.id} className="absolute text-3xl" style={coin.style}><div className="animate-[coin-throw_1s_ease-out_forwards]"><div className="animate-[coin-spin_0.5s_linear_infinite] text-yellow-400">💰</div></div></div>))}<div className="relative flex items-center gap-6" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-5deg) rotateX(2deg)' }}><div className={`p-4 rounded-full shadow-lg ${badgeInfo.bg || 'bg-gray-700'}`} style={{ transform: 'translateZ(30px)' }}><BadgeIcon size={64} className={`${badgeInfo.color || 'text-white'}`} /></div><div className="flex items-center"><DollarSign className="w-16 h-16 text-yellow-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px #facc15)', transform: 'translateZ(20px)' }}/><span className="text-7xl font-bold tracking-tighter bg-gradient-to-b from-yellow-300 to-amber-500 text-transparent bg-clip-text" style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.4)' }}>{Math.floor(state.points).toLocaleString('en-US')}</span></div></div></div></div>);
};

const ProofOfPurchaseSection = ({ onProofSubmit, gamificationState }: any) => {
    const [proofForm, setProofForm] = useState({
        fullName: '',
        whatsappNumber: '',
        provider: '',
        domain: '',
        purchaseDate: '',
        screenshot: null as File | null,
        screenshotPreview: '' as string
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    // Enhanced upload function with progress tracking
    const uploadFileToCPanel = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'proof-of-purchase');

        try {
            setUploadProgress(10);
            console.log('📤 Uploading proof of purchase screenshot...');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            setUploadProgress(70);
            const result = await response.json();
            console.log('📥 Upload response:', result);

            if (!response.ok || !result.success) {
                throw new Error(result.error || result.details || 'Upload failed');
            }

            setUploadProgress(100);
            console.log('✅ Upload successful:', result.url);
            return result.url;
        } catch (error: any) {
            console.error('❌ Upload Error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload an image file (PNG, JPG, GIF)",
                    variant: "destructive"
                });
                return;
            }

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please upload an image smaller than 10MB",
                    variant: "destructive"
                });
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setProofForm(prev => ({
                    ...prev,
                    screenshot: file,
                    screenshotPreview: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!proofForm.screenshot || !proofForm.fullName || !proofForm.whatsappNumber || !proofForm.provider || !proofForm.domain || !proofForm.purchaseDate) {
            toast({
                title: "All fields are required",
                description: "Please fill out all fields and upload a screenshot.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Upload screenshot first
            const screenshotUrl = await uploadFileToCPanel(proofForm.screenshot);

            // Prepare data for submission
            const submissionData = {
                ...proofForm,
                screenshotUrl,
                userEmail: gamificationState?.email || '',
                submittedAt: new Date().toISOString()
            };

            // Submit to backend
            await onProofSubmit(submissionData);

            toast({
                title: "Success!",
                description: "Your proof of purchase has been submitted and you've earned 50M points!"
            });

            // Reset form
            setProofForm({
                fullName: '',
                whatsappNumber: '',
                provider: '',
                domain: '',
                purchaseDate: '',
                screenshot: null,
                screenshotPreview: ''
            });

            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: any) {
            console.error('❌ Submission Error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit proof. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Submit Proof of Purchase & Claim Your Reward</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">“Submit valid proof of purchase to claim a massive 50,000,000 point reward. Any attempt to circumvent the system will result in the immediate forfeiture of your status and all points.”</p>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input type="text" required placeholder="Full Name" value={proofForm.fullName} onChange={e => setProofForm({...proofForm, fullName: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/>
                    <input type="tel" required placeholder="WhatsApp Number (e.g., 14155552671)" value={proofForm.whatsappNumber} onChange={e => setProofForm({...proofForm, whatsappNumber: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/>
                    <input type="text" required placeholder="Provider (e.g., Hostinger)" value={proofForm.provider} onChange={e => setProofForm({...proofForm, provider: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/>
                    <input type="text" required placeholder="Domain Name Purchased" value={proofForm.domain} onChange={e => setProofForm({...proofForm, domain: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/>
                    <input type="date" required value={proofForm.purchaseDate} onChange={e => setProofForm({...proofForm, purchaseDate: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Screenshot (Checkout/Payment)</label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {proofForm.screenshot && (
                            <div className="mt-4 space-y-3">
                                <p className="text-sm text-green-500">File selected: {(proofForm.screenshot as File).name}</p>

                                {/* Image Preview */}
                                {proofForm.screenshotPreview && (
                                    <div className="relative">
                                        <img
                                            src={proofForm.screenshotPreview}
                                            alt="Screenshot preview"
                                            className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setProofForm(prev => ({ ...prev, screenshot: null, screenshotPreview: '' }))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {isUploading && uploadProgress > 0 && (
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                        <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400">{isUploading ? "Uploading..." : "Submit Proof & Claim 50M Points"}</button>
                </form>
            </div>
        </div>
    );
};


export const RequestAndSubmitPage = ({ translations, allDeals, siteSettings, miningTasks, nftShowcase, hostvoucherTestimonials }: any) => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('tasks');
    
    // Form states
    const [requestForm, setRequestForm] = useState({ serviceType: '', providerName: '', userEmail: '', additionalNotes: '' });
    const [submitVoucherForm, setSubmitVoucherForm] = useState({ provider: '', voucherCode: '', description: '', link: '', userEmail: '' });
    const [gamificationState, setGamificationState] = useState({ email: '', ethAddress: '', termsAccepted: false });
    const [nftShowcaseForm, setNftShowcaseForm] = useState({ title: '', nftImageUrl: '', marketplaceLink: '', userEmail: '' });
    const [testimonialForm, setTestimonialForm] = useState({ name: '', email: '', rating: 5, testimonial: '' });
    
    const [isLocked, setIsLocked] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [userLevel, setUserLevel] = useState(1);
    const [currentBadge, setCurrentBadge] = useState('Newcomer');

    useEffect(() => { 
        setHasMounted(true); 
        const gamificationUser = localStorage.getItem('gamificationUser'); 
        if (gamificationUser) { 
            const parsed = JSON.parse(gamificationUser);
            setGamificationState(p => ({...p, ...parsed})); 
            setIsLocked(true); 
            // Prefill forms
            setSubmitVoucherForm(p => ({...p, userEmail: parsed.email})); 
            setRequestForm(p => ({...p, userEmail: parsed.email})); 
            setNftShowcaseForm(p => ({...p, userEmail: parsed.email})); 
            setTestimonialForm(p => ({...p, email: parsed.email})); 
        }
        const globalState = localStorage.getItem('gamificationState');
        if (globalState) {
            const parsed = JSON.parse(globalState);
            const points = parsed.points || 0;
            setUserPoints(points);
            setUserBadges(parsed.badges || []);

            // Calculate level and badge based on points
            const level = Math.floor(points / 1000000) + 1; // 1 million points per level
            setUserLevel(level);

            // Determine current badge based on points
            if (points >= 100000000) setCurrentBadge('Legendary');
            else if (points >= 50000000) setCurrentBadge('Diamond');
            else if (points >= 25000000) setCurrentBadge('Platinum');
            else if (points >= 10000000) setCurrentBadge('Gold');
            else if (points >= 5000000) setCurrentBadge('Silver');
            else if (points >= 1000000) setCurrentBadge('Bronze');
            else setCurrentBadge('Newcomer');
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const globalState = localStorage.getItem('gamificationState');
            if (globalState) {
                const parsed = JSON.parse(globalState);
                setUserPoints(parsed.points || 0);
                setUserBadges(parsed.badges || []);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    
    const handleAction = async (action: () => Promise<any>, successMessage: string, formReset?: () => void) => {
        try { await action(); toast({ title: "Success!", description: successMessage }); formReset?.(); } 
        catch (e: any) { toast({ title: "Error", description: e.message || "An error occurred.", variant: "destructive" });}
    };

    const handleGamificationSubmit = useCallback(async (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem('gamificationUser', JSON.stringify(gamificationState)); const globalState = { isNftActivated: true, points: 0, badges: [], lastUpdated: Date.now() }; localStorage.setItem('gamificationState', JSON.stringify(globalState)); setIsLocked(true); window.dispatchEvent(new Event('storage')); toast({ title: translations.en.miningActivated, description: translations.en.miningActivatedDescription }); }, [gamificationState, toast, translations]);
    const handleSumbitVoucher = async (e: React.FormEvent) => { e.preventDefault(); handleAction(() => apiClient.submitVoucher(submitVoucherForm), "Voucher submitted for review.", () => setSubmitVoucherForm(p => ({...p, provider: '', voucherCode: '', description: '', link: '' }))); };
    const handleSumbitRequest = async (e: React.FormEvent) => { e.preventDefault(); handleAction(() => apiClient.submitDealRequest(requestForm), "Deal request submitted.", () => setRequestForm(p => ({...p, serviceType: '', providerName: '', additionalNotes: '' }))); };
    const handleSumbitNftShowcase = async (e: React.FormEvent) => { e.preventDefault(); handleAction(() => apiClient.submitNftShowcase(nftShowcaseForm), "NFT submitted to showcase.", () => setNftShowcaseForm(p => ({...p, title: '', nftImageUrl: '', marketplaceLink: '' }))); };
    const handleSumbitTestimonial = async (e: React.FormEvent) => { e.preventDefault(); handleAction(() => apiClient.submitSiteTestimonial(testimonialForm), "Thank you for your testimonial!", () => setTestimonialForm(p => ({...p, name: '', rating: 5, testimonial: '' }))); };

    const uploadFileToCPanel = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://localhost:8800/api/upload', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Upload failed.');
        return result.url;
    };

    const handleProofSubmit = async (proofData: any) => {
        const screenshotUrl = await uploadFileToCPanel(proofData.screenshot);
        await apiClient.submitProofOfPurchase({ ...proofData, screenshotUrl });
        const currentState = JSON.parse(localStorage.getItem('gamificationState') || '{}');
        const newState = { ...currentState, points: (currentState.points || 0) + 50000000 };
        localStorage.setItem('gamificationState', JSON.stringify(newState));
        window.dispatchEvent(new Event('storage'));
    };
    
    const handleBuyBadge = (badge: any) => {
        const price = badge.price || 0;
        if (userPoints < price) {
            toast({ title: "Not enough points!", description: `You need ${price.toLocaleString()} points to buy the ${badge.name} badge.`, variant: "destructive" });
            return;
        }
        if (userBadges.includes(badge.name)) {
            toast({ title: "Already Owned", description: `You already have the ${badge.name} badge.`, variant: "default" });
            return;
        }
        
        const newPoints = userPoints - price;
        const newBadges = [...userBadges, badge.name];
        const currentState = JSON.parse(localStorage.getItem('gamificationState') || '{}');
        const newState = { ...currentState, points: newPoints, badges: newBadges, lastUpdated: Date.now() };
        localStorage.setItem('gamificationState', JSON.stringify(newState));
        window.dispatchEvent(new Event('storage'));
        toast({ title: "Badge Purchased!", description: `You are now the proud owner of the ${badge.name} badge!` });
    };

    if (!translations || !translations.en || !hasMounted) return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div></div>;
    
    const SpecialBadgeCard = ({ badge }: { badge: any }) => {
        const Icon = getIconByTierName(badge.icon) || HelpCircle;
        const handleClick = () => { if (badge.id === 'loyal_reviewer') setActiveTab('testimonial'); else if (badge.id === 'screenshot_contributor') document.getElementById('proof-submission-form')?.scrollIntoView({ behavior: 'smooth' }); else if (badge.link) window.open(badge.link, '_blank'); };
        return (<div className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"><div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center"><Icon size={24} /></div><div className="flex-grow"><h4 className="font-bold text-gray-800 dark:text-white">{badge.name}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p></div><div className="text-right flex-shrink-0"><p className="font-bold text-lg text-yellow-500">+{badge.points ? badge.points.toLocaleString('en-US') : '0'}</p><button onClick={handleClick} className="mt-1 text-xs bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600">Submit</button></div></div>);
    };

    const allTasks = [...(miningTasks || []), ...allBadgeTiers.special];

    const BadgeStoreCard = ({ badge }: { badge: any }) => {
        const Icon = getIconByTierName(badge.Icon) || HelpCircle;
        const isOwned = userBadges.includes(badge.name);
        const canAfford = userPoints >= (badge.price || 0);
        const isLocked = !canAfford && !isOwned;
    
        const ownedGradientMap:any = {
            Medal: 'from-amber-400 to-yellow-600',
            Trophy: 'from-yellow-400 to-orange-500',
            Shield: 'from-slate-400 to-gray-600',
            Crown: 'from-yellow-300 to-amber-500',
            Rocket: 'from-indigo-400 to-purple-600',
            Gem: 'from-rose-400 to-red-600',
            default: 'from-gray-600 to-gray-800'
        };
    
        const ownedShineEffect = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/20 before:to-transparent`;
    
        return (
            <div className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                isOwned ? `border-yellow-400 bg-gradient-to-br ${ownedGradientMap[badge.Icon] || ownedGradientMap.default}` :
                isLocked ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50' :
                badge.bg
            }`}>
                {isLocked && !isOwned && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                        <Lock className="w-16 h-16 text-white/50" style={{transform: 'scale(3)'}} />
                    </div>
                )}
                
                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${isOwned ? '' : badge.bg}`}>
                    <Icon size={32} className={`${isOwned ? 'text-white' : badge.color}`} />
                </div>
                
                <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-2">{badge.name}</h4>
                <p className={`font-bold text-lg ${isOwned ? 'text-yellow-300' : badge.color}`}>{badge.price.toLocaleString('en-US')} pts</p>
                
                <button 
                    onClick={() => handleBuyBadge(badge)} 
                    disabled={isLocked || isOwned}
                    className={`w-full mt-2 text-xs font-semibold py-2 px-3 rounded-md transition-all ${
                        isOwned ? 'bg-yellow-500 text-black cursor-default' : 
                        isLocked ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed' : 
                        'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {isOwned ? 'OWNED' : isLocked ? 'Locked' : 'Buy Badge'}
                </button>
                 {isOwned && (
                    <>
                        <div className={`absolute -inset-0 ${ownedShineEffect}`}></div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full"><Check size={14}/> Owned</div>
                    </>
                 )}
            </div>
        );
    };

    return (
        <section className="py-16"><div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12"><h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{translations.en.requestTitle}</h2><p className="text-lg text-gray-600 dark:text-gray-400">{translations.en.requestDealDescription}</p></div>
            <div className="max-w-xl mx-auto mb-12 p-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl text-white"><h3 className="text-2xl font-bold mb-3">{translations.en.nftActivationTitle}</h3><p className="opacity-90 mb-6">{isLocked ? "Your details are saved." : translations.en.nftActivationDescription}</p><form onSubmit={handleGamificationSubmit} className="space-y-4"><input type="email" required placeholder={translations.en.formEmailPlaceholder} value={gamificationState.email} onChange={e => setGamificationState({...gamificationState, email: e.target.value})} className="w-full p-3 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-yellow-400 transition bg-white/20 placeholder-white/70 disabled:opacity-70" disabled={isLocked}/>{siteSettings?.requireEthAddress && (<input type="text" required={siteSettings?.requireEthAddress} placeholder={translations.en.ethAddress} value={gamificationState.ethAddress} onChange={e => setGamificationState({...gamificationState, ethAddress: e.target.value})} className="w-full p-3 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-yellow-400 transition bg-white/20 placeholder-white/70 disabled:opacity-70" disabled={isLocked}/>)} {!isLocked && (<><div className="flex items-center space-x-2 pt-2"><Checkbox id="terms-nft" checked={gamificationState.termsAccepted} onCheckedChange={(checked) => setGamificationState({ ...gamificationState, termsAccepted: !!checked })} /><label htmlFor="terms-nft" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90">Terms and conditions apply</label></div><button type="submit" disabled={!gamificationState.termsAccepted} className="w-full bg-yellow-400 text-purple-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-transform transform hover:scale-105 disabled:opacity-50">{translations.en.activateMining}</button></>)}</form></div>
            
            {isLocked && (
                <>
                    {/* Avatar System Display */}
                    <div className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-indigo-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Digital Companion</h3>
                            <p className="text-gray-600 dark:text-gray-400">Your avatar evolves as you progress through the gamification system</p>
                        </div>
                        <div className="flex justify-center">
                            <AvatarSystem
                                userBadge={currentBadge}
                                points={userPoints}
                                level={userLevel}
                                showEvolution={true}
                                size="large"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Current Badge:</span>
                                    <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">{currentBadge}</span>
                                </div>
                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                                    <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">{userLevel}</span>
                                </div>
                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Points:</span>
                                    <span className="ml-2 font-bold text-green-600 dark:text-green-400">{userPoints.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <GamificationDisplay />
                    <div id="proof-submission-section" className="pt-16">
                       <ProofOfPurchaseSection onProofSubmit={handleProofSubmit} gamificationState={gamificationState} />
                    </div>
                </>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-12">
                <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                    {['tasks', 'badge_store', 'testimonial', 'nft_showcase', 'submit', 'request'].map(tabId => {
                        const labels: any = { tasks: 'Mining Activities', badge_store: 'Badge Store', testimonial: 'Submit Testimonial', nft_showcase: 'NFT Showcase', submit: 'Submit Coupon', request: 'Request Deal'};
                        return (<button key={tabId} onClick={() => setActiveTab(tabId)} className={`flex-1 p-4 font-semibold whitespace-nowrap ${activeTab === tabId ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>{labels[tabId]}</button>);
                    })}
                </div>
                <div className="p-8">
                    {activeTab === 'tasks' && (<div><h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{translations.en.miningActivities}</h3><div className="mb-6"><h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Unlock Special Badges</h4><p className="text-sm text-gray-500 dark:text-gray-400">Certain actions grant you exclusive, high-value badges!</p></div><div className="space-y-4">{(allTasks || []).map((task: any, index: number) => <SpecialBadgeCard key={index} badge={task} />)}</div></div>)}
                    {activeTab === 'badge_store' && (
                        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Badge Store</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Use your points to purchase exclusive badges and accelerate your mining rate!</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Object.values(allBadgeTiers).flat().filter((b:any) => b.price).map((badge: any, index: number) => (
                                    <BadgeStoreCard key={index} badge={badge} />
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'testimonial' && (<div><h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{translations.en.submitTestimonialTitle}</h3><p className="text-gray-600 dark:text-gray-400 mb-6">{translations.en.submitTestimonialDescription}</p><form onSubmit={handleSumbitTestimonial} className="space-y-4"><input type="text" required placeholder="Your Name" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/><input type="email" required placeholder="Your Email" value={testimonialForm.email} onChange={e => setTestimonialForm({...testimonialForm, email: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" disabled={isLocked}/><div className="flex items-center space-x-2"><Checkbox id="terms-testimonial" /><label htmlFor="terms-testimonial">I agree to the terms and conditions</label></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating (1-5)</label><StarRating rating={testimonialForm.rating} onRatingChange={(r: any) => setTestimonialForm({...testimonialForm, rating: r})} justify='start' /></div><textarea placeholder="Your Testimonial about HostVoucher" value={testimonialForm.testimonial} onChange={e => setTestimonialForm({...testimonialForm, testimonial: e.target.value})} rows={5} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"></textarea><button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">{translations.en.submitTestimonialButton}</button></form></div>)}
                    {activeTab === 'nft_showcase' && (<div><h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{translations.en.nftShowcaseTitle}</h3><p className="text-gray-600 dark:text-gray-400 mb-6">{translations.en.nftShowcaseDescription}</p><form onSubmit={handleSumbitNftShowcase} className="space-y-4"><input type="text" required placeholder="Title for your NFT" value={nftShowcaseForm.title} onChange={e => setNftShowcaseForm({...nftShowcaseForm, title: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/><input type="url" required placeholder="Your NFT Image URL (e.g., from IPFS)" value={nftShowcaseForm.nftImageUrl} onChange={e => setNftShowcaseForm({...nftShowcaseForm, nftImageUrl: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/><input type="url" required placeholder="Marketplace Link (e.g., OpenSea)" value={nftShowcaseForm.marketplaceLink} onChange={e => setNftShowcaseForm({...nftShowcaseForm, marketplaceLink: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"/><button type="submit" className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700">{translations.en.submitNftButton}</button></form></div>)}
                    {activeTab === 'submit' && (<div><h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{translations.en.submitCouponTitle}</h3><p className="text-gray-600 dark:text-gray-400 mb-6">{translations.en.submitCouponDescription}</p><form onSubmit={handleSumbitVoucher} className="space-y-4"><input type="text" required placeholder={translations.en.requestProviderName} value={submitVoucherForm.provider} onChange={e => setSubmitVoucherForm({...submitVoucherForm, provider: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" /><input type="text" required placeholder={translations.en.formCouponCode} value={submitVoucherForm.voucherCode} onChange={e => setSubmitVoucherForm({...submitVoucherForm, voucherCode: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" /><input type="url" placeholder="Voucher Link (Optional)" value={submitVoucherForm.link} onChange={e => setSubmitVoucherForm({...submitVoucherForm, link: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" /><textarea placeholder={translations.en.formDescriptionPlaceholder} value={submitVoucherForm.description} onChange={e => setSubmitVoucherForm({...submitVoucherForm, description: e.target.value})} rows={3} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"></textarea><button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">{translations.en.submitCouponButton}</button></form></div>)}
                    {activeTab === 'request' && (<div><h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{translations.en.requestTitle}</h3><p className="text-gray-600 dark:text-gray-400 mb-6">{translations.en.requestDealDescription}</p><form onSubmit={handleSumbitRequest} className="space-y-4"><select required value={requestForm.serviceType} onChange={e => setRequestForm({...requestForm, serviceType: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"><option value="">{translations.en.requestSelectService}</option>{['Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'VPS', 'VPN', 'Domain', 'Voucher', 'Digital Product', 'Service', 'SaaS', 'AI Tool', 'Uncategorized'].map((type: string) => <option key={type} value={type}>{type}</option>)}</select><input type="text" required placeholder={translations.en.requestProviderName} value={requestForm.providerName} onChange={e => setRequestForm({...requestForm, providerName: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" /><input type="email" required placeholder={translations.en.requestYourEmail} value={requestForm.userEmail} onChange={e => setRequestForm({...requestForm, userEmail: e.target.value})} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" /><textarea placeholder={translations.en.requestDealPlaceholder} value={requestForm.additionalNotes} onChange={e => setRequestForm({...requestForm, additionalNotes: e.target.value})} rows={4} className="w-full p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"></textarea><button type="submit" className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700">{translations.en.requestSubmitButton}</button></form></div>)}
                </div>
            </div>

            <div className="py-12">
                 <FAQSection page="home" language="en" translations={translations}/>
            </div>

        </div>
        </section>
    );
}

const GotACouponSection = ({ language, translations }: any) => {
    const router = useRouter();
    return (
        <div className="mt-12 mb-8 py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {translations[language].gotCouponTitle}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {translations[language].gotCouponDescription}
            </p>
            <button onClick={() => router.push('/request')} className="mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-8 rounded-full font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {translations[language].submitCouponNow}
            </button>
        </div>
    );
}
