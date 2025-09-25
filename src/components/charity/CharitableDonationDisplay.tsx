'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface CharitableDonationDisplayProps {
    settings: any;
}

interface DonationImage {
    id: string;
    url: string;
    title: string;
    description: string;
    date: string;
}

export const CharitableDonationDisplay: React.FC<CharitableDonationDisplayProps> = ({
    settings
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const donationSettings = settings?.charitable_donation;

    useEffect(() => {
        if (!donationSettings?.enabled || !donationSettings?.show_images || !donationSettings?.images?.length) {
            return;
        }

        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => 
                    (prev + 1) % donationSettings.images.length
                );
            }, 4000); // Change image every 4 seconds

            return () => clearInterval(interval);
        }
    }, [donationSettings, isAutoPlaying]);

    if (!donationSettings?.enabled) {
        return null;
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? donationSettings.images.length - 1 : prev - 1
        );
        setIsAutoPlaying(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => 
            (prev + 1) % donationSettings.images.length
        );
        setIsAutoPlaying(false);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const imageVariants = {
        enter: { x: 300, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Heart className="text-red-500" size={24} fill="currentColor" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {donationSettings.title || 'Supporting Charity'}
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* Text Content */}
                <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            {donationSettings.percentage || 5}% of our revenue
                        </span>{' '}
                        goes to{' '}
                        <span className="font-semibold">
                            {donationSettings.charity_name || 'various charitable organizations'}
                        </span>
                        .
                    </p>
                    
                    {donationSettings.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {donationSettings.description}
                        </p>
                    )}

                    {/* Progress Bar Animation */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Monthly Goal Progress</span>
                            <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Image Carousel */}
                {donationSettings.show_images && donationSettings.images?.length > 0 && (
                    <div className="relative">
                        <div className="relative h-48 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    variants={imageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={donationSettings.images[currentImageIndex]?.url}
                                        alt={donationSettings.images[currentImageIndex]?.title}
                                        fill
                                        className="object-cover"
                                    />
                                    
                                    {/* Image Overlay Info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h4 className="text-white font-semibold text-sm mb-1">
                                            {donationSettings.images[currentImageIndex]?.title}
                                        </h4>
                                        {donationSettings.images[currentImageIndex]?.description && (
                                            <p className="text-white/80 text-xs">
                                                {donationSettings.images[currentImageIndex]?.description}
                                            </p>
                                        )}
                                        <p className="text-white/60 text-xs mt-1">
                                            {donationSettings.images[currentImageIndex]?.date}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            {donationSettings.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}

                            {/* Dots Indicator */}
                            {donationSettings.images.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                    {donationSettings.images.map((_: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentImageIndex(index);
                                                setIsAutoPlaying(false);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentImageIndex
                                                    ? 'bg-white'
                                                    : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auto-play indicator */}
                        {isAutoPlaying && donationSettings.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                Auto
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Every purchase you make helps us support those in need. Thank you for being part of our mission! 🙏
                </p>
            </div>
        </motion.div>
    );
};

export default CharitableDonationDisplay;
