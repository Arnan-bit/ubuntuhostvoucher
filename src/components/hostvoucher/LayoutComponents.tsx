

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BotIcon, SendIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon, SearchIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from './IconComponents';
import { CircularShareButton, usePointMining, NewsletterForm } from './UIComponents';
import { useRouter, usePathname } from 'next/navigation';
import { DollarSign, Trophy, Medal, Gem, Share2, Edit, Check, Server, Power, Cloud, Home, Instagram, MessageCircle, Twitter, Facebook, Youtube, Linkedin, Twitch, Shell, Dribbble, Heart, Globe } from 'lucide-react';
import { CurrencyToggle } from '@/components/ui/CurrencyToggle';
import { currencyData, translations as allTranslations, getSiteSettings } from '@/lib/hostvoucher-data';
import {
    getIconByTierName,
    findBadgeInfo
} from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import * as apiClient from '@/lib/api-client';
import { badgeTiers } from '@/lib/data';
import { CharitableDonationDisplay } from '@/components/charity/CharitableDonationDisplay';

const EditorProfile = ({ siteAppearance, translations }: any) => {
    const language = 'en';
    if (!translations?.[language]) return null;

    // Get specialist image URL from admin panel
    const specialistImageUrl = siteAppearance?.specialistImageUrl;
    const defaultImageUrl = "https://i.ibb.co/QdBBzJL/specialist-profile.jpg";

    // Use admin panel image if available, otherwise use default
    const imageUrl = specialistImageUrl ?
    (specialistImageUrl.startsWith('http') 
        ? specialistImageUrl 
        : `${process.env.NEXT_PUBLIC_UPLOADS_URL || '/uploads'}${specialistImageUrl}`)
    : defaultImageUrl;

    return (
        <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Meet Our Specialist</h3>
             <Link href="/landing" passHref>
                <div className="relative w-32 h-32 mx-auto md:mx-0 cursor-pointer group">
                  <Image
                      src={imageUrl}
                      alt="Specialist Profile"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint="professional specialist portrait"
                      onError={(e) => {
                          // Fallback to default image if admin panel image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = defaultImageUrl;
                      }}
                  />
                  {/* Pulse ring effect like floating promo */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-30 animate-pulse"></div>
                </div>
            </Link>
             <Link href="/landing" passHref>
                <h4 className="text-lg font-semibold cursor-pointer hover:text-orange-500 mt-4 text-gray-900 dark:text-white">Ah Nakamoto</h4>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto md:mx-0">
                Ah is the editor for HostVoucher, always ensuring the promo codes on our pages are the best and most up-to-date verified offers for smarter online shopping.
            </p>
        </div>
    );
};


export const SocialIcons = React.memo(({ colorful = false, onSocialClick }: { colorful?: boolean, onSocialClick?: (platform: string) => void }) => {
    const iconBaseClass = "w-8 h-8 transition-transform duration-300 transform hover:scale-125";
    const colorfulClasses = {
        youtube: 'text-red-600',
        tiktok: 'text-black dark:text-white',
        facebook: 'text-blue-600',
        instagram: 'text-pink-600',
        x: 'text-black dark:text-white',
        discord: 'text-indigo-600',
        telegram: 'text-sky-500',
        linkedin: 'text-blue-700',
        threads: 'text-black dark:text-white',
        whatsapp: 'text-green-500'
    };
    const themeClasses = `text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400`;
    
    const socialPlatforms = [
        { name: 'YouTube', href: 'https://youtube.com/@hostvoucher', label: 'YouTube', icon: <Youtube />, color: 'youtube' },
        { name: 'TikTok', href: 'https://tiktok.com/@hostvoucher', label: 'TikTok', icon: <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>, color: 'tiktok' },
        { name: 'Facebook', href: 'https://facebook.com/hostvoucher', label: 'Facebook', icon: <Facebook />, color: 'facebook' },
        { name: 'Instagram', href: 'https://instagram.com/hostvoucher', label: 'Instagram', icon: <Instagram />, color: 'instagram' },
        { name: 'X.com', href: 'https://x.com/hostvoucher', label: 'X (Twitter)', icon: <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153Zm-1.61 19.931h2.5l-10.4-11.96-2.5 11.96h10.4Z"/></svg>, color: 'x' },
        { name: 'Discord', href: 'https://discord.com/invite/3S72qZkuay', label: 'Discord', icon: <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/></svg>, color: 'discord' },
        { name: 'Telegram', href: 'https://t.me/hostvoucher', label: 'Telegram', icon: <svg role="img" viewBox="0 0 24 24" fill="currentColor"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.62 5.813c.267-1.417-.481-2.01-1.527-1.527L2.433 9.245c-1.417.481-1.417 1.149 0 1.488l4.828 1.501 1.43 4.945z"/></svg>, color: 'telegram' },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/hostvoucher', label: 'LinkedIn', icon: <Linkedin />, color: 'linkedin' },
        { name: 'Threads', href: 'https://threads.net/@hostvoucher', label: 'Threads', icon: <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor"><path d="M12.9 8.6c-1.1-2.5-3.5-3.8-6.2-3.8-4.5 0-8.2 3.7-8.2 8.2s3.7 8.2 8.2 8.2c2.7 0 5.1-1.3 6.2-3.8.4-.9.6-1.9.6-2.9v-.9c0-1-.2-2-.6-2.9zm-6.2 7.9c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1c1.4 0 2.7.6 3.6 1.5.9.9 1.5 2.2 1.5 3.6s-.6 2.7-1.5 3.6c-.9.9-2.2 1.5-3.6 1.5z"/><path d="M19.8 12c0-4.3-3.5-7.8-7.8-7.8-1.1 0-2.1.2-3.1.6 1.8-1.1 3.9-1.8 6.2-1.8 6.1 0 11 4.9 11 11s-4.9 11-11 11c-2.3 0-4.4-.7-6.2-1.8 1-.4 2-.6 3.1-.6 4.3 0 7.8-3.5 7.8-7.8z"/></svg>, color: 'threads' },
        { name: 'WhatsApp', href: 'https://wa.me/message/ABCDEFGHIJKLMNOP', label: 'WhatsApp', icon: <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>, color: 'whatsapp' },
    ];

    const handleClick = (e: React.MouseEvent, platform: any) => {
        if (onSocialClick) {
            e.preventDefault();
            onSocialClick(platform.name);
            window.open(platform.href, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="flex justify-center items-center space-x-6">
            {socialPlatforms.map(platform => (
                 <a key={platform.name} href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={platform.label} onClick={(e) => handleClick(e, platform)} className={`${iconBaseClass} ${colorful ? colorfulClasses[platform.color as keyof typeof colorfulClasses] : themeClasses}`}>
                    {platform.icon}
                </a>
            ))}
        </div>
    );
});
SocialIcons.displayName = 'SocialIcons';

// --- Komponen Dropdown Hosting yang telah disempurnakan ---
const HostingDropdownMenu = ({ isOpen, language, translations }: any) => {
    // Class untuk membuat menu lebih lebar dan profesional
    const dropdownClasses = `
        absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2
        w-screen max-w-4xl transform transition-all duration-300 ease-in-out
        origin-top z-50
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    `;

    const DropdownItem = ({ icon, title, description, href }: any) => (
        <Link
            href={href}
            className="group flex items-start gap-4 p-4 rounded-lg text-left transition-colors duration-200 hover:bg-orange-50 dark:hover:bg-gray-700 w-full"
        >
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center transition-colors duration-200 group-hover:bg-orange-500 group-hover:text-white">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-gray-800 dark:text-white transition-colors duration-200 group-hover:text-orange-600 dark:group-hover:text-orange-300">
                    {title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </Link>
    );

    return (
        <div className={dropdownClasses}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
                <div className="p-8 bg-gray-50 dark:bg-gray-900/50 col-span-1 hidden md:flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {translations[language].hostingMegaMenuTitle}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {translations[language].hostingMegaMenuDescription}
                    </p>
                </div>
                <div className="md:col-span-2 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DropdownItem
                        icon={<Server size={24}/>}
                        title={translations[language].webHosting}
                        description={translations[language].webHostingMegaMenuDesc}
                        href="/web-hosting"
                    />
                    <DropdownItem
                        icon={<Power size={24}/>}
                        title={translations[language].wordpressHosting}
                        description={translations[language].wordpressHostingMegaMenuDesc}
                        href="/wordpress-hosting"
                    />
                    <DropdownItem
                        icon={<Cloud size={24}/>}
                        title={translations[language].cloudHosting}
                        description={translations[language].cloudHostingMegaMenuDesc}
                        href="/cloud-hosting"
                    />
                </div>
            </div>
        </div>
    );
};

export const GamificationHeader = () => {
    const [gamificationState, setGamificationState] = useState({
        isNftActivated: false,
        points: 0,
        badge: { name: 'Newcomer' }
    });

    useEffect(() => {
        const updateState = () => {
            const storedState = localStorage.getItem('gamificationState');
            if (storedState) {
                try {
                    const parsedState = JSON.parse(storedState);
                    // Ensure badge object exists
                    if (!parsedState.badge) {
                        parsedState.badge = { name: 'Newcomer' };
                    }
                    setGamificationState(parsedState);
                } catch (error) {
                    console.error('Error parsing gamification state:', error);
                    // Reset to default state if parsing fails
                    setGamificationState({
                        isNftActivated: false,
                        points: 0,
                        badge: { name: 'Newcomer' }
                    });
                }
            }
        }
        updateState();
        window.addEventListener('storage', updateState);
        return () => window.removeEventListener('storage', updateState);
    }, []);

    if (!gamificationState.isNftActivated) return null;

    const badgeInfo = findBadgeInfo(gamificationState.badge?.name || 'Newcomer');
    const BadgeIcon = getIconByTierName(badgeInfo?.icon) || Gem;

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white p-2 shadow-md">
            <div className="container mx-auto flex justify-center items-center gap-4 text-sm font-bold">
                <div className="flex items-center gap-2 bg-yellow-400/20 text-yellow-600 dark:text-yellow-300 px-3 py-1 rounded-full">
                    <DollarSign size={16} className="text-yellow-500" />
                    <span>{gamificationState.points.toLocaleString('en-US')}</span>
                </div>
                {gamificationState.badge && badgeInfo && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${badgeInfo.bg}`}>
                        <BadgeIcon size={16} className={badgeInfo.color} />
                        <span className={badgeInfo.color}>{badgeInfo.name}</span>
                    </div>
                )}
                 <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full animate-pulse">
                    <span>NFT Mining Active!</span>
                </div>
            </div>
        </div>
    );
};

// Komponen Header Aplikasi
export const AppHeader = ({ translations, currencies, initialTheme }: any) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHostingMenuOpen, setIsHostingMenuOpen] = useState(false);
    const [isHostingSubMenuOpen, setIsHostingSubMenuOpen] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const language = 'en'; // Hardcoded to English
    const [currency, setCurrency] = useState(currencies.find((c: any) => c.key === 'USD'));
    const [theme, setTheme] = useState(initialTheme);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Load settings for brand logo
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/data');
                const data = await response.json();
                setSettings(data.settings);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);
    
    const onToggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    
    const baseSelectClass = "text-sm p-1 rounded-md bg-gray-200 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition";

    const navLinks = [
        { href: '/web-hosting', labelKey: 'hosting', dropdown: true, children: [
            { href: '/web-hosting', labelKey: 'webHosting', icon: <Server size={24}/>, descriptionKey: 'webHostingMegaMenuDesc' },
            { href: '/wordpress-hosting', labelKey: 'wordpressHosting', icon: <Power size={24}/>, descriptionKey: 'wordpressHostingMegaMenuDesc' },
            { href: '/cloud-hosting', labelKey: 'cloudHosting', icon: <Cloud size={24}/>, descriptionKey: 'cloudHostingMegaMenuDesc' }
        ]},
        { href: '/vps', labelKey: 'vps'},
        { href: '/vpn', labelKey: 'vpn'},
        { href: '/domain', labelKey: 'domains'},
        { href: '/instant-pro-website', labelKey: 'instantProWebsite'},
        { href: '/coupons', labelKey: 'promotionalVouchers'},
        { href: '/request', labelKey: 'request'},
    ];
    
    const getLinkClass = (href: string, hasDropdown?: boolean) => {
        const isActive = pathname === href || (hasDropdown && isHostingMenuOpen) || (hasDropdown && (pathname === '/web-hosting' || pathname === '/wordpress-hosting' || pathname === '/cloud-hosting'));
        return `flex items-center text-lg font-medium transition-all duration-300 relative group ${
            isActive 
                ? 'text-orange-500 dark:text-orange-400 font-bold scale-110' 
                : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
        }`;
    };

    const BrandLogo = () => {
        const logoUrl = settings?.site_appearance?.brandLogoUrl;
        if (logoUrl) {
            return <Image src={logoUrl} alt="HostVoucher" width={180} height={40} className="h-10 w-auto object-contain" />;
        }
        return (
            <span className="text-3xl font-extrabold text-orange-600 hover:text-orange-500 transition-all duration-300 transform hover:scale-105">
                HostVoucher
            </span>
        );
    };

    return (
        <header className={`sticky top-0 z-50 shadow-sm py-0 transition-colors duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50`}>
            <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
                <Link href="/">
                    <BrandLogo />
                </Link>
                
                <div className="hidden lg:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <div key={link.href} className="relative py-4" onMouseEnter={link.dropdown ? () => setIsHostingMenuOpen(true) : undefined} onMouseLeave={link.dropdown ? () => setIsHostingMenuOpen(false) : undefined}>
                           <Link href={link.href} className={getLinkClass(link.href, link.dropdown)}>
                                {translations[language][link.labelKey]}
                                {link.dropdown && <ChevronDownIcon />}
                           </Link>
                           {link.dropdown && <HostingDropdownMenu isOpen={isHostingMenuOpen} language={language} translations={translations} />}
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-4">
                     <div className="relative hidden md:block">
                        <input
                            type="search"
                            placeholder={translations[language]?.searchPlaceholder || "Search..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`px-4 py-2 pl-10 rounded-full border-2 transition-all duration-300 w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white`}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                           <SearchIcon />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CurrencyToggle variant="compact" showLabel={false} />
                         <button onClick={onToggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300" aria-label="Toggle dark mode">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>

                    <button className="lg:hidden focus:outline-none text-gray-800 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open mobile menu">
                        <MenuIcon/>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            if (link.dropdown) {
                                return (
                                    <div key={link.href}>
                                        <button
                                            onClick={() => setIsHostingSubMenuOpen(!isHostingSubMenuOpen)}
                                            className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <span className="hover:text-orange-500">{translations[language][link.labelKey]}</span>
                                            <ChevronDownIcon />
                                        </button>
                                        <AnimatePresence>
                                        {isHostingSubMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-3"
                                            >
                                                {link.children?.map(child => (
                                                    <Link key={child.href} href={child.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        {translations[language][child.labelKey]}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }
                            return (
                                <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {translations[language][link.labelKey]}
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

const FooterLinkColumn = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ul className="space-y-2">
            {links.map(link => (
                 <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

// Donation Section Component
const DonationSection = ({ siteAppearance }: any) => {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        // Fetch full settings for charitable donation
        getSiteSettings().then(fullSettings => {
            setSettings(fullSettings);
        }).catch(error => {
            console.error('Failed to load settings for donation:', error);
        });
    }, []);

    if (!settings) return null;

    return <CharitableDonationDisplay settings={settings} />;
};

export const Footer = ({ translations }: any) => {
    const language = 'en'; // Hardcoded to English
    const { toast } = useToast();
    const [siteAppearance, setSiteAppearance] = useState(null);

    useEffect(() => {
        // Fetch site settings for specialist image and donation settings
        getSiteSettings().then(settings => {
            setSiteAppearance(settings.site_appearance || settings.siteAppearance);
        }).catch(error => {
            console.error('Failed to load site settings:', error);
        });
    }, []);

    if (!translations || !translations[language]) return null;
    
    const handleSocialClick = (platform: string) => {
        // Dummy function as settings are not passed
        console.log(`Clicked on ${platform}`);
    };
    
    const handleSubscribe = async (email: string) => {
        if (!email) {
            toast({ title: "Email required", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }
        try {
            await apiClient.subscribeToNewsletter(email);
            toast({ title: "Subscribed!", description: "You are now on the list for exclusive deals." });
        } catch (error: any) {
            console.error("Newsletter subscription error:", error);
            toast({ title: "Subscription Failed", description: "Could not subscribe. Please try again later.", variant: "destructive" });
        }
    };

    const sitemapLinks = {
        hosting: [
            { href: '/web-hosting', label: 'Web Hosting' },
            { href: '/wordpress-hosting', label: 'WordPress Hosting' },
            { href: '/cloud-hosting', label: 'Cloud Hosting' },
        ],
        security: [
             { href: '/vps', label: 'VPS' },
            { href: '/vpn', label: 'VPN' },
            { href: '/domain', label: 'Domains' },
        ],
        company: [
            { href: '/instant-pro-website', label: 'Instant Pro Website' },
            { href: '/coupons', label: 'Coupons' },
            { href: '/request', label: 'Request & Submit' },
            { href: '/blog', label: 'Blog' },
            { href: '/landing', label: 'About Us' },
        ]
    };


    return (
        <footer className={`py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800`}>
            <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                     <div className="lg:col-span-2">
                        <NewsletterForm
                            language={language}
                            translations={translations}
                            onSubscribe={handleSubscribe}
                        />
                     </div>
                     <FooterLinkColumn title="Hosting Services" links={sitemapLinks.hosting} />
                     <FooterLinkColumn title="Security & Domains" links={sitemapLinks.security} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
                     <div className="lg:col-span-2">
                         <EditorProfile siteAppearance={siteAppearance} translations={translations} />
                     </div>
                      <FooterLinkColumn title="Company" links={sitemapLinks.company} />
                 </div>

                 {/* Donation Section */}
                 <div className="mt-12">
                     <DonationSection siteAppearance={siteAppearance} />
                 </div>
                 <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                     <div className="mb-4">
                         <SocialIcons onSocialClick={handleSocialClick} />
                     </div>
                     <p className={`text-sm text-gray-500 dark:text-gray-400`}>
                         © {new Date().getFullYear()} HostVoucher. {translations[language].footerRights}
                     </p>
                 </div>
            </div>
        </footer>
    );
};

export const GlobalShareButton = ({ translations, settings }: any) => {
    const { toast } = useToast();
    const language = 'en';

    const onShare = (platformName: string) => {
        const gamificationSettings = settings?.gamificationPoints || {};
        const pointsToAward = gamificationSettings.socialShare || 5; 
        const cooldownHours = gamificationSettings.shareCooldownHours || 24;

        const currentState = JSON.parse(localStorage.getItem('gamificationState') || '{}');
        if(!currentState.isNftActivated) {
            toast({
               title: "Mining Not Active",
               description: "Please activate NFT mining first to earn points.",
               variant: 'destructive',
           });
           return;
        }

        const now = Date.now();
        const timestamps = JSON.parse(localStorage.getItem('socialShareTimestamps') || '{}');
        const lastClicked = timestamps[platformName] || 0;
        const cooldownMs = (cooldownHours || 0) * 60 * 60 * 1000;
        
        if (cooldownHours === 0 || (now - lastClicked > cooldownMs)) {
            timestamps[platformName] = now;
            localStorage.setItem('socialShareTimestamps', JSON.stringify(timestamps));

            const currentState = JSON.parse(localStorage.getItem('gamificationState') || '{}');
            const newState = { ...currentState, points: (currentState.points || 0) + pointsToAward };
            localStorage.setItem('gamificationState', JSON.stringify(newState));
            
            toast({
                title: "Task verification pending.",
                description: "NFT points will be voided if the task is not completed.",
            });
            window.dispatchEvent(new Event('storage'));
        } else {
             toast({
                title: "Share on Cooldown",
                description: `You can share on ${platformName} again later.`,
            });
        }
    };

    return (
        <div className="fixed top-24 right-4 z-50">
           <CircularShareButton 
                item={{
                    link: 'https://hostvoucher.com',
                    name: 'HostVoucher.com',
                    provider: 'HostVoucher'
                }} 
                onShare={onShare}
                position="global"
            />
        </div>
    );
};

export const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-5 right-20 w-12 h-12 bg-gray-700/50 dark:bg-gray-800/50 backdrop-blur-sm text-white rounded-full shadow-2xl z-[60] flex items-center justify-center hover:bg-gray-800 transition-transform transform hover:scale-110"
                    style={{width: '2.66rem', height: '2.66rem'}}
                    aria-label="Back to top"
                >
                    <ChevronUpIcon />
                </motion.button>
            )}
        </AnimatePresence>
    );
};
