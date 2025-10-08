import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Image serving API with proper headers and caching
interface Params {
  params: {
    path: string[];
  };
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        // Reconstruct the file path from the dynamic route
        const imagePath = params.path.join('/');
        console.log('🖼️ Image requested:', imagePath);

        // Validate path to prevent directory traversal
        if (imagePath.includes('..') || imagePath.includes('\\')) {
            console.log('❌ Invalid path detected:', imagePath);
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        // Construct full file path
        const fullPath = path.join(process.cwd(), 'public', 'uploads', imagePath);
        console.log('📁 Full path:', fullPath);

        // Check if file exists
        if (!existsSync(fullPath)) {
            console.log('❌ File not found:', fullPath);
            
            // Return a placeholder image for missing files
            const placeholderPath = path.join(process.cwd(), 'public', 'placeholder-image.png');
            if (existsSync(placeholderPath)) {
                const placeholderBuffer = await readFile(placeholderPath);
                return new NextResponse(placeholderBuffer, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Cache-Control': 'public, max-age=300', // 5 minutes cache for placeholders
                        'X-Image-Status': 'placeholder'
                    },
                });
            }
            
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Get file stats
        const fileStats = await stat(fullPath);
        console.log('📊 File stats:', {
            size: fileStats.size,
            modified: fileStats.mtime
        });

        // Read the file
        const fileBuffer = await readFile(fullPath);

        // Determine content type based on file extension
        const ext = path.extname(fullPath).toLowerCase();
        let contentType = 'image/jpeg'; // default
        
        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            default:
                contentType = 'application/octet-stream';
        }

        console.log('✅ Serving image:', {
            path: imagePath,
            size: fileBuffer.length,
            type: contentType
        });

        // Return the image with proper headers
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000', // 1 year cache for images
                'ETag': `"${fileStats.mtime.getTime()}-${fileStats.size}"`,
                'Last-Modified': fileStats.mtime.toUTCString(),
                'X-Image-Status': 'success',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error: any) {
        console.error('❌ Image serving error:', {
            message: error.message,
            path: params.path,
            stack: error.stack
        });

        // Return error response
        return NextResponse.json({ 
            error: 'Failed to serve image',
            details: error.message 
        }, { status: 500 });
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
