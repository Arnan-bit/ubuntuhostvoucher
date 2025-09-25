'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Crown,
    Shield,
    Star,
    Gem,
    Rocket,
    Trophy,
    Sparkles,
    Flame
} from 'lucide-react';

interface AvatarSystemProps {
    userBadge: string;
    points: number;
    level: number;
    showEvolution?: boolean;
    size?: 'small' | 'medium' | 'large';
}

// Avatar evolution stages based on badges
const avatarStages = {
    'Newcomer': {
        character: '🌱',
        name: 'Seedling Explorer',
        description: 'Just starting the journey',
        color: 'from-green-400 to-green-600',
        effects: ['pulse'],
        icon: Star,
        bgPattern: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)'
    },
    'Bronze': {
        character: '🤖',
        name: 'Bronze Automaton',
        description: 'Basic mechanical companion',
        color: 'from-amber-600 to-amber-800',
        effects: ['pulse', 'glow'],
        icon: Shield,
        bgPattern: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, rgba(217,119,6,0.05) 100%)'
    },
    'Silver': {
        character: '⚡',
        name: 'Silver Lightning Engine',
        description: 'Electrified power core',
        color: 'from-slate-400 to-slate-600',
        effects: ['pulse', 'glow', 'spark'],
        icon: Zap,
        bgPattern: 'radial-gradient(circle, rgba(148,163,184,0.1) 0%, rgba(148,163,184,0.05) 100%)'
    },
    'Gold': {
        character: '👑',
        name: 'Golden Sovereign',
        description: 'Majestic royal entity',
        color: 'from-yellow-400 to-yellow-600',
        effects: ['pulse', 'glow', 'spark', 'royal'],
        icon: Crown,
        bgPattern: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, rgba(250,204,21,0.05) 100%)'
    },
    'Platinum': {
        character: '💎',
        name: 'Platinum Crystal Core',
        description: 'Crystalline perfection',
        color: 'from-cyan-400 to-cyan-600',
        effects: ['pulse', 'glow', 'spark', 'royal', 'crystal'],
        icon: Gem,
        bgPattern: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0.05) 100%)'
    },
    'Diamond': {
        character: '🚀',
        name: 'Diamond Rocket Entity',
        description: 'Ultimate space explorer',
        color: 'from-purple-400 to-purple-600',
        effects: ['pulse', 'glow', 'spark', 'royal', 'crystal', 'cosmic'],
        icon: Rocket,
        bgPattern: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)'
    },
    'Legendary': {
        character: '🌟',
        name: 'Legendary Cosmic Being',
        description: 'Transcendent universal force',
        color: 'from-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
        effects: ['pulse', 'glow', 'spark', 'royal', 'crystal', 'cosmic', 'legendary'],
        icon: Trophy,
        bgPattern: 'conic-gradient(from 0deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1), rgba(99,102,241,0.1), rgba(236,72,153,0.1))'
    }
};

const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
};

export const AvatarSystem: React.FC<AvatarSystemProps> = ({
    userBadge,
    points,
    level,
    showEvolution = true,
    size = 'medium'
}) => {
    const [isEvolutionPlaying, setIsEvolutionPlaying] = useState(false);
    const [currentStage, setCurrentStage] = useState(avatarStages[userBadge as keyof typeof avatarStages] || avatarStages.Newcomer);

    useEffect(() => {
        const newStage = avatarStages[userBadge as keyof typeof avatarStages] || avatarStages.Newcomer;
        if (newStage !== currentStage && showEvolution) {
            setIsEvolutionPlaying(true);
            setTimeout(() => {
                setCurrentStage(newStage);
                setTimeout(() => setIsEvolutionPlaying(false), 2000);
            }, 500);
        } else {
            setCurrentStage(newStage);
        }
    }, [userBadge, showEvolution]);

    const IconComponent = currentStage.icon;

    return (
        <div className="relative">
            {/* Evolution Animation Overlay */}
            <AnimatePresence>
                {isEvolutionPlaying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 z-50 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-6xl mb-2"
                            >
                                ✨
                            </motion.div>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-sm font-bold text-white bg-purple-600 px-3 py-1 rounded-full"
                            >
                                EVOLUTION!
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Avatar Container */}
            <motion.div
                className={`relative ${sizeClasses[size]} mx-auto`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {/* Background Pattern */}
                <div 
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{ background: currentStage.bgPattern }}
                />

                {/* Avatar Character */}
                <motion.div
                    className={`relative z-10 ${sizeClasses[size]} rounded-full bg-gradient-to-br ${currentStage.color} flex items-center justify-center text-4xl shadow-lg border-2 border-white/20`}
                    animate={{
                        boxShadow: currentStage.effects.includes('glow') 
                            ? ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)']
                            : '0 4px 20px rgba(0, 0, 0, 0.1)',
                        scale: currentStage.effects.includes('pulse') 
                            ? [1, 1.05, 1] 
                            : 1
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {currentStage.character}
                    
                    {/* Spark Effects */}
                    {currentStage.effects.includes('spark') && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                    style={{
                                        top: '50%',
                                        left: '50%',
                                        transformOrigin: '0 0'
                                    }}
                                    animate={{
                                        x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                                        y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.div>

                {/* Level Badge */}
                <motion.div
                    className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    {level}
                </motion.div>

                {/* Badge Icon */}
                <motion.div
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <IconComponent size={16} className="text-gray-700" />
                </motion.div>
            </motion.div>

            {/* Character Info */}
            <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h3 className="font-bold text-sm text-gray-800 dark:text-white">
                    {currentStage.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentStage.description}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <Sparkles size={12} className="text-yellow-500" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {points.toLocaleString()} points
                    </span>
                </div>
            </motion.div>

            {/* Legendary Effects */}
            {currentStage.effects.includes('legendary') && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: [
                            'conic-gradient(from 0deg, transparent, rgba(236,72,153,0.1), transparent)',
                            'conic-gradient(from 360deg, transparent, rgba(168,85,247,0.1), transparent)'
                        ]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            )}
        </div>
    );
};

export default AvatarSystem;
