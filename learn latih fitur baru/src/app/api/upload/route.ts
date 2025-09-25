
import { NextResponse } from 'next/server';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';

// This function handles the POST request to upload a file.
// It is now the single, unified endpoint for all file uploads from the Next.js frontend.
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        const ftpClient = new Client(30000); // 30 second timeout
        ftpClient.ftp.verbose = process.env.NODE_ENV === 'development'; // Verbose logging for debugging in dev

        try {
            // Establish connection to the FTP server using environment variables
            await ftpClient.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
                secure: false // Use `false` for standard FTP, `true` for FTPS
            });

            // Convert the file buffer to a readable stream
            const buffer = Buffer.from(await file.arrayBuffer());
            const readableStream = Readable.from(buffer);
            
            // Sanitize the filename and make it unique
            const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const uniqueFilename = `${Date.now()}_${originalFilename}`;

            // Ensure the remote directory exists
            const remoteDir = `public_html/uploads/images`;
            await ftpClient.ensureDir(remoteDir);
            
            // Define the remote path for the upload on your cPanel server
            const remotePath = `${remoteDir}/${uniqueFilename}`;
            
            // Perform the upload
            await ftpClient.uploadFrom(readableStream, remotePath);
            
            // Construct the public URL for the uploaded file
            const publicUrl = `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${uniqueFilename}`;

            // Return a success response with the public URL
            return NextResponse.json({ success: true, url: publicUrl });

        } catch (ftpError: any) {
            // Log the detailed FTP error on the server
            console.error('FTP Operation Failed:', ftpError);
            // Return a more specific error message to the client
            return NextResponse.json({ error: `FTP operation failed: ${ftpError.message}` }, { status: 500 });
        } finally {
            // Ensure the FTP client connection is closed
            if (!ftpClient.closed) {
                await ftpClient.close();
            }
        }
    } catch (error: any) {
        // Log any other unexpected errors during request processing
        console.error('File Upload API Error:', error);
        return NextResponse.json({ error: `Failed to process file upload: ${error.message}` }, { status: 500 });
    }
}
