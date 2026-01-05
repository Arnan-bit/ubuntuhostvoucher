// api/routes/upload.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const router = express.Router();

// Konfigurasi Multer untuk menyimpan file sementara
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

// MySQL Database Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file was uploaded.' });
    }

    const file = req.file;
    
    try {
        // 1. Read file content
        const fileContent = fs.readFileSync(file.path);
        const base64Content = fileContent.toString('base64');
        
        // 2. Save to database instead of FTP
        const conn = await pool.getConnection();
        const uniqueFilename = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
        
        // Insert into database
        const query = `INSERT INTO uploads (filename, original_name, content, mime_type, size, created_at) 
                       VALUES (?, ?, ?, ?, ?, NOW())`;
        
        await conn.query(query, [
            uniqueFilename,
            file.originalname,
            base64Content,
            file.mimetype,
            file.size
        ]);
        
        conn.release();

        // 3. Return file URL
        const publicUrl = `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${uniqueFilename}`;
        
        res.status(200).json({ 
            success: true, 
            url: publicUrl,
            message: 'File uploaded to database successfully'
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, error: 'Failed to upload file.' });
    } finally {
        // Clean up temp file
        try {
            fs.unlinkSync(file.path);
        } catch(unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
        }
    }
});

export default router;
