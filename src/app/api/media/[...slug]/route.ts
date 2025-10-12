// MEDIA API ROUTE - Menggabungkan: upload, image-proxy, images
// Reduces 3 separate functions into 1 unified function

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [endpoint, ...rest] = params.slug || [];
    
    try {
        switch (endpoint) {
            case 'proxy':
                return await handleImageProxy(request);
            
            case 'images':
                return await handleImageServing(request, rest);
            
            case 'health':
                return NextResponse.json({ 
                    status: 'ok', 
                    endpoint: 'media',
                    timestamp: new Date().toISOString()
                });
            
            default:
                return NextResponse.json({ 
                    error: 'Endpoint not found',
                    available: ['proxy', 'images', 'health']
                }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`Media API GET Error [${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [endpoint, ...rest] = params.slug || [];
    
    try {
        switch (endpoint) {
            case 'upload':
                return await handleUpload(request);
            
            default:
                return NextResponse.json({ 
                    error: 'Endpoint not found',
                    available: ['upload']
                }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`Media API POST Error [${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

// ==================== IMAGE PROXY HANDLER ====================
async function handleImageProxy(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
        }

        // Fetch the image
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error: any) {
        console.error('Image proxy error:', error);
        
        // Return placeholder on error
        try {
            const placeholderResponse = await fetch('https://placehold.co/400x300/1e293b/ffffff?text=Image+Not+Available');
            if (placeholderResponse.ok) {
                const buffer = await placeholderResponse.arrayBuffer();
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Cache-Control': 'public, max-age=3600'
                    }
                });
            }
        } catch (placeholderError) {
            console.error('Placeholder error:', placeholderError);
        }

        return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
    }
}

// ==================== IMAGE SERVING HANDLER ====================
async function handleImageServing(request: NextRequest, pathSegments: string[]) {
    try {
        const imagePath = pathSegments.join('/');
        const fullPath = path.join(process.cwd(), 'public', 'uploads', imagePath);

        if (!existsSync(fullPath)) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const fs = require('fs');
        const imageBuffer = fs.readFileSync(fullPath);
        
        // Determine content type from extension
        const ext = path.extname(imagePath).toLowerCase();
        const contentTypeMap: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };
        const contentType = contentTypeMap[ext] || 'application/octet-stream';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error: any) {
        console.error('Image serving error:', error);
        return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
    }
}

// ==================== UPLOAD HANDLER ====================
async function handleUpload(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string || 'images';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ 
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
            }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ 
                error: 'File too large. Maximum size is 10MB.' 
            }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filename = `${timestamp}_${originalName}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
        
        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${category}/${filename}`;
        const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}${publicUrl}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fullUrl: fullUrl,
            filename: filename,
            size: file.size,
            type: file.type
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Upload failed',
            details: error.message 
        }, { status: 500 });
    }
}
