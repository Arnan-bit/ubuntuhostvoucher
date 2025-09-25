
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
            case 'saveSettings':
                return await handleSaveSettings(payload);
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

    // Define all possible fields from the form and their expected data types
    const fieldConfig: { [key: string]: string } = {
        name: 'string', title: 'string', provider: 'string', type: 'string', tier: 'string',
        price: 'float', original_price: 'float', discount: 'string', features: 'json',
        link: 'string', target_url: 'string', image: 'string', provider_logo: 'string',
        rating: 'float', num_reviews: 'int', clicks: 'int', code: 'string',
        short_link: 'string', seo_title: 'string', seo_description: 'string', color: 'string',
        button_color: 'string', is_featured: 'boolean', featured_display_style: 'string'
    };

    const valuesToSave: any = {};
    // Iterate over the config to ensure all possible fields are considered
    for (const key in fieldConfig) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const fieldType = fieldConfig[key];
            const value = data[key];

            if (value === null || value === undefined || value === '') {
                 if (fieldType === 'float' || fieldType === 'int') {
                    valuesToSave[key] = 0;
                } else if (fieldType === 'boolean') {
                    valuesToSave[key] = false;
                } else if (fieldType === 'json') {
                     valuesToSave[key] = JSON.stringify([]);
                }
                 else {
                    valuesToSave[key] = null;
                }
            } else {
                 if (fieldType === 'float') {
                    valuesToSave[key] = parseFloat(value);
                } else if (fieldType === 'int') {
                    valuesToSave[key] = parseInt(value, 10);
                } else if (fieldType === 'boolean') {
                    valuesToSave[key] = !!value;
                } else if (fieldType === 'json') {
                    valuesToSave[key] = JSON.stringify(value);
                } else {
                    valuesToSave[key] = value;
                }
            }
        }
    }

    if (id) {
        // UPDATE existing product
        if (Object.keys(valuesToSave).length === 0) {
            return NextResponse.json({ message: "No fields to update." }, { status: 200 });
        }
        const setClauses = Object.keys(valuesToSave).map(field => `${field} = ?`);
        const values = [...Object.values(valuesToSave), id];
        const updateQuery = `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`;
        await query({ query: updateQuery, values });
        return NextResponse.json({ data: { id } });
    } else {
        // INSERT new product
        const newId = uuidv4();
        valuesToSave.id = newId;

        // Get the next catalog number sequentially
        const catalogNumberResult: any = await query({ query: 'SELECT MAX(catalog_number) as maxNum FROM products' });
        const newCatalogNumber = (catalogNumberResult[0]?.maxNum || 0) + 1;
        valuesToSave.catalog_number = newCatalogNumber;

        const columns = Object.keys(valuesToSave).join(', ');
        const placeholders = Object.keys(valuesToSave).map(() => '?').join(', ');
        const values = Object.values(valuesToSave);

        const insertQuery = `INSERT INTO products (${columns}) VALUES (${placeholders})`;
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
    const { id, ...data } = taskData;
    if (id) {
        // Update existing task
        const updateQuery = 'UPDATE mining_tasks SET name=?, description=?, points=?, link=?, icon=?, enabled=? WHERE id=?';
        const values = [data.name, data.description, data.points, data.link, data.icon, data.enabled, id];
        await query({ query: updateQuery, values });
        return NextResponse.json({ data: { id } });
    } else {
        // Create new task
        const newId = uuidv4();
        const insertQuery = 'INSERT INTO mining_tasks (id, name, description, points, link, icon, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [newId, data.name, data.description, data.points, data.link, data.icon, data.enabled];
        await query({ query: insertQuery, values });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function handleSaveSettings(settingsData: any) {
    const settingsId = 'main_settings'; // Hardcoded ID for the single settings row
    const { id, ...data } = settingsData; // id is ignored, we always use 'main_settings'

    // Serialize JSON fields before saving
    const dataToSave = { ...data };
    for (const key in dataToSave) {
        if (typeof dataToSave[key] === 'object' && dataToSave[key] !== null) {
            dataToSave[key] = JSON.stringify(dataToSave[key]);
        }
    }
    
    // Check if a settings row already exists
    const existingSettings: any = await query({ query: 'SELECT id FROM settings WHERE id = ?', values: [settingsId]});

    if (existingSettings.length > 0) {
        // Update existing settings
        if (Object.keys(dataToSave).length > 0) {
            const setClause = Object.keys(dataToSave).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(dataToSave), settingsId];
            const updateQuery = `UPDATE settings SET ${setClause} WHERE id = ?`;
            await query({ query: updateQuery, values });
        }
    } else {
        // Insert new settings
        const columns = ['id', ...Object.keys(dataToSave)].join(', ');
        const placeholders = ['?', ...Object.keys(dataToSave).map(() => '?')].join(', ');
        const values = [settingsId, ...Object.values(dataToSave)];
        const insertQuery = `INSERT INTO settings (${columns}) VALUES (${placeholders})`;
        await query({ query: insertQuery, values });
    }

    return NextResponse.json({ data: { id: settingsId } });
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
    const { fullName, whatsappNumber, provider, domain, purchaseDate, screenshotUrl } = payload;
    const newId = uuidv4();
    const insertQuery = 'INSERT INTO nft_redemption_requests (id, full_name, whatsapp_number, provider, domain, purchase_date, screenshot_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await query({ query: insertQuery, values: [newId, fullName, whatsappNumber, provider, domain, purchaseDate, screenshotUrl] });
    return NextResponse.json({ data: { success: true, id: newId }});
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
