
// src/app/api/action/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Helper to make data JSON-serializable
const makeSerializable = (data: any): any => {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return data.toISOString();
    if (Array.isArray(data)) return data.map(makeSerializable);
    if (typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = makeSerializable(data[key]);
            }
        }
        return newObj;
    }
    return data;
};

// Main handler for POST requests
export async function POST(request: Request) {
    try {
        const { type, payload } = await request.json();

        switch (type) {
            case 'saveProduct':
                // Check for a special 'table' property to handle different tables
                if (payload.table === 'blog_posts') {
                    return await handleSaveBlogPost(payload);
                }
                if (payload.table === 'mining_tasks') {
                    return await handleSaveMiningTask(payload);
                }
                return await handleSaveProduct(payload);
            case 'reorderCatalog':
                return await handleReorderCatalog(payload);
            case 'saveSettings':
                return await handleSaveSettings(payload);
            case 'saveCurrencyRates':
                return await handleSaveCurrencyRates(payload);
            case 'saveTestimonial':
                return await handleSaveTestimonial(payload);
            case 'deleteItem':
                return await handleDeleteItem(payload);
            case 'deleteAll':
                 return await handleDeleteAll(payload);
            case 'awardNft':
                return await handleAwardNft(payload);
            case 'adjustPoints':
                return await handleAdjustPoints(payload);
            
            // Public form submissions
            case 'submitVoucher':
                return await handleSubmitVoucher(payload);
            case 'submitDealRequest':
                return await handleSubmitDealRequest(payload);
            case 'submitNftShowcase':
                return await handleSubmitNftShowcase(payload);
            case 'submitSiteTestimonial':
                return await handleSubmitSiteTestimonial(payload);
            case 'submitProofOfPurchase':
                 return await handleSubmitProof(payload);
            case 'subscribeToNewsletter':
                return await handleSubscribeToNewsletter(payload);


            default:
                return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
        }
    } catch (error: any) {
        console.error(`API Action Error:`, error);
        return NextResponse.json({ error: 'An internal server error occurred', details: error.message }, { status: 500 });
    }
}

// --- Handler Functions ---

async function handleSaveProduct(productData: any) {
    const { id, ...data } = productData;
    if (id) {
        // Update existing product
        const updateQuery = 'UPDATE products SET name=?, title=?, provider=?, type=?, tier=?, price=?, original_price=?, discount=?, features=?, link=?, target_url=?, image=?, provider_logo=?, rating=?, num_reviews=?, clicks=?, code=?, short_link=?, seo_title=?, seo_description=?, color=?, button_color=?, is_featured=?, show_on_landing=?, display_style=?, catalog_image=?, brand_logo=?, brand_logo_text=?, shake_animation=?, shake_intensity=? WHERE id=?';
        const values = [data.name, data.title, data.provider, data.type, data.tier, data.price, data.original_price, data.discount, JSON.stringify(data.features), data.link, data.target_url, data.image, data.provider_logo, data.rating, data.num_reviews, data.clicks, data.code, data.short_link, data.seo_title, data.seo_description, data.color, data.button_color, data.is_featured, data.show_on_landing, data.display_style, data.catalog_image, data.brand_logo, data.brand_logo_text, data.shake_animation, data.shake_intensity, id];
        await query({ query: updateQuery, values });
        return NextResponse.json({ data: { id } });
    } else {
        // Create new product
        const newId = uuidv4();
        const catalogNumberResult: any = await query({ query: 'SELECT MAX(catalog_number) as maxNum FROM products' });
        const newCatalogNumber = (catalogNumberResult[0]?.maxNum || 0) + 1;
        
        const insertQuery = 'INSERT INTO products (id, name, title, provider, type, tier, price, original_price, discount, features, link, target_url, image, provider_logo, rating, num_reviews, clicks, code, short_link, seo_title, seo_description, catalog_number, color, button_color, is_featured, show_on_landing, display_style, catalog_image, brand_logo, brand_logo_text, shake_animation, shake_intensity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [newId, data.name, data.title, data.provider, data.type, data.tier, data.price, data.original_price, data.discount, JSON.stringify(data.features), data.link, data.target_url, data.image, data.provider_logo, data.rating, data.num_reviews, data.clicks, data.code, data.short_link, data.seo_title, data.seo_description, newCatalogNumber, data.color, data.button_color, data.is_featured, data.show_on_landing, data.display_style, data.catalog_image, data.brand_logo, data.brand_logo_text, data.shake_animation, data.shake_intensity];
        await query({ query: insertQuery, values });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function handleSaveBlogPost(postData: any) {
    const { id, title, content, image_url, image_hint } = postData;
    if (id) {
        const updateQuery = 'UPDATE blog_posts SET title=?, content=?, image_url=?, image_hint=? WHERE id=?';
        await query({ query: updateQuery, values: [title, content, image_url, image_hint, id] });
        return NextResponse.json({ data: { id } });
    } else {
        const newId = uuidv4();
        const insertQuery = 'INSERT INTO blog_posts (id, title, content, image_url, image_hint) VALUES (?, ?, ?, ?, ?)';
        await query({ query: insertQuery, values: [newId, title, content, image_url, image_hint] });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function handleSaveMiningTask(taskData: any) {
    const { id, title, description, points, icon, enabled, cooldown, taskType, requirements } = taskData;
    if (id) {
        // Update existing task
        const updateQuery = 'UPDATE mining_tasks SET title=?, description=?, points=?, icon=?, enabled=?, cooldown=?, task_type=?, requirements=? WHERE id=?';
        const values = [title, description, points, icon, enabled || true, cooldown || 24, taskType || 'custom', JSON.stringify(requirements || []), id];
        await query({ query: updateQuery, values });
        return NextResponse.json({ data: { id } });
    } else {
        // Create new task
        const newId = uuidv4();
        const insertQuery = 'INSERT INTO mining_tasks (id, title, description, points, icon, enabled, cooldown, task_type, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [newId, title, description, points, icon, enabled || true, cooldown || 24, taskType || 'custom', JSON.stringify(requirements || [])];
        await query({ query: insertQuery, values });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function handleSaveCurrencyRates(payload: any) {
    // payload: { rates: Record<string, number>, lastUpdate: string }
    const settingsId = 'main_settings';
    const existing: any = await query({ query: "SELECT currency_rates FROM settings WHERE id = ?", values: [settingsId] });
    const current = existing?.[0]?.currency_rates ? JSON.parse(existing[0].currency_rates) : {};
    const merged = { ...current, ...payload };
    await query({ query: "UPDATE settings SET currency_rates = ? WHERE id = ?", values: [JSON.stringify(merged), settingsId] });
    return NextResponse.json({ data: { success: true } });
}

async function handleSaveSettings(settingsData: any) {
    const settingsId = 'main_settings'; // Hardcoded ID for the single settings row
    const { id, ...data } = settingsData; // id is ignored, we always use 'main_settings'

    console.log('Saving settings data:', JSON.stringify(data, null, 2));

    // Build page banners from individual page banner fields
    const pageBanners: any = {};
    const pages = ['home', 'landing', 'hosting', 'web-hosting', 'wordpress-hosting', 'cloud-hosting', 'vps', 'vpn', 'domains', 'promotional-vouchers'];

    pages.forEach(page => {
        const pageSlides = [];
        for (let i = 1; i <= 4; i++) {
            const slideData = {
                imageUrl: data[`${page}_banner_slide_${i}_image`] || '',
                title: data[`${page}_banner_slide_${i}_title`] || '',
                subtitle: data[`${page}_banner_slide_${i}_subtitle`] || '',
                buttonText: data[`${page}_banner_slide_${i}_button_text`] || '',
                buttonLink: data[`${page}_banner_slide_${i}_button_link`] || '',
                enabled: data[`${page}_banner_slide_${i}_enabled`] !== false
            };

            // Only add slide if it has content
            if (slideData.imageUrl || slideData.title || slideData.subtitle) {
                pageSlides.push(slideData);
            }
        }

        if (pageSlides.length > 0) {
            pageBanners[page] = {
                slides: pageSlides,
                rotationInterval: (data.rotation_interval || 8) * 1000 // Convert to milliseconds
            };
        }
    });

    // Serialize JSON fields and handle all appearance settings
    const siteAppearance = JSON.stringify({
        site_title: data.site_title,
        site_description: data.site_description,
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        banner_image: data.banner_image,
        banner_text: data.banner_text,
        footer_text: data.footer_text,
        specialistImageUrl: data.specialist_image_url,
        floatingPromoUrl: data.floating_promo_url,
        popupModalImageUrl: data.popup_modal_image_url,
        brandLogoUrl: data.logo_url,
        heroBackgroundImageUrl: data.banner_image,
        // Legacy banner support
        banner_slide_1_image: data.banner_slide_1_image,
        banner_slide_1_title: data.banner_slide_1_title,
        banner_slide_1_subtitle: data.banner_slide_1_subtitle,
        banner_slide_1_button_text: data.banner_slide_1_button_text,
        banner_slide_1_button_link: data.banner_slide_1_button_link,
        banner_slide_2_image: data.banner_slide_2_image,
        banner_slide_2_title: data.banner_slide_2_title,
        banner_slide_2_subtitle: data.banner_slide_2_subtitle,
        banner_slide_2_button_text: data.banner_slide_2_button_text,
        banner_slide_2_button_link: data.banner_slide_2_button_link,
        banner_slide_3_image: data.banner_slide_3_image,
        banner_slide_3_title: data.banner_slide_3_title,
        banner_slide_3_subtitle: data.banner_slide_3_subtitle,
        banner_slide_3_button_text: data.banner_slide_3_button_text,
        banner_slide_3_button_link: data.banner_slide_3_button_link,
        banner_slide_4_image: data.banner_slide_4_image,
        banner_slide_4_title: data.banner_slide_4_title,
        banner_slide_4_subtitle: data.banner_slide_4_subtitle,
        banner_slide_4_button_text: data.banner_slide_4_button_text,
        banner_slide_4_button_link: data.banner_slide_4_button_link,
        rotation_interval: data.rotation_interval,
        ...(data.site_appearance || {})
    });

    const pageBannersJson = JSON.stringify(pageBanners);
    const popupModal = JSON.stringify(data.popup_modal || {});
    const gamificationPoints = JSON.stringify(data.gamification_points || {});
    const idleSound = JSON.stringify(data.idle_sound || {});

    console.log('Page banners to save:', pageBannersJson);
    
    const updateQuery = `
        UPDATE settings SET
            ga_id = ?,
            fb_pixel_id = ?,
            require_eth_address = ?,
            nft_exchange_active = ?,
            idle_sound = ?,
            catalog_number_prefix = ?,
            site_appearance = ?,
            page_banners = ?,
            popup_modal = ?
        WHERE id = ?`;

    const values = [
        data.ga_id,
        data.fb_pixel_id,
        data.require_eth_address,
        data.nft_exchange_active,
        idleSound,
        data.catalog_number_prefix,
        siteAppearance,
        pageBannersJson,
        popupModal,
        settingsId
    ];

    console.log('Executing update query with values:', values);

    await query({ query: updateQuery, values });

    console.log('Settings saved successfully');
    return NextResponse.json({
        success: true,
        data: { id: settingsId },
        message: 'Settings saved successfully',
        pageBanners: pageBanners
    });
}


async function handleSaveTestimonial(testimonialData: any) {
    const { id, ...data } = testimonialData;
    if (id) {
        // Update
        const updateQuery = 'UPDATE testimonials SET name=?, role=?, review=?, image_url=?, rating=? WHERE id=?';
        await query({ query: updateQuery, values: [data.name, data.role, data.review, data.image_url, data.rating, id] });
        return NextResponse.json({ data: { id } });
    } else {
        // Create
        const newId = uuidv4();
        const insertQuery = 'INSERT INTO testimonials (id, name, role, review, image_url, rating) VALUES (?, ?, ?, ?, ?, ?)';
        await query({ query: insertQuery, values: [newId, data.name, data.role, data.review, data.image_url, data.rating] });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function handleDeleteItem({ itemType, itemId }: { itemType: string; itemId: string }) {
    // Basic validation to prevent SQL injection, though parameterized queries are the main defense.
    if (!/^[a-zA-Z_]+$/.test(itemType)) {
        throw new Error('Invalid item type for deletion.');
    }
    await query({ query: `DELETE FROM ${itemType} WHERE id = ?`, values: [itemId] });
    return NextResponse.json({ data: { success: true } });
}

async function handleDeleteAll({ itemType }: { itemType: string }) {
    if (!/^[a-zA-Z_]+$/.test(itemType)) {
        throw new Error('Invalid item type for deletion.');
    }
    await query({ query: `DELETE FROM ${itemType}` });
    return NextResponse.json({ data: { success: true } });
}

async function handleAwardNft({ userId }: { userId: string }) {
    const updateQuery = 'UPDATE gamification_users SET nft_claimed = ?, nft_awarded_at = CURRENT_TIMESTAMP WHERE id = ?';
    await query({ query: updateQuery, values: [true, userId] });
    return NextResponse.json({ data: { success: true } });
}

async function handleAdjustPoints({ userId, amount, reason }: { userId: string, amount: number, reason: string }) {
    // Note: Logging is not implemented here, but would be in a real app.
    const updateQuery = 'UPDATE gamification_users SET points = points + ? WHERE id = ?';
    await query({ query: updateQuery, values: [amount, userId] });
    return NextResponse.json({ data: { success: true } });
}

// --- Public Form Handlers ---
async function handleSubmitVoucher(payload: any) {
    const { provider, voucherCode, description, link, userEmail } = payload;
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO submitted_vouchers (id, provider, voucher_code, description, link, user_email) VALUES (?, ?, ?, ?, ?, ?)';
    await query({ query: insertQuery, values: [newId, provider, voucherCode, description, link, userEmail] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function handleSubmitDealRequest(payload: any) {
    const { serviceType, providerName, userEmail, additionalNotes } = payload;
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO deal_requests (id, user_email, service_type, provider_name, additional_notes) VALUES (?, ?, ?, ?, ?)';
    await query({ query: insertQuery, values: [newId, userEmail, serviceType, providerName, additionalNotes] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function handleSubmitNftShowcase(payload: any) {
    const { title, nftImageUrl, marketplaceLink, userEmail } = payload;
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO nft_showcase (id, title, nft_image_url, marketplace_link, user_email) VALUES (?, ?, ?, ?, ?)';
    await query({ query: insertQuery, values: [newId, title, nftImageUrl, marketplaceLink, userEmail] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function handleSubmitSiteTestimonial(payload: any) {
    const { name, email, rating, testimonial } = payload;
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO hostvoucher_testimonials (id, name, email, testimonial, rating) VALUES (?, ?, ?, ?, ?)';
    await query({ query: insertQuery, values: [newId, name, email, testimonial, rating] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function handleSubmitProof(payload: any) {
    const {
        fullName,
        whatsappNumber,
        provider,
        domain,
        purchaseDate,
        screenshotUrl,
        userEmail,
        submittedAt
    } = payload;

    const newId = uuidv4();

    try {
        // Insert into nft_redemption_requests table with enhanced data
        const insertQuery = `
            INSERT INTO nft_redemption_requests (
                id,
                full_name,
                whatsapp_number,
                provider,
                domain,
                purchase_date,
                screenshot_url,
                user_email,
                status,
                points_awarded,
                submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            newId,
            fullName,
            whatsappNumber,
            provider,
            domain,
            purchaseDate,
            screenshotUrl,
            userEmail || '',
            'pending', // Default status
            50000000, // Points to be awarded
            submittedAt || new Date().toISOString()
        ];

        await query({ query: insertQuery, values });

        console.log('✅ Proof of purchase submitted successfully:', {
            id: newId,
            fullName,
            provider,
            domain,
            screenshotUrl
        });

        return NextResponse.json({
            data: {
                success: true,
                id: newId,
                message: 'Proof of purchase submitted successfully! You will receive 50M points once approved.',
                pointsAwarded: 50000000
            }
        });

    } catch (error: any) {
        console.error('❌ Error submitting proof of purchase:', error);
        return NextResponse.json({
            error: 'Failed to submit proof of purchase',
            details: error.message
        }, { status: 500 });
    }
}

async function handleSubscribeToNewsletter(payload: any) {
    const { email } = payload;
    // Check if email already exists
    const checkQuery = 'SELECT id FROM newsletter_subscriptions WHERE email = ?';
    const existing: any = await query({ query: checkQuery, values: [email] });
    if (existing.length > 0) {
        return NextResponse.json({ data: { success: true, message: 'Email already subscribed.' } });
    }
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO newsletter_subscriptions (id, email) VALUES (?, ?)';
    await query({ query: insertQuery, values: [newId, email] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function handleReorderCatalog(payload: any) {
    const { products } = payload;

    if (!Array.isArray(products) || products.length === 0) {
        return NextResponse.json({ error: 'Invalid products array' }, { status: 400 });
    }

    try {
        // Update display_order for each product
        const updatePromises = products.map((product: any, index: number) => {
            const updateQuery = 'UPDATE products SET display_order = ? WHERE id = ?';
            return query({ query: updateQuery, values: [index + 1, product.id] });
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            data: {
                success: true,
                message: 'Catalog order updated successfully',
                updatedCount: products.length
            }
        });
    } catch (error: any) {
        console.error('Error reordering catalog:', error);
        return NextResponse.json({
            error: 'Failed to update catalog order',
            details: error.message
        }, { status: 500 });
    }
}
