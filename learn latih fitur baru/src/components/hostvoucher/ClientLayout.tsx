

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppHeader, Footer, GamificationHeader, GlobalShareButton, BackToTopButton } from '@/components/hostvoucher/LayoutComponents';
import { Toaster } from "@/components/ui/toaster";
import { ChatBot, FloatingPromotionalPopup, usePointMining } from '@/components/hostvoucher/UIComponents';
import * as dataApi from '@/lib/hostvoucher-data';

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
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;

        async function fetchSettings() {
            try {
                const fetchedSettings = await dataApi.getSiteSettings();
                setSettings(fetchedSettings);
            } catch (error) {
                console.error("Could not fetch site settings for idle sound.", error);
            }
        }
        fetchSettings();
    }, [hasMounted]);

    useEffect(() => {
        if (!hasMounted) return;

        if (isIdle && settings?.idleSound?.enabled && settings?.idleSound?.url) {
            if (audioRef.current) {
                audioRef.current.src = settings.idleSound.url;
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [isIdle, settings, hasMounted]);
    
    if (!hasMounted) return null;
    
    // This component doesn't render anything visible, but it needs an audio element
    return <audio ref={audioRef} preload="auto" />;
};


export function ClientLayout({ children }: {
    children: React.ReactNode;
}) {
    const [isNftActivated, setIsNftActivated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [siteAppearance, setSiteAppearance] = useState(null);

    useEffect(() => {
        setIsMounted(true); // Indicate that the component has mounted
        
        // Fetch site settings once on mount
        dataApi.getSiteSettings().then(settings => setSiteAppearance(settings.siteAppearance));

        const storedState = localStorage.getItem('gamificationState');
        if (storedState) {
            try {
                setIsNftActivated(JSON.parse(storedState).isNftActivated);
            } catch (e) {
                console.error("Failed to parse gamification state from localStorage", e);
            }
        }
    }, []);

    usePointMining(isNftActivated);

    // Initial render before mount can be null or a generic loader
    if (!isMounted) {
        return null;
    }

    return (
        <>
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
            {siteAppearance && <FloatingPromotionalPopup siteAppearance={siteAppearance} />}
            <ChatBot translations={dataApi.translations} />
            <BackToTopButton />
            <IdleSoundPlayer />
        </>
    );
}
