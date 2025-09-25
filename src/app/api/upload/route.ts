
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Local File Manager Upload API
// Handles file uploads to local storage instead of FTP
export async function POST(request: Request) {
    console.log('🔄 Local Upload API called');

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const category = formData.get('category') as string || 'images'; // images, banners, profiles, promos

        if (!file) {
            console.log('❌ No file provided');
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        console.log('📁 File received:', {
            name: file.name,
            size: file.size,
            type: file.type,
            category: category
        });

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.log('❌ Invalid file type:', file.type);
            return NextResponse.json({
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            }, { status: 400 });
        }

        // Validate file size (10MB limit for local storage)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.log('❌ File too large:', file.size);
            return NextResponse.json({
                error: 'File too large. Maximum size is 10MB.'
            }, { status: 400 });
        }

        // Validate category
        const allowedCategories = ['images', 'banners', 'profiles', 'promos'];
        if (!allowedCategories.includes(category)) {
            console.log('❌ Invalid category:', category);
            return NextResponse.json({
                error: 'Invalid category. Allowed: images, banners, profiles, promos.'
            }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filename = `${timestamp}_${originalName}`;

        console.log('📝 File names:', {
            original: file.name,
            sanitized: originalName,
            unique: filename
        });

        // Convert file to buffer
        console.log('📦 Converting file to buffer...');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
        console.log('📁 Upload directory:', uploadDir);

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            console.log('📁 Creating directory:', uploadDir);
            await mkdir(uploadDir, { recursive: true });
        }

        // Define file path
        const filePath = path.join(uploadDir, filename);
        console.log('💾 File path:', filePath);

        try {
            // Write file to local storage
            await writeFile(filePath, buffer);
            console.log('✅ File saved successfully to local storage');

            // Return the public URL (relative to public folder)
            const publicUrl = `/uploads/${category}/${filename}`;
            const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}${publicUrl}`;

            console.log('🌐 URLs:', {
                public: publicUrl,
                full: fullUrl
            });

            return NextResponse.json({
                success: true,
                filename: filename,
                url: publicUrl,
                fullUrl: fullUrl,
                size: file.size,
                type: file.type,
                category: category,
                message: 'File uploaded successfully to local storage'
            });

        } catch (writeError: any) {
            console.error('❌ File write error:', {
                message: writeError.message,
                code: writeError.code,
                path: filePath
            });

            return NextResponse.json({
                success: false,
                error: 'Failed to save file to local storage.',
                details: writeError.message
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('❌ Local Upload API Error:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({
            success: false,
            error: 'Internal server error during file upload.',
            details: error.message
        }, { status: 500 });
    }
}

    