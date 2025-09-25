'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, Rocket, Star } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'gradient';
    message?: string;
    submessage?: string;
    showProgress?: boolean;
    progress?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'default',
    message = 'Loading...',
    submessage,
    showProgress = false,
    progress = 0
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const containerSizeClasses = {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    };

    const renderSpinner = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-orange-500 rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <motion.div
                        className={`${sizeClasses[size]} bg-orange-500 rounded-full`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity
                        }}
                    />
                );

            case 'bounce':
                return (
                    <div className="flex space-x-1">
                        {[Zap, Rocket, Star].map((Icon, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            >
                                <Icon className="w-6 h-6 text-orange-500" />
                            </motion.div>
                        ))}
                    </div>
                );

            case 'gradient':
                return (
                    <div className="relative">
                        <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
                        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full animate-spin`}></div>
                    </div>
                );

            default:
                return (
                    <Loader2 className={`${sizeClasses[size]} text-orange-500 animate-spin`} />
                );
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}>
            {renderSpinner()}
            
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
                >
                    {message}
                </motion.p>
            )}
            
            {submessage && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-sm text-gray-500 dark:text-gray-500"
                >
                    {submessage}
                </motion.p>
            )}

            {showProgress && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 w-full max-w-xs"
                >
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
                        {progress}% Complete
                    </p>
                </motion.div>
            )}
        </div>
    );
};

// Full screen loading component
export const FullScreenLoader: React.FC<{
    message?: string;
    submessage?: string;
    variant?: LoadingSpinnerProps['variant'];
}> = ({ message = 'Loading...', submessage, variant = 'gradient' }) => {
    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center z-50">
            <div className="text-center">
                <LoadingSpinner
                    size="xl"
                    variant={variant}
                    message={message}
                    submessage={submessage}
                />
            </div>
        </div>
    );
};

// Page loading component
export const PageLoader: React.FC<{
    message?: string;
    submessage?: string;
}> = ({ message = 'Loading page...', submessage = 'Please wait while we prepare your content' }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-6">
                <LoadingSpinner
                    size="lg"
                    variant="gradient"
                    message={message}
                    submessage={submessage}
                />
                
                {/* Loading tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        💡 Did you know?
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        HostVoucher helps you save up to 90% on hosting, domains, and VPN services!
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
