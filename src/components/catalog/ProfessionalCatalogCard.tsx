'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ExternalLink, Zap, Award, TrendingUp } from 'lucide-react';

interface ProfessionalCatalogCardProps {
    item: {
        id: string;
        name: string;
        title: string;
        provider: string;
        type: string;
        tier: string;
        price: number;
        original_price?: number;
        discount?: string;
        features: string[];
        link: string;
        target_url: string;
        image?: string;
        provider_logo?: string;
        brand_logo?: string;
        rating: number;
        num_reviews: number;
        clicks: number;
        is_featured?: boolean;
        shake_animation?: boolean;
        shake_intensity?: string;
        button_color?: string;
        color?: string;
    };
    onLinkClick?: (item: any) => void;
    showAnimation?: boolean;
    layout?: 'vertical' | 'horizontal';
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

const getDiscountPercentage = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
};

const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            size={14}
            className={`${
                i < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : i < rating
                    ? 'text-yellow-400 fill-yellow-400 opacity-50'
                    : 'text-gray-300 dark:text-gray-600'
            }`}
        />
    ));
};

const getButtonColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
        blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
        green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    };
    return colorMap[color] || colorMap.blue;
};

export const ProfessionalCatalogCard: React.FC<ProfessionalCatalogCardProps> = ({
    item,
    onLinkClick,
    showAnimation = true,
    layout = 'vertical'
}) => {
    const handleClick = () => {
        if (onLinkClick) {
            onLinkClick(item);
        }
    };

    const discountPercentage = item.original_price && item.original_price > item.price 
        ? getDiscountPercentage(item.original_price, item.price)
        : null;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hover: { 
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const shakeVariants = {
        shake: {
            x: [-2, 2, -2, 2, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
            }
        }
    };

    if (layout === 'horizontal') {
        return (
            <motion.div
                variants={cardVariants}
                initial={showAnimation ? "hidden" : "visible"}
                animate={item.shake_animation ? "shake" : "visible"}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
            >
                <div className="flex">
                    {/* Image Section */}
                    <div className="w-48 h-32 relative flex-shrink-0">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                <ShoppingBag size={32} className="text-gray-400" />
                            </div>
                        )}
                        
                        {/* Discount Badge */}
                        {discountPercentage && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{discountPercentage}%
                            </div>
                        )}
                        
                        {/* Featured Badge */}
                        {item.is_featured && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Award size={10} />
                                Featured
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                            {/* Brand Logo/Text */}
                            <div className="flex items-center gap-2 mb-2">
                                {item.brand_logo || item.provider_logo ? (
                                    <Image
                                        src={item.brand_logo || item.provider_logo || ''}
                                        alt={item.provider}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 object-contain"
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                        <ShoppingBag size={12} className="text-gray-500" />
                                    </div>
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.provider}</span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {item.title || item.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    {renderStars(item.rating)}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.rating.toFixed(1)} ({item.num_reviews.toLocaleString()} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(item.price)}
                                </span>
                                {item.original_price && item.original_price > item.price && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(item.original_price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <Link
                            href={item.target_url || item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClick}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${getButtonColorClasses(item.button_color || 'blue')}`}
                        >
                            <span>View Offer</span>
                            <ExternalLink size={16} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Vertical Layout (Default)
    return (
        <motion.div
            variants={cardVariants}
            initial={showAnimation ? "hidden" : "visible"}
            animate={item.shake_animation ? "shake" : "visible"}
            whileHover="hover"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full flex flex-col"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                )}
                
                {/* Discount Badge */}
                {discountPercentage && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        -{discountPercentage}%
                    </div>
                )}
                
                {/* Featured Badge */}
                {item.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Award size={12} />
                        Featured
                    </div>
                )}

                {/* Trending Badge */}
                {item.clicks > 1000 && (
                    <div className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={10} />
                        Trending
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Brand Logo/Text */}
                <div className="flex items-center gap-3 mb-3">
                    {item.brand_logo || item.provider_logo ? (
                        <Image
                            src={item.brand_logo || item.provider_logo || ''}
                            alt={item.provider}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <ShoppingBag size={16} className="text-gray-500" />
                        </div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.provider}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 flex-grow">
                    {item.title || item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {renderStars(item.rating)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.rating.toFixed(1)} ({item.num_reviews.toLocaleString()} reviews)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {formatPrice(item.price)}
                    </span>
                    {item.original_price && item.original_price > item.price && (
                        <span className="text-xl text-gray-500 line-through">
                            {formatPrice(item.original_price)}
                        </span>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={item.target_url || item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${getButtonColorClasses(item.button_color || 'blue')} mt-auto`}
                >
                    <span>View Offer</span>
                    <ExternalLink size={18} />
                </Link>
            </div>
        </motion.div>
    );
};

export default ProfessionalCatalogCard;
