'use client';

import React from 'react';

// Simple placeholder component for GlobalGamificationWidget
const GlobalGamificationWidget = () => {
    return null; // Return null to render nothing
};

// Hook for auto gamification
export const useAutoGamification = () => {
    return {
        isActive: false,
        points: 0,
        level: 1
    };
};

export default GlobalGamificationWidget;
