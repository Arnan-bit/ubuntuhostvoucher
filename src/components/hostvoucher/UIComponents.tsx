











'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ChevronDownIcon, Clock } from './IconComponents';
import { BotIcon, SendIcon } from './IconComponents';
import { useRouter } from 'next/navigation';
import { getProductImage, getTestimonialImage, getImageProps } from '@/lib/image-utils';
import { Share2, Sparkles, Link as LinkIcon, Twitter, Facebook, Instagram, MessageCircle, Youtube, Linkedin, Twitch, Github, Shell, Dribbble, Star as LucideStar, Users, ThumbsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

const appId = 'HostVoucher-ai-tracking-stable';

const hardcodedGamificationSettings = {
    points: {
        catalogClick: 1000,
        socialShare: 5000,
        socialVisit: 1500,
    },
    cooldownHours: {
        catalogClick: 1,
        socialShare: 24,
        socialVisit: 24,
    }
};

export const usePointMining = (isNftActivated: boolean) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const calculateOfflineGains = () => {
            const gamificationStateStr = localStorage.getItem('gamificationState');
            if (gamificationStateStr) {
                const currentState = JSON.parse(gamificationStateStr);
                if (currentState.isNftActivated) {
                    const lastUpdated = currentState.lastUpdated || Date.now();
                    const now = Date.now();
                    const elapsedSeconds = Math.floor((now - lastUpdated) / 1000);
                    const pointsPerSecond = 1; 
                    const earnedPoints = elapsedSeconds * pointsPerSecond;

                    if (earnedPoints > 0) {
                        const newPoints = (currentState.points || 0) + earnedPoints;
                        const newState = { ...currentState, points: newPoints, lastUpdated: now };
                        localStorage.setItem('gamificationState', JSON.stringify(newState));
                        window.dispatchEvent(new Event('storage'));
                    }
                }
            }
        };

        calculateOfflineGains();

        const miningInterval = setInterval(() => {
            const gamificationStateStr = localStorage.getItem('gamificationState');
            if (gamificationStateStr) {
                const currentState = JSON.parse(gamificationStateStr);
                if (currentState.isNftActivated) {
                    const newPoints = (currentState.points || 0) + 1; // Mine 1 point per second
                    const newState = { ...currentState, points: newPoints, lastUpdated: Date.now() };
                    localStorage.setItem('gamificationState', JSON.stringify(newState));
                    window.dispatchEvent(new Event('storage'));
                }
            }
        }, 1000); // Mines 1 point per second

        return () => clearInterval(miningInterval);
    }, [isNftActivated]);
};


export const useGamification = () => {
    const { toast } = useToast();

    const awardPoints = useCallback((
        action: 'click' | 'share' | 'visit',
        itemId: string
    ) => {
        const gamificationStateStr = localStorage.getItem('gamificationState');
        if (!gamificationStateStr || !JSON.parse(gamificationStateStr).isNftActivated) {
            if (action !== 'click') {
                 toast({
                    title: "Mining Not Active",
                    description: "Please activate NFT mining first to earn points.",
                    variant: "destructive",
                });
            }
            return;
        }

        const actionConfig = {
            click: { points: hardcodedGamificationSettings.points.catalogClick, cooldown: hardcodedGamificationSettings.cooldownHours.catalogClick, storageKey: 'clickTimestamps' },
            share: { points: hardcodedGamificationSettings.points.socialShare, cooldown: hardcodedGamificationSettings.cooldownHours.socialShare, storageKey: 'socialShareTimestamps' },
            visit: { points: hardcodedGamificationSettings.points.socialVisit, cooldown: hardcodedGamificationSettings.cooldownHours.socialVisit, storageKey: 'socialVisitTimestamps' }
        };

        const config = actionConfig[action];
        const pointsToAward = config.points || 0;
        const cooldownHours = config.cooldown;
        
        if (pointsToAward === 0) return;

        const now = Date.now();
        const timestamps = JSON.parse(localStorage.getItem(config.storageKey) || '{}');
        const lastAction = timestamps[itemId] || 0;
        const cooldownMs = (cooldownHours || 0) * 60 * 60 * 1000;
        
        if (cooldownHours === 0 || (now - lastAction > cooldownMs)) {
            timestamps[itemId] = now;
            localStorage.setItem(config.storageKey, JSON.stringify(timestamps));

            const currentState = JSON.parse(gamificationStateStr);
            const newState = { ...currentState, points: (currentState.points || 0) + pointsToAward };
            localStorage.setItem('gamificationState', JSON.stringify(newState));
            
            toast({
                title: "Points Awarded!",
                description: `You earned ${pointsToAward.toLocaleString()} points!`,
            });
            window.dispatchEvent(new Event('storage'));
        } else if (action !== 'click') {
             toast({
                title: "Action on Cooldown",
                description: `You can perform this action for ${itemId} again later.`,
            });
        }
    }, [toast]);

    return { awardPoints };
};

export const useAnimation = (dealIds: string[], animationSettings: any, currentPage: string) => {
    const [animatedCardId, setAnimatedCardId] = useState<string | null>(null);

    useEffect(() => {
        if (!animationSettings || !animationSettings.enabledPages?.includes(currentPage) || !dealIds || dealIds.length === 0) {
            setAnimatedCardId(null);
            return;
        }

        const intervalTime = (animationSettings.interval || 5) * 1000;

        const animateRandomCard = () => {
            const randomIndex = Math.floor(Math.random() * dealIds.length);
            setAnimatedCardId(dealIds[randomIndex]);
        };

        animateRandomCard(); // Animate one card on initial load

        const animationInterval = setInterval(animateRandomCard, intervalTime);

        return () => clearInterval(animationInterval);
    }, [dealIds, animationSettings, currentPage]);

    return animatedCardId;
};


const logClickEvent = async (product: any) => {
    if (!db) return;
    try {
        // In a real application, you'd get the IP from the backend
        // and enrich it with geo-location data there for security and accuracy.
        const res = await fetch('https://ipapi.co/json/');
        const geoData = await res.json();
        
        await addDoc(collection(db, `artifacts/${appId}/public/data/click_events`), {
            productId: product.id,
            productName: product.name || product.title,
            productType: product.type || 'N/A',
            timestamp: serverTimestamp(),
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            ipAddress: geoData.ip || '0.0.0.0',
            country: geoData.country_name || 'Unknown',
            city: geoData.city || 'Unknown',
        });
    } catch (error) {
        console.error("Error logging click event:", error);
    }
};

const handleProductClick = (product: any, awardPointsCallback: Function) => {
    logClickEvent(product);
    awardPointsCallback('click', product.id);
};

export const Star = ({ type }: { type: 'full' | 'half' | 'empty' }) => {
    const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z";

    if (type === 'half') {
        return (
            <div className="relative w-5 h-5 flex items-center justify-center">
                <svg className={`absolute top-0 left-0 w-5 h-5 text-yellow-400`} fill="currentColor" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                    <path d={starPath} />
                </svg>
                <svg className={`absolute top-0 left-0 w-5 h-5 text-gray-300 dark:text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d={starPath} />
                </svg>
            </div>
        );
    }

    const fillColor = type === 'full' ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600';
    return (
        <svg className={`w-5 h-5 ${fillColor}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d={starPath} />
        </svg>
    );
};

export const StarRating = ({ rating, numReviews, language, justify = 'center', onRatingChange, compact = false, style = 'default' }: any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        let type: 'full' | 'half' | 'empty' = 'empty';
        if (i < fullStars) {
            type = 'full';
        } else if (i === fullStars && hasHalfStar) {
            type = 'half';
        }
        stars.push(
            <button key={i} onClick={() => onRatingChange && onRatingChange(i + 1)} aria-label={`Rate ${i + 1} stars`}>
                <Star type={type} />
            </button>
        );
    }

    const reviewText = language === 'id' ? 'Ulasan' : 'Reviews';

    // Style seperti contoh gambar ExpressVPN
    if (style === 'modern') {
        return (
            <div className={`flex items-center gap-2 justify-${justify} mb-2`}>
                <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
                    {stars}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {rating.toFixed(1)}/5 ({numReviews?.toLocaleString() || 0} {reviewText})
                </span>
            </div>
        );
    }

    if (compact) {
        return (
            <div className={`flex items-center gap-1 justify-${justify}`}>
                <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
                    {stars}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {rating.toFixed(1)}/5 ({numReviews?.toLocaleString() || 0} {reviewText})
                </span>
            </div>
        );
    }

    return (
        <div className={`flex items-center mb-2 justify-${justify}`}>
            <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
                {stars}
            </div>
            {numReviews !== undefined && (
                <p className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {rating.toFixed(1)}/5 ({numReviews.toLocaleString()} {reviewText})
                </p>
            )}
        </div>
    );
};


export const ScrollerCard = ({ id, provider, name, price, link, target_url, rating, num_reviews, numReviews, image, catalog_image, provider_logo, brand_logo, language, currency, formatPrice }: any) => {
    const finalLink = target_url || link;
    const finalRating = rating;
    const finalNumReviews = num_reviews || numReviews;
    const finalImage = getProductImage({ catalog_image, image, provider_logo, brand_logo, provider, name });

    return (
        <a href={finalLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <div className="relative p-4 rounded-xl shadow-lg flex flex-col justify-between text-center transition-transform duration-300 h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transform hover:scale-105">
                <Image
                    {...getImageProps(finalImage, name)}
                    width={400}
                    height={300}
                    className="w-full h-32 object-cover rounded-md mb-4"
                    data-ai-hint="deal offer"
                />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{provider}</p>
                <h3 className="text-md font-bold mb-2 text-gray-900 dark:text-white flex-grow">{name}</h3>
                {(finalRating !== undefined && finalRating !== null && finalRating > 0 && finalNumReviews !== undefined && finalNumReviews !== null) && (
                    <StarRating rating={finalRating} numReviews={finalNumReviews} language={language} compact={true} />
                )}
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{formatPrice(price, currency)}</p>
            </div>
        </a>
    );
};

export const ServiceCard = ({ id, catalog_number, catalogNumber, provider, provider_logo, providerLogo, brand_logo, name, price, original_price, originalPrice, discount, features, link, target_url, image, catalog_image, rating, num_reviews, numReviews, language, currency, formatPrice, onAiSummary, isRecommended, button_color, buttonColor = 'blue', settings, animationStyle }: any) => {
    // Normalize props for backward compatibility
    const finalCatalogNumber = catalog_number || catalogNumber || id;
    const finalProviderLogo = provider_logo || providerLogo;
    const finalBrandLogo = brand_logo;
    const finalPrice = price;
    const finalOriginalPrice = original_price || originalPrice;
    const finalRating = rating;
    const finalNumReviews = num_reviews || numReviews;
    const finalLink = target_url || link;
    const finalButtonColor = button_color || buttonColor;
    const finalImage = catalog_image || image;

    const plan = { id, provider, name, price: finalPrice, originalPrice: finalOriginalPrice, discount, features, link: finalLink, rating: finalRating, numReviews: finalNumReviews, type: 'Service' };
    const recommendedClass = isRecommended ? 'ring-4 ring-offset-2 ring-offset-background ring-purple-500 shadow-2xl' : 'shadow-lg';
    const { awardPoints } = useGamification();

    const animationClasses: any = {
        pulse: 'animate-pulse',
        shake: 'animate-shake',
        tada: 'animate-tada',
        jello: 'animate-jello',
        wobble: 'animate-wobble',
        bounce: 'animate-bounce',
        fall: 'animate-fall',
        swing: 'animate-swing',
        none: '',
    };

    const buttonColorClasses: any = {
        blue: 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
        orange: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
        green: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
        red: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
        purple: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
    }

    const cardLightColorClasses: any = {
        blue: 'shadow-blue-500/10',
        orange: 'shadow-orange-500/10',
        green: 'shadow-green-500/10',
        red: 'shadow-red-500/10',
        purple: 'shadow-purple-500/10'
    };
    
    const handleClick = () => {
        handleProductClick(plan, awardPoints);
    };


    return (
      <div id={`deal-${id}`} className={`relative p-6 rounded-xl flex flex-col justify-between text-center transform hover:scale-105 transition-all duration-300 h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${recommendedClass} ${cardLightColorClasses[buttonColor]} ${animationClasses[animationStyle]}`}>
         <div className="absolute top-4 right-4 z-10">
            <CircularShareButton item={plan} settings={settings}/>
          </div>
        <div className="flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
              <div className="bg-orange-600 text-white text-xs font-bold w-12 h-8 flex items-center justify-center rounded-full shadow-md z-10">
                {finalCatalogNumber}
              </div>
          </div>

          {/* Product Image */}
          {finalImage && (
            <div className="mb-4">
              <Image
                {...getImageProps(finalImage, name)}
                width={200}
                height={120}
                className="w-full h-24 object-cover rounded-lg mx-auto"
              />
            </div>
          )}

          <div className="mt-2">
            {/* Brand Logo or Provider Logo */}
            {finalBrandLogo ? (
              <Image src={finalBrandLogo} alt={provider} width={120} height={40} className="h-10 mx-auto object-contain mb-2" />
            ) : finalProviderLogo ? (
              <Image src={finalProviderLogo} alt={provider} width={120} height={40} className="h-10 mx-auto object-contain mb-2" />
            ) : (
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{provider}</p>
            )}
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{name}</h3>

            {/* Enhanced Rating Display */}
            {(finalRating !== undefined && finalRating !== null && finalRating > 0) && (
                <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${
                                    star <= finalRating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 dark:text-gray-600'
                                }`}
                            />
                        ))}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">
                            {finalRating.toFixed(1)}
                        </span>
                    </div>
                    {finalNumReviews && (
                        <div className="flex items-center ml-3 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{finalNumReviews.toLocaleString()} reviews</span>
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced Price Display */}
            <div className="mb-4">
                <PriceDisplay
                    price={finalPrice}
                    originalPrice={finalOriginalPrice}
                    currency="USD"
                    size="lg"
                    variant="detailed"
                    className="justify-center"
                />
            </div>

            {discount && (
              <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-4 inline-block">{discount}</span>
            )}
          </div>
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
          {features && (
            <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 text-left w-full">
              {Array.isArray(features) && features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto">
              <a href={finalLink} onClick={handleClick} target="_blank" rel="noopener noreferrer" className={`block w-full bg-gradient-to-r text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${buttonColorClasses[finalButtonColor]}`}>
                {language === 'id' ? 'Amankan Penawaran Ini' : 'Secure This Deal'}
              </a>
          </div>
        </div>
      </div>
    );
};

export const AnimatedVoucherCard = ({ id, title, discount, description, code, url, index, onCopy, color = 'blue', language = 'en', settings, animationStyle }: any) => {
    const { awardPoints } = useGamification();
    const isClickedState = useState(false);
    const isTornState = useState(false);
    
    // Unpack state
    const isClicked = isClickedState[0];
    const setIsClicked = isClickedState[1];
    const isTorn = isTornState[0];
    const setIsTorn = isTornState[1];

    
    const animationClasses: any = {
        pulse: 'animate-pulse',
        shake: 'animate-shake',
        tada: 'animate-tada',
        jello: 'animate-jello',
        wobble: 'animate-wobble',
        bounce: 'animate-bounce',
        fall: 'animate-fall',
        swing: 'animate-swing',
        none: '',
    };

    const handleInitialClick = () => {
        if (isClicked) return;
        navigator.clipboard.writeText(code);
        onCopy(code);
        setIsClicked(true);
    };

    const handleTearVoucher = () => {
        if (isTorn) return;
        handleProductClick({ id, name: title, type: 'Voucher' }, awardPoints);
        setIsTorn(true);
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 700);
    };

    const colorClasses: any = {
        blue: { text: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', shadow: 'shadow-blue-500/10' },
        purple: { text: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-600', hover: 'hover:bg-purple-700', shadow: 'shadow-purple-500/10' },
        red: { text: 'text-red-500 dark:text-red-400', bg: 'bg-red-600', hover: 'hover:bg-red-700', shadow: 'shadow-red-500/10' },
        green: { text: 'text-green-500 dark:text-green-400', bg: 'bg-green-600', hover: 'hover:bg-green-700', shadow: 'shadow-green-500/10' },
        indigo: { text: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', shadow: 'shadow-indigo-500/10' },
        yellow: { text: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-600', hover: 'hover:bg-yellow-700', shadow: 'shadow-yellow-500/10' },
        orange: { text: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-600', hover: 'hover:bg-orange-700', shadow: 'shadow-orange-500/10' },
    };
    const theme = colorClasses[color] || colorClasses.blue;

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } },
        hover: { y: -5, scale: 1.05, boxShadow: `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`, transition: { duration: 0.3 } }
    };
    const tearOffVariants = {
        initial: { rotate: 0, y: 0, opacity: 1 },
        torn: { rotate: 5, y: 250, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }
    };

    const PerforatedLine = () => (
        <div className="h-[2px] w-full bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-[length:10px_2px] bg-repeat-x text-gray-300 dark:text-gray-600"></div>
    );

    return (
        <motion.div
            id={`deal-${id}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={!isClicked ? "hover" : ""}
            className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${theme.shadow} ${animationClasses[animationStyle]}`}
        >
            <div className="p-6 text-center flex-grow flex flex-col justify-center">
                <h3 className={`font-bold ${theme.text}`}>{title}</h3>
                <p className="text-5xl font-extrabold my-2 text-gray-800 dark:text-white">{discount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
            </div>
            
             <div className="relative text-center h-8 mb-4">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <CircularShareButton item={{ id, title, code, description, url }} position="voucher" settings={settings} />
                </div>
            </div>

            <motion.div
                variants={tearOffVariants}
                animate={isTorn ? "torn" : "initial"}
            >
                <PerforatedLine />
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative h-12 flex items-center justify-center">
                        {!isClicked ? (
                            <motion.button
                                onClick={handleInitialClick}
                                className={`w-full h-full font-bold text-white rounded-md ${theme.bg} ${theme.hover} transition-colors`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Coupon Code
                            </motion.button>
                        ) : (
                             <div className="flex items-center justify-between w-full bg-gray-200 dark:bg-gray-900/50 rounded-md p-2">
                                <span className="font-mono tracking-widest text-lg text-gray-800 dark:text-white">{code}</span>
                                <button
                                    onClick={handleTearVoucher}
                                    className={`px-4 py-2 text-sm font-bold text-white rounded ${theme.bg} ${theme.hover} transition-colors`}
                                >
                                    Use Coupon
                                </button>
                             </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const UniversalSearchResultCard = ({ item, language, currency, formatPrice, onCopy, animationStyle }: any) => {
    const { id, name, title, provider, seoDescription, price, originalPrice, discount, link, targetUrl, image, image_url, providerLogo, provider_logo, rating, numReviews, type, code, catalogNumber } = item;
    const displayImage = getProductImage(item);
    const displayName = name || title;
    const displayLink = targetUrl || link;

    if (type === 'coupon' || type === 'Voucher') {
        return (
            <div className="w-full">
                <AnimatedVoucherCard {...item} onCopy={onCopy} language={language} animationStyle={animationStyle} />
            </div>
        );
    }
    
    return (
        <a href={displayLink} target="_blank" rel="noopener noreferrer" className="w-full text-left relative flex items-start p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-xl bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md z-10 leading-none p-1">
                {catalogNumber || 'N/A'}
            </div>
            <Image
                {...getImageProps(displayImage, displayName)}
                width={100}
                height={100}
                className="w-20 h-20 md:w-24 md:h-24 rounded-md mr-4 object-contain bg-white p-1"
            />
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{displayName}</h3>
                {seoDescription && <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{seoDescription}</p>}
                {(rating !== undefined && rating !== null && rating > 0 && numReviews !== undefined && numReviews !== null) && (
                    <StarRating rating={rating} numReviews={numReviews} justify="start" language={language} />
                )}
            </div>
            <div className="text-right ml-4 flex-shrink-0">
                {price !== undefined && (
                    <span className="font-bold text-lg text-orange-500 dark:text-orange-400">{formatPrice(price, currency)}</span>
                )}
            </div>
        </a>
    );
};


export const GotACouponSection = ({ language, translations }: any) => {
    const router = useRouter();
    return (
        <div className="mt-12 mb-8 py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {translations[language].gotCouponTitle}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {translations[language].gotCouponDescription}
            </p>
            <button 
                onClick={() => router.push('/request')}
                className="mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-8 rounded-full font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                {translations[language].submitCouponNow}
            </button>
        </div>
    );
}

export const HorizontalFilter = ({ options, active, setActive }: any) => {
    const scrollRef = useRef<null | HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkArrows = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 5);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };
    
    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            checkArrows(); 
            currentRef.addEventListener('scroll', checkArrows);
            window.addEventListener('resize', checkArrows);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', checkArrows);
                window.removeEventListener('resize', checkArrows);
            }
        };
    }, [options]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const buttonWidth = 150; 
            const scrollAmount = buttonWidth * 6;

            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative mb-6"> 
            {showLeftArrow && (
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-1 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 z-20" 
                    aria-label="Scroll Left"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            )}
            <div 
                ref={scrollRef} 
                className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2"
            >
                {options.map((option: any) => (
                    <button 
                        key={option.key} 
                        onClick={() => setActive(option.key)}
                        className={`py-2 px-5 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-px text-sm whitespace-nowrap flex-shrink-0 ${
                            active === option.key 
                            ? 'bg-orange-600 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            {showRightArrow && (
                <button 
                    onClick={() => scroll('right')} 
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-1 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 z-20" 
                    aria-label="Scroll Right"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            )}
        </div>
    );
};


export const AboutHostVoucherSection = ({ language, translations }: any) => (
    <div className="mt-16 text-center max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">{translations[language].aboutTitle}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{translations[language].aboutDescription}</p>
    </div>
);

export const FAQSection = ({ page, language, translations }: any) => {
    const faqs = translations[language].faqs[page] || [];
    const [activeIndex, setActiveIndex] = useState(0);

    if (faqs.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                {translations[language].faqTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-6">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Questions</h4>
                    <div className="space-y-2 h-96 overflow-y-auto pr-2">
                        {faqs.map((faq: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-full text-left p-3 rounded-md transition-colors text-sm ${
                                    activeIndex === index
                                        ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 font-semibold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="mr-2 text-gray-400">{index + 1}.</span>{faq.q}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-96 overflow-y-auto pr-2"
                        >
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{faqs[activeIndex].q}</h4>
                            <div
                                className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: faqs[activeIndex].a }}
                            ></div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};


export const PopularBrands = ({ onBrandClick, activeBrand, language, translations }: any) => {
    const popularBrands = [
        "A2 Hosting", "Bluehost", "CyberGhost VPN", "DigitalOcean", 
        "DreamHost", "ExpressVPN", "GoDaddy", "Google Domains", "Hostgator", 
        "Hostinger", "Linode", "Namecheap", "NordLayer", "NordVPN", 
        "OVHcloud", "Porkbun", "Private Internet Access", "Proton", 
        "Proton VPN", "Shopee", "SiteGround", "Surfshark", "Vultr"
    ];

    const handleClick = (brand: string) => {
        if (activeBrand === brand) {
            onBrandClick(null); // Deselect if clicked again
        } else {
            onBrandClick(brand);
        }
    };

    return (
        <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">{translations[language].popularBrandsTitle}</h3>
            <div className="flex flex-wrap justify-center gap-4">
                 <button 
                    onClick={() => onBrandClick(null)} 
                    className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                        !activeBrand 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    All Brands
                </button>
                {popularBrands.map((brand, index) => (
                    <button key={index} onClick={() => handleClick(brand)} className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                        activeBrand === brand
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}>
                        {brand}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const ChatBot = ({ translations }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const language = 'en';

    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([{
                sender: 'ai',
                text: "👋 Hello! I'm HostVoucher AI Assistant. I can help you find the best hosting deals and answer your questions. How can I assist you today?"
            }]);
        }

        // Show WhatsApp option after 10 seconds of chat being open
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowWhatsApp(true);
            }, 10000);
            return () => clearTimeout(timer);
        } else {
            setShowWhatsApp(false);
        }
    }, [isOpen, translations, language, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newMessages: any = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        const currentInput = userInput.toLowerCase();
        setUserInput('');
        setIsAiLoading(true);

        // Enhanced AI responses
        setTimeout(() => {
            let aiResponse = "I'm here to help you find the best hosting deals! ";

            if (currentInput.includes('hosting') || currentInput.includes('server')) {
                aiResponse = "🚀 Great! I can help you find amazing hosting deals. We have exclusive offers for web hosting, VPS, cloud hosting, and more. Check out our latest promotions!";
            } else if (currentInput.includes('domain')) {
                aiResponse = "🌐 Looking for domains? We have fantastic domain deals and discounts. You can find premium domains at great prices!";
            } else if (currentInput.includes('coupon') || currentInput.includes('promo') || currentInput.includes('discount')) {
                aiResponse = "💰 Awesome! We have the latest coupons and promotional codes. Check our deals section for verified discounts that can save you up to 90%!";
            } else if (currentInput.includes('help') || currentInput.includes('support')) {
                aiResponse = "🤝 I'm here to help! You can ask me about hosting deals, domain offers, coupons, or any questions about our services. What would you like to know?";
            } else if (currentInput.includes('price') || currentInput.includes('cost') || currentInput.includes('cheap')) {
                aiResponse = "💵 Looking for budget-friendly options? We specialize in finding the best value hosting deals. Our verified offers can help you save significantly!";
            } else {
                aiResponse = "Thanks for your message! I'm constantly learning to better assist you. For immediate support, you can also contact our team directly via WhatsApp. How else can I help you today?";
            }

            setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
            setIsAiLoading(false);
        }, 1500);
    };

    const handleWhatsAppRedirect = () => {
        const phoneNumber = "08875023202";
        const message = "Hello! I'm interested in your hosting deals and services. Can you help me?";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl z-[10000] flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-110 pointer-events-auto"
                aria-label="Toggle AI Assistant"
                style={{ zIndex: 10000 }} // Ensure always on top
            >
                <BotIcon />
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 right-5 transition-all duration-300 ease-in-out pointer-events-auto"
                    style={{ zIndex: 10000 }} // Ensure always on top
                >
                     <div className="w-80 h-[32rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
                        <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <h3 className="font-bold text-lg">HostVoucher AI Assistant</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg: any, index: number) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-white"><BotIcon /></div>}
                                    <p className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                                        {msg.text}
                                    </p>
                                </div>
                            ))}
                            {isAiLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-white"><BotIcon /></div>
                                    <p className="max-w-xs md:max-w-sm rounded-2xl px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none">
                                        <span className="animate-pulse">...</span>
                                    </p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* WhatsApp CTA */}
                        {showWhatsApp && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-700">
                                <button
                                    onClick={handleWhatsAppRedirect}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                    </svg>
                                    Chat via WhatsApp
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                                    Get instant support from our team
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-1 bg-gray-100 dark:bg-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 border-transparent"
                            />
                            <button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-3 hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50" disabled={!userInput.trim() || isAiLoading}>
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    );
};

export const FloatingPromotionalPopup = ({ siteAppearance }: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const customPromoUrl = siteAppearance?.floatingPromoUrl;
    const defaultPromoUrl = 'https://i.ibb.co/L8y2zS6/new-promo.png';
    const promoUrl = customPromoUrl || defaultPromoUrl;

    useEffect(() => {
        const hasBeenClosed = sessionStorage.getItem('promoPopupClosed');
        if (promoUrl && !hasBeenClosed) {
            const timer = setTimeout(() => setIsVisible(true), 3000); // Delay of 3 seconds
            return () => clearTimeout(timer);
        }
    }, [promoUrl]);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        sessionStorage.setItem('promoPopupClosed', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                className="fixed bottom-28 right-20 cursor-pointer group pointer-events-auto"
                style={{ zIndex: 9998 }} // Always behind chatbot
            >
                {/* Background animated effects */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute -inset-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg opacity-40 animate-ping"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-30 animate-pulse"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-20 animate-bounce"></div>
                </div>

                <Link href="/coupons" className="block pointer-events-auto">
                    <div className="relative">
                        {/* Main promo image - Pure transparency with no borders */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 group-hover:scale-105 transition-all duration-300">
                            <Image
                                src={promoUrl}
                                alt="Latest Promo"
                                fill
                                style={{ objectFit: 'contain' }}
                                className="drop-shadow-sm"
                            />
                            {/* Very subtle hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* "PROMO" badge - minimal design */}
                        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce text-[10px]">
                            PROMO
                        </div>

                        {/* "NEW" badge - minimal design */}
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse text-[10px]">
                            NEW
                        </div>
                    </div>
                </Link>

                {/* Close button - smaller and more subtle */}
                <button
                    onClick={handleClose}
                    className="absolute -top-0.5 -right-0.5 bg-gray-700/80 hover:bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-all duration-200 z-10 hover:scale-110 pointer-events-auto"
                    aria-label="Close promo"
                >
                    ×
                </button>
            </motion.div>
        </AnimatePresence>
    );
}

// DomaiNesia-style image banner component
export const DomaiNesiaImageBanner = ({ bannerConfig, showMarketingOverlay, onButtonClick }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = bannerConfig?.slides || [];
    const interval = bannerConfig?.rotationInterval || 8000;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (slides.length || 1));
    }, [slides.length]);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setTimeout(nextSlide, interval);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, slides.length, interval, nextSlide]);

    // Default DomaiNesia-style banner if no slides configured
    const defaultBanner = {
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        title: 'A Better Web Awaits',
        subtitle: 'Everything you need for your website is available here. Powered by cloud-based servers with the best features, capable of improving your website performance many times over.',
        buttonText: 'Get Started',
        buttonLink: '/web-hosting'
    };

    const currentSlide = slides.length > 0 ? slides[currentIndex] : defaultBanner;

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={currentSlide.imageUrl || defaultBanner.imageUrl}
                    alt={currentSlide.title || defaultBanner.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full"
                    priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                    >
                        {currentSlide.title || defaultBanner.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed max-w-xl"
                    >
                        {currentSlide.subtitle || defaultBanner.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href={currentSlide.buttonLink || defaultBanner.buttonLink}>
                            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                {currentSlide.buttonText || defaultBanner.buttonText}
                            </Button>
                        </Link>

                        <Link href="/coupons">
                            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                View Offers
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Location indicator like DomaiNesia */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex items-center mt-8 text-blue-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Global Services Available</span>
                    </motion.div>
                </div>
            </div>

            {/* Navigation dots for multiple slides */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Navigation arrows for multiple slides */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-20"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export const RotatingBanner = ({ bannerConfig, showMarketingOverlay, onButtonClick }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState<{[key: number]: boolean}>({});

    const slides = bannerConfig?.slides || [];
    const interval = bannerConfig?.rotationInterval || 8000;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (slides.length || 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setTimeout(nextSlide, interval);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, slides.length, interval, nextSlide]);

    if (!slides || slides.length === 0) {
        return null;
    }

    const handleImageError = (index: number) => {
        setImageError(prev => ({ ...prev, [index]: true }));
    };

    const getImageSrc = (slide: any, index: number) => {
        if (imageError[index]) {
            return 'https://placehold.co/1280x720/1e293b/ffffff?text=Banner+Image+Not+Found';
        }
        return slide.imageUrl || 'https://placehold.co/1280x720/1e293b/ffffff?text=No+Image+Set';
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto my-12 overflow-hidden rounded-lg shadow-2xl" style={{ aspectRatio: '16 / 9' }}>
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={getImageSrc(slides[currentIndex], currentIndex)}
                        alt={slides[currentIndex].title || `Promotional Banner ${currentIndex + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={currentIndex === 0}
                        onError={() => handleImageError(currentIndex)}
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center text-white p-8 md:p-16 lg:p-24 w-full md:w-3/4 lg:w-2/3">
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-shadow-lg"
                        >
                            {slides[currentIndex].title}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-200 mb-8"
                        >
                            {slides[currentIndex].subtitle}
                        </motion.p>
                        {slides[currentIndex].buttonText && slides[currentIndex].buttonLink && (
                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                             >
                                 <Link href={slides[currentIndex].buttonLink} passHref>
                                    <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        {slides[currentIndex].buttonText}
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
            {slides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                        <ChevronLeftIcon />
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                        <ChevronRightIcon />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {slides.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const PopupModal = ({ isVisible, onClose, config }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = config?.images || [];

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [isVisible, images.length]);


    if (!isVisible || images.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                    {images.map((src: string, index: number) => (
                        <Image key={index} src={src} alt={`Popup ${index + 1}`} fill style={{objectFit:"cover"}} className={`transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                </div>
                 <button onClick={onClose} className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_: any, index: number) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2.5 h-2.5 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const HorizontalDealScroller = ({ items, language, currency, formatPrice, translations }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="relative">
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">
                {translations[language]?.hottestDeals || 'Hottest Deals'}
            </h2>
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 hidden md:block">
                <button
                    onClick={() => scroll('left')}
                    className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition"
                    aria-label="Scroll left"
                >
                    <ChevronLeftIcon />
                </button>
            </div>
            <div
                ref={scrollRef}
                className="flex items-stretch gap-4 overflow-x-auto scrollbar-hide py-4 -mx-4 px-4"
            >
                {items.map((item: any) => (
                    <div key={item.id} className="w-64 flex-shrink-0">
                        <ScrollerCard {...item} language={language} currency={currency} formatPrice={formatPrice} />
                    </div>
                ))}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 hidden md:block">
                <button
                    onClick={() => scroll('right')}
                    className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition"
                    aria-label="Scroll right"
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    );
};


export const CircularShareButton = ({ item, position = 'bottom', settings }: { item: any; position?: 'global' | 'voucher' | 'bottom', settings?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { awardPoints } = useGamification();

    const isCoupon = item.code && item.code !== 'USE-LINK';
    const shareUrl = item.targetUrl || item.link || 'https://hostvoucher.com';
    const shareText = isCoupon
        ? `Amazing coupon from ${item.provider}! Use code: ${item.code}. Get the best tech deals at HostVoucher!`
        : `Check out this great deal for ${item.name || item.title} from ${item.provider}! Found it on HostVoucher, your #1 source for tech savings.`;

     const platforms = [
        { name: 'X', icon: <svg role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153Zm-1.61 19.931h2.5l-10.4-11.96-2.5 11.96h10.4Z"/></svg>, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, color: 'bg-black text-white' },
        { name: 'Facebook', icon: <Facebook className="w-5 h-5"/>, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, color: 'bg-blue-600 text-white' },
        { name: 'Telegram', icon: <svg role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.62 5.813c.267-1.417-.481-2.01-1.527-1.527L2.433 9.245c-1.417.481-1.417 1.149 0 1.488l4.828 1.501 1.43 4.945z"/></svg>, url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, color: 'bg-sky-500 text-white' },
        { name: 'WhatsApp', icon: <svg role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.472 14.382c-.297-.149-.88-.436-1.017-.486s-.282-.08-.41.08-.466.485-.572.585s-.21.104-.393.04a6.528 6.528 0 0 1-1.896-.707a7.061 7.061 0 0 1-1.31-1.127s-.188-.211-.012-.349a.576.576 0 0 0 .15-.23.955.955 0 0 0 .045-.235s-.022-.29-.08-.435s-.282-.34-.38-.41a1.764 1.764 0 0 0-.58-.044s-.41.006-.61.208s-.562.543-.687.979s-.188.981.023 1.542s.59 1.258.68 1.358s.18.17.297.28s.255.188.38.256c.125.07.255.105.372.15s.27.06.39.035c.142-.03.486-.208.572-.41s.085-.38.06-.41s-.023-.06-.045-.08s-.08-.045-.12-.045s-.142-.023-.21-.023a1.94 1.94 0 0 1-.282-.045c-.08-.023-.188-.06-.256-.128s-.142-.142-.188-.232s-.045-.165-.023-.232c.023-.07.045-.118.068-.142s.045-.045.068-.045c.023-.002.045 0 .068 0s.045.002.068.002c.023.002.045.002.068.002s.045.002.068.002c.023 0 .045.002.068.002l.023.002c.613.235 1.06.52 1.44 1.125s.613.98.687 1.258s.085.435.045.613s-.085.282-.188.368s-.232.142-.41.165c-.18.023-.39.023-.57.023a3.5 3.5 0 0 1-1.08-.188c-1.358-.562-2.37-1.462-3.09-2.58s-1.04-2.48-1.04-3.896s.21-2.41.41-3.21s.41-1.358.91-1.907c.5-.542 1.125-.91 1.83-1.125s1.462-.31 2.21-.31c.75 0 1.46.1 2.12.31s1.21.52 1.67 1c.46.48.81.99.99 1.54s.25 1.14.25 1.76s-.06 1.125-.19 1.67s-.33.99-.61 1.358zM12.012 2.016A9.97 9.97 0 0 0 2.04 12.01a9.97 9.97 0 0 0 9.972 9.972c3.15 0 6.1-1.258 8.24-3.468a9.97 9.97 0 0 0 3.468-8.24c0-5.5-4.47-9.972-9.972-9.972z"/></svg>, url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, color: 'bg-green-500 text-white'},
        { name: 'Threads', icon: <svg role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 9.78a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44zm0-1.3A3.52 3.52 0 1 1 8.48 12 3.52 3.52 0 0 1 12 8.48zm5.6-2.42c-.23-.9-1.04-1.6-1.93-1.72a5.8 5.8 0 0 0-1.28-.1H9.6a5.8 5.8 0 0 0-1.28.1C7.42 4.46 6.6 5.16 6.38 6.06c-.1.4-.13.82-.13 1.24v1.23a3.8 3.8 0 0 0-.58.12 1.94 1.94 0 0 0-1.12 1.3 2 2 0 0 0 .42 2.1c.4.45.98.6 1.57.54.1-.4.22-.8.36-1.18a3.5 3.5 0 0 1 1.1-1.92A3.5 3.5 0 0 1 9.6 8.58v-1.3c0-.36.02-.73.08-1.08.06-.35.24-.7.56-1a1.2 1.2 0 0 1 1-.56h2.72c.36 0 .7.12 1 .34.3.22.48.5.56.88.06.35.08.72.08 1.08v1.3a3.5 3.5 0 0 1-1.6 2.8 3.5 3.5 0 0 1-1.9 1.1c-.4.1-.8.2-1.2.33.5.06 1 .24 1.48.54a3.5 3.5 0 0 1 1.9 2.76c.06.4.1.8.1 1.22v1.23c0 .42-.03.84-.1 1.24-.22.9-1.03 1.6-1.92 1.72-.4.08-.82.1-1.28.1H9.6c-.4 0-.8-.03-1.2-.1-.9-.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0-2.48c.15-.3.33-.58.55-.82.22-.24.5-.45.8-.62.3-.17.6-.3.9-.45v-1.7c0-.6.06-1.2.18-1.78a2.9 2.9 0 0 1 .52-1.22c.1-.17.2-.33.32-.48a.7.7,0,0,1,.1-.12c.1-.1.2-.18.3-.26h.12c.1-.1.2-.15.3-.2a1,1,0,0,1,.2-.1zm-1.8,9.54c.23.9,1.04,1.6,1.93,1.72.4.08.82.1,1.28.1h2.72c.4,0,.8-.03,1.2-.1.9-.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0-2.48c-.22-.9-1.03-1.6-1.92-1.72a5.8 5.8 0 0 0-1.28-.1H9.6a5.8 5.8 0 0 0-1.28.1c-.9.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0,2.48z"/></svg>, url: `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, color: 'bg-black text-white'},
        { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5"/>, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: 'bg-blue-700 text-white' },
        { name: 'YouTube', icon: <Youtube className="w-5 h-5"/>, url: 'https://youtube.com/@hostvoucher', color: 'bg-red-600 text-white' },
        { name: 'TikTok', icon: <svg role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.98-6.42-2.98-1.59-2.02-2.16-4.72-1.6-7.15.54-2.4 2.1-4.48 4.16-5.68.75-.43 1.56-.76 2.38-1.05.02-.5.04-1 .04-1.5v-5.4c.81.04 1.63.12 2.42.23Z"/></svg>, url: `https://tiktok.com/@hostvoucher`, color: 'bg-black text-white' },
        { name: 'Instagram', icon: <Instagram className="w-5 h-5"/>, url: 'https://instagram.com/hostvoucher', color: 'bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 text-white' },
        { name: 'Discord', icon: <Dribbble className="w-5 h-5"/>, url: 'https://discord.com/invite/hostvoucher', color: 'bg-indigo-600 text-white' },
    ];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);
    
    const handlePlatformClick = (e: React.MouseEvent, platformUrl: string, platformName: string) => {
        e.preventDefault();
        window.open(platformUrl, '_blank', 'noopener,noreferrer');
        awardPoints('share', platformName);
        setIsOpen(false);
    }
    
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Copied to clipboard!",
            description: `Link for "${item.name || item.code}" copied.`,
        });
        setIsOpen(false);
    };

    const isGlobal = position === 'global';
    const mainButtonSize = isGlobal ? 'w-10 h-10' : 'w-8 h-8';
    const iconSize = isGlobal ? 20 : 16;
    
    if (position === 'voucher') {
        return (
            <div className={`relative flex justify-center items-center`} style={{ zIndex: isOpen ? 100 : 20 }} ref={wrapperRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/60 transition-all duration-300 flex items-center justify-center z-10 ${mainButtonSize}`}
                    title="Share"
                >
                    <Share2 size={iconSize} />
                </button>
                 <AnimatePresence>
                    {isOpen && (
                        <div className="absolute bottom-full mb-2 w-48 h-48">
                             {[...platforms, {name: 'Copy'}].map((p, index) => {
                                const angle = (index / (platforms.length + 1)) * 2 * Math.PI - (Math.PI / 2);
                                const radius = 60;
                                const x = radius * Math.cos(angle);
                                const y = radius * Math.sin(angle);
                                
                                return (
                                <motion.a
                                    key={p.name}
                                    href={p.url || '#'}
                                    onClick={(e) => p.name === 'Copy' ? handleCopy() : handlePlatformClick(e, p.url!, p.name)}
                                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${p.color || 'bg-gray-200 dark:bg-gray-600'}`}
                                    title={p.name === 'Copy' ? 'Copy Link' : `Share on ${p.name}`}
                                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                                    animate={{ opacity: 1, scale: 1, x, y }}
                                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: index * 0.03 }}
                                    style={{ top: '50%', left: '50%', marginTop: -16, marginLeft: -16 }}
                                >
                                    {p.name === 'Copy' ? <LinkIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" /> : p.icon}
                                </motion.a>
                             );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
    
    // Default horizontal layout for ServiceCard and Global button
    return (
        <div className={`relative flex justify-center items-center`} style={{ zIndex: isOpen ? 100 : 'auto' }} ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/60 transition-all duration-300 flex items-center justify-center z-10 ${mainButtonSize}`}
                title="Share"
            >
                <Share2 size={iconSize} />
            </button>
            
            <AnimatePresence>
            {isOpen && (
                 <motion.div
                    initial={{ scaleX: 0, opacity: 0, x: '50%' }}
                    animate={{ scaleX: 1, opacity: 1, x: 0 }}
                    exit={{ scaleX: 0, opacity: 0, x: '50%' }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-1/2 right-full mr-2 -translate-y-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 origin-right"
                 >
                    {[...platforms, {name: 'Copy'}].map((p, index) => (
                        <motion.a
                            key={p.name}
                            href={p.url || '#'}
                            onClick={(e) => p.name === 'Copy' ? handleCopy() : handlePlatformClick(e, p.url!, p.name)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${p.color || 'bg-gray-200 dark:bg-gray-600 text-gray-800'}`}
                            title={p.name === 'Copy' ? 'Copy Link' : `Share on ${p.name}`}
                             initial={{ opacity: 0, scale: 0.5 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: index * 0.05 }}
                        >
                            {p.name === 'Copy' ? <LinkIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" /> : p.icon}
                        </motion.a>
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const TestimonialCard = ({ name, role, review, imageUrl, rating }: any) => (
    <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mx-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
            <Image
                {...getImageProps(imageUrl, name)}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover mr-4"
                data-ai-hint="person portrait"
            />
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            </div>
        </div>
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review}</p>
    </div>
);

export const TestimonialsSection = ({ testimonials }: any) => {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    // Triple testimonials for seamless infinite loop with 12 testimonials
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                    Trusted by 12+ million website owners worldwide
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                    See what our customers are saying about their experience with our hosting partners
                </p>
            </div>
            <div className="relative w-full">
                <div className="flex animate-scroll hover:pause-animation">
                    {duplicatedTestimonials.map((testimonial: any, index: number) => (
                        <TestimonialCard
                            key={`${testimonial.id || testimonial.name}-${index}`}
                            name={testimonial.name}
                            role={testimonial.role}
                            review={testimonial.review}
                            imageUrl={getTestimonialImage(testimonial)}
                            rating={testimonial.rating}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);
    
    useEffect(() => {
        if (!hasMounted) return;

        const timer = setTimeout(() => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const difference = midnight.getTime() - now.getTime();

            let newTimeLeft: any = {};

            if (difference > 0) {
                newTimeLeft = {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formatTime = (time: number) => time.toString().padStart(2, '0');
    
    if (!hasMounted) {
        return null; // or a loading skeleton
    }


    return (
        <div className="flex items-center justify-center gap-4 text-center">
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                <span className="text-4xl font-bold text-orange-500">{formatTime(timeLeft.hours || 0)}</span>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Hours</p>
            </div>
            <span className="text-4xl font-bold text-gray-400 dark:text-gray-500">:</span>
             <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                <span className="text-4xl font-bold text-orange-500">{formatTime(timeLeft.minutes || 0)}</span>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Minutes</p>
            </div>
            <span className="text-4xl font-bold text-gray-400 dark:text-gray-500">:</span>
             <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                <span className="text-4xl font-bold text-orange-500">{formatTime(timeLeft.seconds || 0)}</span>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Seconds</p>
            </div>
        </div>
    );
}

export const CallToActionSection = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    Ready to Unleash Your Website's True Potential?
                </h2>
                <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                    Stop settling for average. Harness elite performance with HostVoucher's curated services, equipped with the latest technology and exclusive offers designed for market leaders. Your best website is one click away.
                </p>
                <Link href="/web-hosting" passHref>
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                        Explore Premier Hosting Deals
                    </Button>
                </Link>
            </div>
        </section>
    );
};


export const NewsletterForm = ({ language, translations, onSubscribe }: any) => {
    const [email, setEmail] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({ title: "Email required", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }
        try {
            await onSubscribe(email);
            setEmail('');
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            toast({ title: "Subscription Failed", description: "Could not subscribe. Please try again later.", variant: "destructive" });
        }
    };
    
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold mb-2">{translations[language].newsletterTitle}</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">{translations[language].newsletterDescription}</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="email" 
                    placeholder={translations[language].formEmailPlaceholder} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow p-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
                <button type="submit" className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300">{translations[language].subscribe}</button>
            </form>
        </div>
    );
};
