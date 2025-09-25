// src/lib/api-client.ts

/**
 * A centralized client for making API requests to the application's backend.
 * This simplifies component logic and provides a single point for handling
 * API interactions, including error handling and data serialization.
 */

// A generic function for making POST requests to our action API.
async function action<T>(type: string, payload: any): Promise<T> {
    const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'API request failed');
    }

    return result.data;
}

// --- Product/Catalog Actions ---
export const saveProduct = (productData: any) => {
    return action('saveProduct', productData);
};

// --- Settings Actions ---
export const saveSettings = (settingsData: any) => {
    return action('saveSettings', settingsData);
};

export const deleteItem = (itemType: string, itemId: string) => {
    return action('deleteItem', { itemType, itemId });
};

export const deleteAll = (itemType: string) => {
    return action('deleteAll', { itemType });
};

// --- Testimonial Actions ---
export const saveTestimonial = (testimonialData: any) => {
    return action('saveTestimonial', testimonialData);
};

// --- Gamification Actions ---
export const awardNft = (userId: string) => {
    return action('awardNft', { userId });
};

export const adjustPoints = (userId: string, amount: number, reason: string) => {
    return action('adjustPoints', { userId, amount, reason });
};

// --- Public Form Submissions ---
export const submitVoucher = (voucherData: any) => {
    return action('submitVoucher', voucherData);
}

export const submitDealRequest = (requestData: any) => {
    return action('submitDealRequest', requestData);
}

export const submitNftShowcase = (nftData: any) => {
    return action('submitNftShowcase', nftData);
}

export const submitSiteTestimonial = (testimonialData: any) => {
    return action('submitSiteTestimonial', testimonialData);
}

export const submitProofOfPurchase = (proofData: any) => {
    return action('submitProofOfPurchase', proofData);
};

export const subscribeToNewsletter = (email: string) => {
    return action('subscribeToNewsletter', { email });
};

    