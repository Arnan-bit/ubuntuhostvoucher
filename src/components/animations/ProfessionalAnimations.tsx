'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';

// Hook for intersection observer with animation
export const useScrollAnimation = (threshold = 0.1, triggerOnce = true) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { threshold, triggerOnce });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else if (!triggerOnce) {
            controls.start('hidden');
        }
    }, [controls, inView, triggerOnce]);

    return { ref, controls };
};

// Fade in from bottom animation
export const FadeInUp: React.FC<{ 
    children: React.ReactNode; 
    delay?: number; 
    duration?: number;
    className?: string;
}> = ({ children, delay = 0, duration = 0.6, className = '' }) => {
    const { ref, controls } = useScrollAnimation();

    const variants = {
        hidden: { 
            opacity: 0, 
            y: 60,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Fade in from left animation
export const FadeInLeft: React.FC<{ 
    children: React.ReactNode; 
    delay?: number; 
    duration?: number;
    className?: string;
}> = ({ children, delay = 0, duration = 0.6, className = '' }) => {
    const { ref, controls } = useScrollAnimation();

    const variants = {
        hidden: { 
            opacity: 0, 
            x: -60,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { 
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Fade in from right animation
export const FadeInRight: React.FC<{ 
    children: React.ReactNode; 
    delay?: number; 
    duration?: number;
    className?: string;
}> = ({ children, delay = 0, duration = 0.6, className = '' }) => {
    const { ref, controls } = useScrollAnimation();

    const variants = {
        hidden: { 
            opacity: 0, 
            x: 60,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { 
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Scale in animation
export const ScaleIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number; 
    duration?: number;
    className?: string;
}> = ({ children, delay = 0, duration = 0.6, className = '' }) => {
    const { ref, controls } = useScrollAnimation();

    const variants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            rotate: -5
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            rotate: 0,
            transition: { 
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger children animation
export const StaggerContainer: React.FC<{ 
    children: React.ReactNode; 
    staggerDelay?: number;
    className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
    const { ref, controls } = useScrollAnimation();

    const variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger child item
export const StaggerItem: React.FC<{ 
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    const variants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Parallax scroll effect
export const ParallaxScroll: React.FC<{ 
    children: React.ReactNode;
    speed?: number;
    className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Floating animation
export const FloatingElement: React.FC<{ 
    children: React.ReactNode;
    duration?: number;
    intensity?: number;
    className?: string;
}> = ({ children, duration = 3, intensity = 10, className = '' }) => {
    return (
        <motion.div
            animate={{
                y: [-intensity, intensity, -intensity],
                rotate: [-1, 1, -1]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Typewriter effect
export const TypewriterText: React.FC<{ 
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
}> = ({ text, delay = 0, speed = 50, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < text.length) {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }
        }, currentIndex === 0 ? delay : speed);

        return () => clearTimeout(timer);
    }, [currentIndex, text, delay, speed]);

    return (
        <span className={className}>
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block"
            >
                |
            </motion.span>
        </span>
    );
};

// Loading animation for page transitions
export const PageLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center"
        >
            <div className="text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-gray-600 dark:text-gray-400"
                >
                    Loading...
                </motion.p>
            </div>
        </motion.div>
    );
};

// Smooth page transition wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
};
