import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Medal, Trophy, Gem, Shield, Crown, Rocket, ImageIcon, Star } from 'lucide-react';
import { badgeTiers } from '@/lib/data';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getIconByTierName = (iconName: string) => {
    switch (iconName) {
        case 'Medal': return Medal;
        case 'Trophy': return Trophy;
        case 'Gem': return Gem;
        case 'Shield': return Shield;
        case 'Crown': return Crown;
        case 'Rocket': return Rocket;
        case 'ImageIcon': return ImageIcon;
        case 'Star': return Star;
        default: return Gem;
    }
}

export const findBadgeInfo = (badgeName: string) => {
    if (!badgeName) {
        return { name: 'Newcomer', icon: 'Gem', color: 'text-gray-400', bg: 'bg-gray-700' };
    }
    for (const tier of Object.values(badgeTiers) as any[][]) {
        const found = tier.find(b => b.name === badgeName);
        if (found) return found;
    }
    return { name: 'Newcomer', icon: 'Gem', color: 'text-gray-400', bg: 'bg-gray-700' };
};

export const getBadgesForUser = (user: any) => {
    const earnedBadges: any[] = [];
    const userPoints = user.points || 0;

    Object.keys(badgeTiers).forEach(period => {
        if (period === 'special') return;

        (badgeTiers as any)[period].forEach((badge: any) => {
            if (userPoints >= badge.threshold) {
                earnedBadges.push(badge);
            }
        });
    });

    const userBadges = user.badges || [];
    userBadges.forEach((badgeName: string) => {
        const badgeInfo = findBadgeInfo(badgeName);
        if (badgeInfo && !earnedBadges.some(b => b.name === badgeInfo.name)) {
            earnedBadges.push(badgeInfo);
        }
    });

    return earnedBadges;
};
    
