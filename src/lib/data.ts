import { Medal, Trophy, Gem, Shield, Crown, Rocket, ImageIcon, Star, MessageCircle } from 'lucide-react';

export const badgeTiers: any = {
    daily: [
        { name: 'Perunggu Harian', threshold: 10, Icon: Medal, color: 'text-amber-700', bg: 'bg-amber-700/10' },
        { name: 'Perak Harian', threshold: 25, Icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { name: 'Emas Harian', threshold: 50, Icon: Medal, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Platinum Harian', threshold: 100, Icon: Medal, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { name: 'Berlian Harian', threshold: 200, Icon: Medal, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Master Harian', threshold: 350, Icon: Medal, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { name: 'Grandmaster Harian', threshold: 500, Icon: Medal, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { name: 'Juara Harian', threshold: 750, Icon: Medal, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { name: 'Legenda Harian', threshold: 1000, Icon: Medal, color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Dewa Harian', threshold: 1500, Icon: Medal, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    ],
    monthly: [
        { name: 'Piala Besi Bulanan', threshold: 100, Icon: Trophy, color: 'text-slate-500', bg: 'bg-slate-500/10' },
        { name: 'Piala Perunggu Bulanan', threshold: 250, Icon: Trophy, color: 'text-amber-700', bg: 'bg-amber-700/10' },
        { name: 'Piala Perak Bulanan', threshold: 500, Icon: Trophy, color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { name: 'Piala Emas Bulanan', threshold: 1000, Icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Piala Kristal Bulanan', threshold: 2000, Icon: Trophy, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { name: 'Piala Safir Bulanan', threshold: 3500, Icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Piala Ruby Bulanan', threshold: 5000, Icon: Trophy, color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Piala Zamrud Bulanan', threshold: 7500, Icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Piala Obsidian Bulanan', threshold: 10000, Icon: Trophy, color: 'text-gray-300', bg: 'bg-gray-300/10' },
        { name: 'Piala Legendaris', threshold: 15000, Icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ],
    seasonal: [ 
        { name: 'Perisai Musim Semi', threshold: 500, Icon: Shield, color: 'text-green-400', bg: 'bg-green-400/10' },
        { name: 'Mahkota Musim Panas', threshold: 1000, Icon: Crown, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { name: 'Roket Musim Gugur', threshold: 2000, Icon: Rocket, color: 'text-amber-600', bg: 'bg-amber-600/10' },
        { name: 'Perisai Musim Dingin', threshold: 4000, Icon: Shield, color: 'text-sky-400', bg: 'bg-sky-400/10' },
        { name: 'Mahkota Badai Pasir', threshold: 6000, Icon: Crown, color: 'text-yellow-300', bg: 'bg-yellow-300/10' },
        { name: 'Roket Laut Dalam', threshold: 8000, Icon: Rocket, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        { name: 'Perisai Hutan Belantara', threshold: 10000, Icon: Shield, color: 'text-lime-500', bg: 'bg-lime-500/10' },
        { name: 'Mahkota Magma', threshold: 15000, Icon: Crown, color: 'text-red-600', bg: 'bg-red-600/10' },
        { name: 'Roket Aurora', threshold: 20000, Icon: Rocket, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        { name: 'Mahkota Kosmik', threshold: 30000, Icon: Crown, color: 'text-indigo-400', bg: 'bg-indigo-400/10', isEpic: true },
    ],
    yearly: [
        { name: 'Permata Tahunan', threshold: 5000, Icon: Gem, color: 'text-teal-400', bg: 'bg-teal-400/10' },
        { name: 'Safir Tahunan', threshold: 10000, Icon: Gem, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Zamrud Tahunan', threshold: 20000, Icon: Gem, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Ruby Tahunan', threshold: 35000, Icon: Gem, color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Amethyst Tahunan', threshold: 50000, Icon: Gem, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Topaz Tahunan', threshold: 75000, Icon: Gem, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { name: 'Opal Tahunan', threshold: 100000, Icon: Gem, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { name: 'Berlian Hitam Tahunan', threshold: 150000, Icon: Gem, color: 'text-slate-300', bg: 'bg-slate-300/10' },
        { name: 'Berlian Pelangi Tahunan', threshold: 200000, Icon: Gem, color: 'text-cyan-300', bg: 'bg-cyan-300/10' },
        { name: 'Permata Abadi', threshold: 300000, Icon: Gem, color: 'text-rose-400', bg: 'bg-rose-400/10', isEpic: true },
    ],
    // Badge khusus yang tidak berdasarkan jumlah klik
    special: [
        { name: 'Screenshot Contributor', id: 'screenshot_contributor', Icon: ImageIcon, color: 'text-green-400', bg: 'bg-green-400/10', points: 25000000, description: 'Submits proof of purchase and usage.' },
        { name: 'Loyal Reviewer', id: 'loyal_reviewer', Icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10', points: 2500, description: 'Provides a rating after using a service.' }
    ]
};
