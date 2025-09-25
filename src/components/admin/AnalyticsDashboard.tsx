'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Users, Eye, Smartphone, Monitor, MapPin, Clock, TrendingUp, Activity } from 'lucide-react';
import * as dataApi from '@/lib/hostvoucher-data';

interface AnalyticsData {
    total_visitors: number;
    today_visitors: number;
    week_visitors: number;
    top_countries: Array<{ country: string; country_code: string; count: number }>;
    top_browsers: Array<{ browser: string; count: number }>;
    device_stats: Array<{ device_type: string; count: number }>;
}

interface RealtimeVisitor {
    country: string;
    country_code: string;
    city: string;
    browser: string;
    device_type: string;
    landing_page: string;
    visited_at: string;
    is_mobile: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }: any) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <p className={`text-2xl font-bold text-${color}-400 mt-1`}>{value}</p>
                {trend && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                        <TrendingUp size={12} />
                        {trend}
                    </p>
                )}
            </div>
            <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
        </div>
    </div>
);

const CountryFlag = ({ countryCode }: { countryCode: string }) => (
    <img 
        src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
        alt={countryCode}
        className="w-6 h-4 rounded-sm"
        onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
        }}
    />
);

const RealtimeVisitorCard = ({ visitor }: { visitor: RealtimeVisitor }) => (
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
        <div className="flex items-center gap-3">
            <CountryFlag countryCode={visitor.country_code} />
            <div>
                <p className="text-white text-sm font-medium">
                    {visitor.city}, {visitor.country}
                </p>
                <p className="text-slate-400 text-xs">
                    {visitor.browser} • {visitor.device_type}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-slate-400 text-xs">
                {new Date(visitor.visited_at).toLocaleTimeString()}
            </p>
            <div className="flex items-center gap-1 mt-1">
                {visitor.is_mobile ? (
                    <Smartphone className="w-3 h-3 text-blue-400" />
                ) : (
                    <Monitor className="w-3 h-3 text-green-400" />
                )}
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [realtimeVisitors, setRealtimeVisitors] = useState<RealtimeVisitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [summary, realtime] = await Promise.all([
                    dataApi.fetchData('analytics_summary'),
                    dataApi.fetchData('realtime_visitors')
                ]);
                
                setAnalyticsData(summary);
                setRealtimeVisitors(realtime);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();

        // Refresh realtime data every 2 minutes (reduced from 30 seconds)
        const interval = setInterval(async () => {
            try {
                // Only fetch if the component is still visible
                if (document.visibilityState === 'visible') {
                    const realtime = await dataApi.fetchData('realtime_visitors');
                    setRealtimeVisitors(realtime);
                }
            } catch (error) {
                console.error('Failed to refresh realtime data:', error);
            }
        }, 120000); // 2 minutes instead of 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Failed to load analytics data</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Visitor Analytics</h2>
                <div className="flex items-center gap-2 text-green-400">
                    <Activity size={16} />
                    <span className="text-sm">Live Data</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Visitors"
                    value={analyticsData.total_visitors.toLocaleString()}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Today's Visitors"
                    value={analyticsData.today_visitors.toLocaleString()}
                    icon={Eye}
                    color="green"
                />
                <StatCard
                    title="This Week"
                    value={analyticsData.week_visitors.toLocaleString()}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Online Now"
                    value={realtimeVisitors.length}
                    icon={Activity}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Globe size={20} />
                        Top Countries
                    </h3>
                    <div className="space-y-3">
                        {analyticsData.top_countries.slice(0, 8).map((country, index) => (
                            <div key={country.country_code} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400 text-sm w-4">{index + 1}</span>
                                    <CountryFlag countryCode={country.country_code} />
                                    <span className="text-white">{country.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-slate-700 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${(country.count / analyticsData.top_countries[0].count) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-slate-300 text-sm w-12 text-right">
                                        {country.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device & Browser Stats */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Device & Browser Stats</h3>
                    
                    <div className="mb-6">
                        <h4 className="text-slate-300 font-medium mb-3">Device Types</h4>
                        <div className="space-y-2">
                            {analyticsData.device_stats.map((device) => (
                                <div key={device.device_type} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {device.device_type === 'Mobile' ? (
                                            <Smartphone className="w-4 h-4 text-blue-400" />
                                        ) : (
                                            <Monitor className="w-4 h-4 text-green-400" />
                                        )}
                                        <span className="text-white">{device.device_type}</span>
                                    </div>
                                    <span className="text-slate-300">{device.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-300 font-medium mb-3">Top Browsers</h4>
                        <div className="space-y-2">
                            {analyticsData.top_browsers.map((browser) => (
                                <div key={browser.browser} className="flex items-center justify-between">
                                    <span className="text-white">{browser.browser}</span>
                                    <span className="text-slate-300">{browser.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Marketing Insights */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Marketing Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-slate-300 font-medium mb-2">Top Traffic Sources</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-white">Direct</span>
                                <span className="text-blue-400">45%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">Google</span>
                                <span className="text-green-400">32%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">Social Media</span>
                                <span className="text-purple-400">23%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-slate-300 font-medium mb-2">Conversion Rates</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-white">Click-through</span>
                                <span className="text-green-400">12.5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">Sign-ups</span>
                                <span className="text-blue-400">3.2%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">Purchases</span>
                                <span className="text-orange-400">1.8%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-slate-300 font-medium mb-2">Peak Hours</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-white">9:00 - 11:00</span>
                                <span className="text-green-400">High</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">14:00 - 16:00</span>
                                <span className="text-blue-400">Medium</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">20:00 - 22:00</span>
                                <span className="text-purple-400">High</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Realtime Visitors */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin size={20} />
                        Live Visitors (Last 30 minutes)
                    </h3>
                    <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">{realtimeVisitors.length} online</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {realtimeVisitors.length > 0 ? (
                        realtimeVisitors.map((visitor, index) => (
                            <RealtimeVisitorCard key={index} visitor={visitor} />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-8 text-slate-400">
                            No visitors in the last 30 minutes
                        </div>
                    )}
                </div>
            </div>

            {/* Ad Targeting Recommendations */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Ad Targeting Recommendations</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-slate-300 font-medium mb-3">Recommended Target Countries</h4>
                        <div className="space-y-3">
                            {analyticsData.top_countries.slice(0, 5).map((country, index) => (
                                <div key={country.country_code} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CountryFlag countryCode={country.country_code} />
                                        <div>
                                            <p className="text-white font-medium">{country.country}</p>
                                            <p className="text-slate-400 text-sm">{country.count} visitors</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-medium">High ROI</p>
                                        <p className="text-slate-400 text-xs">Recommended</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-300 font-medium mb-3">Device & Platform Insights</h4>
                        <div className="space-y-3">
                            {analyticsData.device_stats.map((device, index) => (
                                <div key={device.device_type} className="p-3 bg-slate-700/30 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {device.device_type === 'Mobile' ? (
                                                <Smartphone className="w-4 h-4 text-blue-400" />
                                            ) : (
                                                <Monitor className="w-4 h-4 text-green-400" />
                                            )}
                                            <span className="text-white font-medium">{device.device_type}</span>
                                        </div>
                                        <span className="text-slate-300">{device.count} users</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {device.device_type === 'Mobile'
                                            ? '📱 Focus on mobile-optimized ads and responsive design'
                                            : '💻 Target with detailed product information and comparisons'
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
