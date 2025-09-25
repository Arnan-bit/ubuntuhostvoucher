// src/lib/visitor-tracking.ts

interface VisitorData {
    ip_address?: string;
    country?: string;
    country_code?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
    user_agent: string;
    browser: string;
    browser_version: string;
    os: string;
    os_version: string;
    device_type: string;
    device_brand?: string;
    device_model?: string;
    referrer: string;
    landing_page: string;
    session_id: string;
    is_mobile: boolean;
    screen_resolution: string;
    language: string;
}

interface PageViewData {
    visitor_id: string;
    session_id: string;
    page_url: string;
    page_title: string;
    referrer: string;
    time_on_page?: number;
    scroll_depth?: number;
    clicks_count?: number;
}

class VisitorTracker {
    private visitorId: string | null = null;
    private sessionId: string;
    private startTime: number;
    private maxScrollDepth: number = 0;
    private clickCount: number = 0;
    private isTracking: boolean = false;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.setupEventListeners();
    }

    private generateSessionId(): string {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private async getLocationData(): Promise<Partial<VisitorData>> {
        try {
            // Try to get location from IP geolocation service
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                return {
                    ip_address: data.ip,
                    country: data.country_name,
                    country_code: data.country_code,
                    region: data.region,
                    city: data.city,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timezone: data.timezone,
                    isp: data.org
                };
            }
        } catch (error) {
            console.warn('Could not fetch location data:', error);
        }
        return {};
    }

    private getDeviceInfo(): Partial<VisitorData> {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        // Simple browser detection
        let browser = 'Unknown';
        let browserVersion = '';
        
        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.includes('Safari')) {
            browser = 'Safari';
            browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
            browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
        }

        // Simple OS detection
        let os = 'Unknown';
        let osVersion = '';
        
        if (userAgent.includes('Windows')) {
            os = 'Windows';
            osVersion = userAgent.match(/Windows NT ([0-9.]+)/)?.[1] || '';
        } else if (userAgent.includes('Mac')) {
            os = 'macOS';
            osVersion = userAgent.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
        } else if (userAgent.includes('Linux')) {
            os = 'Linux';
        } else if (userAgent.includes('Android')) {
            os = 'Android';
            osVersion = userAgent.match(/Android ([0-9.]+)/)?.[1] || '';
        } else if (userAgent.includes('iOS')) {
            os = 'iOS';
            osVersion = userAgent.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
        }

        return {
            user_agent: userAgent,
            browser,
            browser_version: browserVersion,
            os,
            os_version: osVersion,
            device_type: isMobile ? 'Mobile' : 'Desktop',
            is_mobile: isMobile,
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
    }

    private setupEventListeners(): void {
        // Track scroll depth
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);
        });

        // Track clicks
        document.addEventListener('click', () => {
            this.clickCount++;
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.trackPageView();
        });

        // Track visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackPageView();
            }
        });
    }

    public async initializeTracking(): Promise<void> {
        if (this.isTracking) return;
        
        try {
            const locationData = await this.getLocationData();
            const deviceInfo = this.getDeviceInfo();
            
            const visitorData: VisitorData = {
                ...locationData,
                ...deviceInfo,
                referrer: document.referrer,
                landing_page: window.location.href,
                session_id: this.sessionId
            };

            const response = await fetch('/api/analytics/track-visitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorData)
            });

            if (response.ok) {
                const result = await response.json();
                this.visitorId = result.visitor_id;
                this.isTracking = true;
                
                // Track initial page view
                this.trackPageView();
            }
        } catch (error) {
            console.error('Failed to initialize visitor tracking:', error);
        }
    }

    public async trackPageView(): Promise<void> {
        if (!this.visitorId) return;

        const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
        
        const pageViewData: PageViewData = {
            visitor_id: this.visitorId,
            session_id: this.sessionId,
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer,
            time_on_page: timeOnPage,
            scroll_depth: this.maxScrollDepth,
            clicks_count: this.clickCount
        };

        try {
            await fetch('/api/analytics/track-pageview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pageViewData)
            });
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }

    public trackEvent(eventName: string, eventData: any = {}): void {
        // Custom event tracking can be implemented here
        console.log('Custom event tracked:', eventName, eventData);
    }
}

// Global tracker instance
let tracker: VisitorTracker | null = null;

export const initializeVisitorTracking = (): void => {
    if (typeof window !== 'undefined' && !tracker) {
        tracker = new VisitorTracker();
        tracker.initializeTracking();
    }
};

export const trackPageView = (): void => {
    if (tracker) {
        tracker.trackPageView();
    }
};

export const trackEvent = (eventName: string, eventData: any = {}): void => {
    if (tracker) {
        tracker.trackEvent(eventName, eventData);
    }
};

export default VisitorTracker;
