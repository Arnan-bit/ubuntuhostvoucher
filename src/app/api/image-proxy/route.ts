import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        // Fetch the image from the external URL
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            // Add timeout
            signal: AbortSignal.timeout(10000) // 10 seconds timeout
        });

        if (!response.ok) {
            console.log(`Image proxy failed for ${imageUrl}: ${response.status} ${response.statusText}`);
            
            // Return a placeholder image for failed requests
            const placeholderResponse = await fetch('https://placehold.co/400x300/1e293b/ffffff?text=Image+Not+Available');
            if (placeholderResponse.ok) {
                const placeholderBuffer = await placeholderResponse.arrayBuffer();
                return new NextResponse(placeholderBuffer, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Cache-Control': 'public, max-age=3600',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }
            
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const imageBuffer = await response.arrayBuffer();

        // Return the image with proper headers
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error: any) {
        console.error('Image proxy error:', error);
        
        // Return a placeholder image for errors
        try {
            const placeholderResponse = await fetch('https://placehold.co/400x300/dc2626/ffffff?text=Image+Error');
            if (placeholderResponse.ok) {
                const placeholderBuffer = await placeholderResponse.arrayBuffer();
                return new NextResponse(placeholderBuffer, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Cache-Control': 'public, max-age=300', // Cache error placeholder for 5 minutes
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }
        } catch (placeholderError) {
            console.error('Placeholder image error:', placeholderError);
        }
        
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
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
