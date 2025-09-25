

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppHeader, Footer, GamificationHeader, GlobalShareButton, BackToTopButton } from '@/components/hostvoucher/LayoutComponents';
import { Toaster } from "@/components/ui/toaster";
import { ChatBot, FloatingPromotionalPopup, usePointMining } from '@/components/hostvoucher/UIComponents';
import GlobalGamificationWidget, { useAutoGamification } from '@/components/GlobalGamificationWidget';
import SmartChatbot from '@/components/SmartChatbot';
import { FloatingPromoImage } from '@/components/FloatingPromoImage';
import VisitorTrackingProvider from "@/components/VisitorTrackingProvider";
import CodingChatbot from '@/components/chatbot/CodingChatbot';
import { AICodingAssistant } from '@/components/ai/AICodingAssistant';
import { UnifiedSupportChat } from '@/components/support/UnifiedSupportChat';
import * as dataApi from '@/lib/hostvoucher-data';
import { useClientData } from '@/hooks/use-client-data';

// Custom hook to detect user idle state
const useIdle = (ms = 30000) => {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutId = useRef<any>();

    const resetTimeout = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setIsIdle(false);
        timeoutId.current = setTimeout(() => setIsIdle(true), ms);
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        
        const handleEvent = () => resetTimeout();

        events.forEach(event => window.addEventListener(event, handleEvent));
        resetTimeout();

        return () => {
            events.forEach(event => window.removeEventListener(event, handleEvent));
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [ms]);

    return isIdle;
};

// Component to play the idle sound
const IdleSoundPlayer = () => {
    const isIdle = useIdle(30000); // 30 seconds idle time
    const [settings, setSettings] = useState<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const fetchedSettings = await dataApi.getSiteSettings();
                setSettings(fetchedSettings);
            } catch (error) {
                console.error("Could not fetch site settings for idle sound.", error);
            }
        }
        fetchSettings();
    }, []);

    useEffect(() => {
        if (isIdle && settings?.idleSound?.enabled && settings?.idleSound?.url) {
            if (audioRef.current) {
                audioRef.current.src = settings.idleSound.url;
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [isIdle, settings]);
    
    // This component doesn't render anything visible, but it needs an audio element
    return <audio ref={audioRef} preload="auto" />;
};


export function ClientLayout({ children }: {
    children: React.ReactNode;
}) {
    const [isNftActivated, setIsNftActivated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [siteAppearance, setSiteAppearance] = useState(null);
    const [showCodingChatbot, setShowCodingChatbot] = useState(false);

    // Use auto gamification hook
    useAutoGamification();

    useEffect(() => {
        setIsMounted(true);
        const storedState = localStorage.getItem('gamificationState');
        if (storedState) {
            try {
                setIsNftActivated(JSON.parse(storedState).isNftActivated);
            } catch (e) {
                console.error("Failed to parse gamification state from localStorage", e);
            }
        }

        // Fetch site settings for floating promo
        dataApi.getSiteSettings().then(settings => {
            setSiteAppearance(settings.site_appearance || settings.siteAppearance);
        }).catch(error => {
            console.error('Failed to load site settings:', error);
        });
    }, []);

    usePointMining(isNftActivated);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <VisitorTrackingProvider>
            <div className="flex flex-col min-h-screen">
                <AppHeader
                    translations={dataApi.translations}
                    currencies={dataApi.currencyData}
                    initialTheme={'dark'}
                />
                <GamificationHeader />
                <main className="flex-grow">{children}</main>
                <Footer
                    translations={dataApi.translations}
                />
            </div>
            <Toaster />
            <GlobalShareButton translations={dataApi.translations} settings={{}} />
            <GlobalGamificationWidget />
            <FloatingPromoImage />
            {siteAppearance && <FloatingPromotionalPopup siteAppearance={siteAppearance} />}

            {/* Unified Support Chat - includes HostVoucher AI, Coding Assistant, and WhatsApp Support */}
            <UnifiedSupportChat position="bottom-right" zIndex={9999} />

            {/* Keep SmartChatbot as backup */}
            <SmartChatbot translations={dataApi.translations} />
            <CodingChatbot
                isOpen={showCodingChatbot}
                onToggle={() => setShowCodingChatbot(!showCodingChatbot)}
                onClose={() => setShowCodingChatbot(false)}
            />
            <BackToTopButton />
            <IdleSoundPlayer />
        </VisitorTrackingProvider>
    );
}
