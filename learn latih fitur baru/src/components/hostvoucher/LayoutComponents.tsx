

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BotIcon, SendIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon, SearchIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from './IconComponents';
import { CircularShareButton, usePointMining, NewsletterForm } from './UIComponents';
import { useRouter, usePathname } from 'next/navigation';
import { DollarSign, Trophy, Medal, Gem, Share2, Edit, Check, Server, Power, Cloud, Home, Instagram, MessageCircle, Twitter, Facebook, Youtube, Linkedin, Twitch, Shell, Dribbble } from 'lucide-react';
import { currencyData, translations as allTranslations, getSiteSettings } from '@/lib/hostvoucher-data';
import {
    getIconByTierName,
    findBadgeInfo
} from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import * as apiClient from '@/lib/api-client';
import { badgeTiers } from '@/lib/data';

const EditorProfile = ({ siteAppearance, translations }: any) => {
    const language = 'en';
    if (!translations?.[language] || !siteAppearance) return null;

    return (
        <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">{translations[language].editorProfileTitle}</h3>
             <Link href="/landing" passHref>
                <div className="relative w-32 h-32 mx-auto md:mx-0 cursor-pointer group">
                  <Image
                      src={siteAppearance?.specialistImageUrl || "https://placehold.co/128x128.png"}
                      alt="Editor Profile"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint="man portrait"
                  />
                </div>
            </Link>
             <Link href="/landing" passHref>
                <h4 className="text-lg font-semibold cursor-pointer hover:text-orange-500 mt-4">Ah Nakamoto</h4>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto md:mx-0">{translations[language].editorProfileDescription.replace('Satoshi', 'Ah')}</p>
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
        { name: 'TikTok', href: 'https://tiktok.com/@hostvoucher', label: 'TikTok', icon: <Shell />, color: 'tiktok' },
        { name: 'Facebook', href: 'https://facebook.com/hostvoucher', label: 'Facebook', icon: <Facebook />, color: 'facebook' },
        { name: 'Instagram', href: 'https://instagram.com/hostvoucher', label: 'Instagram', icon: <Instagram />, color: 'instagram' },
        { name: 'X.com', href: 'https://x.com/hostvoucher', label: 'X (Twitter)', icon: <Twitter />, color: 'x' },
        { name: 'Discord', href: 'https://discord.com/invite/3S72qZkuay', label: 'Discord', icon: <Dribbble />, color: 'discord' },
        { name: 'Telegram', href: 'https://t.me/hostvoucher', label: 'Telegram', icon: <svg role="img" viewBox="0 0 24 24" fill="currentColor"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.62 5.813c.267-1.417-.481-2.01-1.527-1.527L2.433 9.245c-1.417.481-1.417 1.149 0 1.488l4.828 1.501 1.43 4.945z"/></svg>, color: 'telegram' },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/hostvoucher', label: 'LinkedIn', icon: <Linkedin />, color: 'linkedin' },
        { name: 'Threads', href: 'https://threads.net/@hostvoucher', label: 'Threads', icon: <svg role="img" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9.78a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44zm0-1.3A3.52 3.52 0 1 1 8.48 12 3.52 3.52 0 0 1 12 8.48zm5.6-2.42c-.23-.9-1.04-1.6-1.93-1.72a5.8 5.8 0 0 0-1.28-.1H9.6a5.8 5.8 0 0 0-1.28.1C7.42 4.46 6.6 5.16 6.38 6.06c-.1.4-.13.82-.13 1.24v1.23a3.8 3.8 0 0 0-.58.12 1.94 1.94 0 0 0-1.12 1.3 2 2 0 0 0 .42 2.1c.4.45.98.6 1.57.54.1-.4.22-.8.36-1.18a3.5 3.5 0 0 1 1.1-1.92A3.5 3.5 0 0 1 9.6 8.58v-1.3c0-.36.02-.73.08-1.08.06-.35.24-.7.56-1a1.2 1.2 0 0 1 1-.56h2.72c.36 0 .7.12 1 .34.3.22.48.5.56.88.06.35.08.72.08 1.08v1.3a3.5 3.5 0 0 1-1.6 2.8 3.5 3.5 0 0 1-1.9 1.1c-.4.1-.8.2-1.2.33.5.06 1 .24 1.48.54a3.5 3.5 0 0 1 1.9 2.76c.06.4.1.8.1 1.22v1.23c0 .42-.03.84-.1 1.24-.22.9-1.03 1.6-1.92 1.72-.4.08-.82.1-1.28.1H9.6c-.4 0-.8-.03-1.2-.1-.9-.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0-2.48c.15-.3.33-.58.55-.82.22-.24.5-.45.8-.62.3-.17.6-.3.9-.45v-1.7c0-.6.06-1.2.18-1.78a2.9 2.9 0 0 1 .52-1.22c.1-.17.2-.33.32-.48a.7.7,0,0,1,.1-.12c.1-.1.2-.18.3-.26h.12c.1-.1.2-.15.3-.2a1,1,0,0,1,.2-.1zm-1.8,9.54c.23.9,1.04,1.6,1.93,1.72.4.08.82.1,1.28.1h2.72c.4,0,.8-.03,1.2-.1.9-.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0-2.48c-.22-.9-1.03-1.6-1.92-1.72a5.8 5.8 0 0 0-1.28-.1H9.6a5.8 5.8 0 0 0-1.28.1c-.9.12-1.7-.8-1.9,1.62a3.8,3.8,0,0,0,0,2.48z"/></svg>, color: 'threads' },
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
                const parsedState = JSON.parse(storedState);
                setGamificationState(parsedState);
            }
        }
        updateState();
        window.addEventListener('storage', updateState);
        return () => window.removeEventListener('storage', updateState);
    }, []);

    if (!gamificationState.isNftActivated) return null;

    const badgeInfo = findBadgeInfo(gamificationState.badge.name);
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

    useEffect(() => {
        getSiteSettings().then(setSettings);
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
                        <select 
                             value={currency.key} 
                             onChange={e => setCurrency(currencies.find((c:any) => c.key === e.target.value))} 
                             className={baseSelectClass} 
                             aria-label="Select Currency"
                        >
                            {currencies.map((c:any) => <option key={c.key} value={c.key}>{c.code}</option>)}
                        </select>
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

export const Footer = ({ translations }: any) => {
    const language = 'en'; // Hardcoded to English
    const { toast } = useToast();
     const [settings, setSettings] = useState<any>({ site_appearance: {} });

    useEffect(() => {
        getSiteSettings().then(setSettings);
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
                         <EditorProfile siteAppearance={settings.site_appearance} translations={translations} />
                     </div>
                      <FooterLinkColumn title="Company" links={sitemapLinks.company} />
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
