'use client';

import { useEffect } from 'react';
import { initializeVisitorTracking } from '@/lib/visitor-tracking';

export default function VisitorTrackingProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize visitor tracking when component mounts
        initializeVisitorTracking();
    }, []);

    return <>{children}</>;
}
