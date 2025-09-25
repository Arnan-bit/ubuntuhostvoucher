/**
 * Image utility functions for handling uploaded images and fallbacks
 */

// Professional placeholder images for different categories with branded designs
const professionalPlaceholders = {
    'Web Hosting': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'WordPress Hosting': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Cloud Hosting': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'VPS Hosting': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Dedicated Server': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Domain': 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'SSL Certificate': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'VPN': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Email Hosting': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Website Builder': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'CDN': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Backup Service': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Monitoring': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'Security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    'default': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
};

// Professional brand logos for different providers
const professionalBrandLogos = {
    'HostGator': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
    'Bluehost': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
    'SiteGround': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
    'GoDaddy': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
    'Namecheap': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
    'default': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center&auto=format&q=80'
};

export const getImageUrl = (imageUrl: string | null | undefined, fallback?: string): string => {
    // If no image URL provided, use fallback
    if (!imageUrl) {
        return fallback || '/placeholder-image.png';
    }

    // If it's already a local uploads path, return as-is
    if (imageUrl.startsWith('/uploads/')) {
        return imageUrl;
    }

    // If it's a full URL from hostvocher.com, convert to local path
    if (imageUrl.includes('hostvocher.com/uploads/images/')) {
        const filename = imageUrl.split('/').pop();
        return `/uploads/images/${filename}`;
    }

    // If it's a full URL from hostvoucher.com, convert to local path
    if (imageUrl.includes('hostvoucher.com/uploads/images/')) {
        const filename = imageUrl.split('/').pop();
        return `/uploads/images/${filename}`;
    }

    // If it's an external URL (i.ibb.co, placehold.co, etc.), return as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's just a filename, construct local path
    if (!imageUrl.includes('/')) {
        return `/uploads/images/${imageUrl}`;
    }

    // Default fallback
    return fallback || imageUrl;
};

/**
 * Get professional placeholder image based on product type
 */
export const getProfessionalPlaceholder = (type: string): string => {
    return professionalPlaceholders[type as keyof typeof professionalPlaceholders] || professionalPlaceholders.default;
};

/**
 * Get professional brand logo based on provider
 */
export const getProfessionalBrandLogo = (provider: string): string => {
    return professionalBrandLogos[provider as keyof typeof professionalBrandLogos] || professionalBrandLogos.default;
};

export const getProductImage = (product: any): string => {
    const imageUrl = product.catalog_image || product.image || product.image_url;

    // Use professional placeholder based on product type
    const professionalFallback = getProfessionalPlaceholder(product.type || 'default');

    // If no custom image, use professional placeholder
    if (!imageUrl) {
        return professionalFallback;
    }

    return getImageUrl(imageUrl, professionalFallback);
};

export const getTestimonialImage = (testimonial: any): string => {
    const imageUrl = testimonial.image_url || testimonial.imageUrl;

    // Special profile images for specific testimonials
    const specialProfiles: { [key: string]: string } = {
        'Sarah Johnson': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'Sarah Mills': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'Charlie Low': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'Jack Bies': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'Jhon Ortega': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        'Mike Chen': 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        'Elena Rodriguez': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        'David Kim': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        'Lisa Wang': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
        'Alex Thompson': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        'Maria Garcia': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
        'James Wilson': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        'Priya Patel': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
    };

    // Check if this testimonial has a special profile image
    const name = testimonial.name;
    if (name && specialProfiles[name]) {
        return specialProfiles[name];
    }

    // Use existing image if available
    if (imageUrl) {
        return getImageUrl(imageUrl, specialProfiles['Sarah Johnson']); // Default fallback
    }

    // Generate consistent avatar based on name hash
    const nameHash = name ? name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 1;
    const avatarId = (nameHash % 70) + 1;
    const fallback = `https://i.pravatar.cc/150?img=${avatarId}`;

    return fallback;
};

export const getBlogImage = (blog: any): string => {
    const imageUrl = blog.image_url || blog.imageUrl;
    const fallback = 'https://placehold.co/600x400.png?text=Blog+Post';
    
    return getImageUrl(imageUrl, fallback);
};

export const getBrandLogo = (product: any): string => {
    const logoUrl = product.brand_logo || product.provider_logo;

    // Use professional brand logo based on provider
    const professionalFallback = getProfessionalBrandLogo(product.provider || 'default');

    // If no custom logo, use professional placeholder
    if (!logoUrl) {
        return professionalFallback;
    }

    return getImageUrl(logoUrl, professionalFallback);
};

/**
 * Check if image needs unoptimized flag for Next.js Image component
 */
export const needsUnoptimized = (imageUrl: string): boolean => {
    // Local uploads don't need unoptimized flag since they're served by Next.js
    if (imageUrl.startsWith('/uploads/')) {
        return false;
    }

    // External URLs need unoptimized flag
    return imageUrl.includes('hostvocher.com') ||
           imageUrl.includes('hostvoucher.com') ||
           imageUrl.includes('i.ibb.co') ||
           imageUrl.includes('placehold.co') ||
           imageUrl.includes('localhost') ||
           imageUrl.startsWith('/api/image-proxy');
};

/**
 * Handle image error by setting fallback
 */
export const handleImageError = (e: any, fallbackUrl: string) => {
    e.target.onerror = null;
    e.target.src = fallbackUrl;
};

/**
 * Get optimized image props for Next.js Image component
 */
export const getImageProps = (imageUrl: string, alt: string, fallback?: string) => {
    const finalUrl = getImageUrl(imageUrl, fallback);
    
    return {
        src: finalUrl,
        alt: alt,
        unoptimized: needsUnoptimized(finalUrl),
        onError: (e: any) => handleImageError(e, fallback || 'https://placehold.co/300x200.png?text=Error')
    };
};
