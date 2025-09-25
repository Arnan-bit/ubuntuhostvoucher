'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ExternalLink, ShoppingBag, Users, Package, Server, Globe, Shield } from 'lucide-react';
import { getProductImage, getImageProps } from '@/lib/image-utils';
import { StarRating } from '@/components/hostvoucher/UIComponents';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { ModernLoader } from '@/components/ui/ModernLoader';

interface CatalogItem {
    id: string;
    name: string;
    title?: string;
    provider: string;
    type: string;
    tier?: string;
    price: number;
    original_price?: number;
    discount?: string;
    features?: string[];
    target_url: string;
    image?: string;
    provider_logo?: string;
    catalog_image?: string;
    brand_logo?: string;
    brand_logo_text?: string;
    rating: number;
    num_reviews: number;
    clicks: number;
    code?: string;
    color?: string;
    button_color?: string;
    is_featured: boolean;
    show_on_landing: boolean;
    display_style: 'vertical' | 'horizontal';
}

interface ResponsiveCatalogCardProps {
    item: CatalogItem;
    onItemClick?: (item: CatalogItem) => void;
    className?: string;
}

export const ResponsiveCatalogCard: React.FC<ResponsiveCatalogCardProps> = ({
    item,
    onItemClick,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);
    const displayImage = getProductImage(item);
    const displayBrandLogo = item.brand_logo || item.provider_logo;
    const displayName = item.name || item.title;
    
    const handleClick = () => {
        if (onItemClick) {
            onItemClick(item);
        } else if (item.target_url) {
            window.open(item.target_url, '_blank');
        }
    };

    // Remove the old formatPrice function as we'll use PriceDisplay component

    // Get default image based on provider and type
    const getDefaultImage = () => {
        const provider = item.provider?.toLowerCase();
        const type = item.type?.toLowerCase();

        // Provider-specific logos
        const providerLogos = {
            'hostinger': 'https://logo.clearbit.com/hostinger.com',
            'bluehost': 'https://logo.clearbit.com/bluehost.com',
            'siteground': 'https://logo.clearbit.com/siteground.com',
            'namecheap': 'https://logo.clearbit.com/namecheap.com',
            'a2hosting': 'https://logo.clearbit.com/a2hosting.com',
            'digitalocean': 'https://logo.clearbit.com/digitalocean.com',
            'linode': 'https://logo.clearbit.com/linode.com',
            'vultr': 'https://logo.clearbit.com/vultr.com',
            'wpengine': 'https://logo.clearbit.com/wpengine.com',
            'kinsta': 'https://logo.clearbit.com/kinsta.com',
            'flywheel': 'https://logo.clearbit.com/getflywheel.com'
        };

        if (provider && providerLogos[provider]) {
            return providerLogos[provider];
        }

        // Type-based default images with icons
        const typeDefaults = {
            'web hosting': 'https://placehold.co/400x300/3b82f6/ffffff.png?text=Web+Hosting',
            'wordpress hosting': 'https://placehold.co/400x300/21759b/ffffff.png?text=WordPress',
            'cloud hosting': 'https://placehold.co/400x300/10b981/ffffff.png?text=Cloud+Hosting',
            'vps': 'https://placehold.co/400x300/8b5cf6/ffffff.png?text=VPS+Server',
            'domain': 'https://placehold.co/400x300/f59e0b/ffffff.png?text=Domain',
            'digital product': 'https://placehold.co/400x300/ef4444/ffffff.png?text=Digital+Product',
            'coupon': 'https://placehold.co/400x300/ec4899/ffffff.png?text=Coupon+Code'
        };

        return typeDefaults[type] || 'https://placehold.co/400x300/6b7280/ffffff.png?text=Product';
    };

    // Get icon based on type
    const getTypeIcon = () => {
        const type = item.type?.toLowerCase();
        const iconProps = { size: 24, className: "text-gray-400" };

        switch (type) {
            case 'web hosting':
            case 'wordpress hosting':
            case 'cloud hosting':
                return <Server {...iconProps} />;
            case 'vps':
                return <Package {...iconProps} />;
            case 'domain':
                return <Globe {...iconProps} />;
            case 'digital product':
                return <ShoppingBag {...iconProps} />;
            default:
                return <Shield {...iconProps} />;
        }
    };

    // Rating component
    const RatingDisplay = ({ rating, numReviews }: { rating?: number; numReviews?: number }) => {
        if (!rating && !numReviews) return null;

        return (
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={14}
                            className={`${
                                star <= (rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                            }`}
                        />
                    ))}
                    {rating && (
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                            {rating.toFixed(1)}
                        </span>
                    )}
                </div>
                {numReviews && numReviews > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Users size={12} />
                        <span className="text-xs">
                            {numReviews.toLocaleString()} review{numReviews !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" size={14} className="fill-yellow-400/50 text-yellow-400" />);
        }
        
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-300" />);
        }
        
        return stars;
    };

    // Animation classes
    const getAnimationClass = () => {
        if (item.shake_animation) {
            return item.shake_intensity === 'intense' ? 'animate-shake-intense' : 'animate-shake';
        }
        return '';
    };

    // Vertical Card Layout
    if (item.display_style === 'vertical' || !displayImage) {
        return (
            <div
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${getAnimationClass()} ${className}`}
                onClick={handleClick}
            >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {displayImage && !imageError ? (
                        <Image
                            src={displayImage}
                            alt={displayName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                            <div className="flex flex-col items-center space-y-2">
                                {getTypeIcon()}
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {item.provider || 'Product'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.type || 'Service'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {item.is_featured && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                        </div>
                    )}
                    {item.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            -{item.discount}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {/* Brand Logo/Text */}
                    <div className="flex items-center gap-3 mb-3">
                        {displayBrandLogo ? (
                            <Image
                                src={displayBrandLogo}
                                alt={item.provider}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                        ) : item.brand_logo_text ? (
                            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {item.brand_logo_text}
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                <ShoppingBag size={16} className="text-gray-500" />
                            </div>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.provider}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {displayName}
                    </h3>

                    {/* Type & Tier */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                            {item.type}
                        </span>
                        {item.tier && (
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                {item.tier}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                        <RatingDisplay rating={item.rating} numReviews={item.num_reviews} />
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <PriceDisplay
                            price={item.price}
                            originalPrice={item.original_price}
                            currency="USD"
                            size="lg"
                            variant="detailed"
                        />
                    </div>

                    {/* Features */}
                    {item.features && item.features.length > 0 && (
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                            {item.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Action Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                        <span>View Details</span>
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // Horizontal Card Layout
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex ${getAnimationClass()} ${className}`}
            onClick={handleClick}
        >
            {/* Image Section */}
            <div className="relative w-64 h-48 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {displayImage && !imageError ? (
                    <Image
                        src={displayImage}
                        alt={displayName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                        <div className="flex flex-col items-center space-y-2">
                            {getTypeIcon()}
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {item.provider || 'Product'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.type || 'Service'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {item.is_featured && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                    </div>
                )}
                {item.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        -{item.discount}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    {/* Brand Logo/Text */}
                    <div className="flex items-center gap-3 mb-3">
                        {displayBrandLogo ? (
                            <Image
                                src={displayBrandLogo}
                                alt={item.provider}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                        ) : item.brand_logo_text ? (
                            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {item.brand_logo_text}
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                <ShoppingBag size={16} className="text-gray-500" />
                            </div>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.provider}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        {displayName}
                    </h3>

                    {/* Type & Tier */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                            {item.type}
                        </span>
                        {item.tier && (
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                {item.tier}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                        <RatingDisplay rating={item.rating} numReviews={item.num_reviews} />
                    </div>

                    {/* Features */}
                    {item.features && item.features.length > 0 && (
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                            {item.features.slice(0, 2).map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                    {/* Price */}
                    <div>
                        <PriceDisplay
                            price={item.price}
                            originalPrice={item.original_price}
                            currency="USD"
                            size="lg"
                            variant="compact"
                        />
                    </div>

                    {/* Action Button */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2">
                        <span>View Details</span>
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveCatalogCard;
