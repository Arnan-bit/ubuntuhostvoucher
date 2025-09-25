// api/routes/upload.js
import express from 'express';
import multer from 'multer';
import { Client } from 'basic-ftp';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Konfigurasi Multer untuk menyimpan file sementara di server API
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });


router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file was uploaded.' });
    }

    const file = req.file;
    const ftpClient = new Client();
    ftpClient.ftp.verbose = true; // Aktifkan untuk debugging

    try {
        // 1. Hubungkan ke server FTP cPanel
        await ftpClient.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false, // Gunakan 'true' jika Anda menggunakan FTPS
        });

        // 2. Pastikan direktori target di cPanel ada
        const remoteDir = `public_html/uploads/images`;
        await ftpClient.ensureDir(remoteDir);

        // 3. Upload file dari server API ke server cPanel
        const uniqueFilename = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
        const remotePath = `${remoteDir}/${uniqueFilename}`;
        await ftpClient.uploadFrom(file.path, remotePath);

        // 4. Buat URL publik untuk file yang diunggah
        const publicUrl = `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${uniqueFilename}`;

        // Kirim kembali URL yang berhasil
        res.status(200).json({ success: true, url: publicUrl });

    } catch (error) {
        console.error('FTP Upload Error:', error);
        res.status(500).json({ success: false, error: 'Failed to upload file to hosting.' });
    } finally {
        // 5. Tutup koneksi FTP
        if (!ftpClient.closed) {
            ftpClient.close();
        }
        // 6. Hapus file sementara dari server API
        try {
            fs.unlinkSync(file.path);
        } catch(unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
        }
    }
});

export default router;
