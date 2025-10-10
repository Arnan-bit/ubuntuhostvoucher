// api/index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Impor rute-rute API Anda di sini
import productRoutes from "./routes/products.js";
import submissionRoutes from "./routes/submissions.js";
import settingRoutes from "./routes/settings.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import analyticsRoutes from "./routes/analytics.js"; // <-- DIIMPOR DI SINI

const app = express();

// Middlewares
// The limit needs to be increased to handle file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:9002",
        "https://hostvocher.com",
        process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean),
    credentials: true
}));
app.use(cookieParser());

// STATIC FILES CONFIGURATION - CRITICAL FOR IMAGE DISPLAY
// Serve uploaded images from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Also serve from parent directory's public/uploads for compatibility
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Root API endpoint
app.get("/", (req, res) => {
    res.json({
        message: "HostVoucher API Server",
        version: "1.0.0",
        status: "running",
        endpoints: {
            products: "/api/products",
            submissions: "/api/submissions",
            settings: "/api/settings",
            auth: "/api/auth",
            upload: "/api/upload"
        }
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Menggunakan rute-rute API
app.use("/api/products", productRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling untuk database
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    console.log(`Backend API connected on port ${PORT}!`);
    console.log(`Server running at http://localhost:${PORT}`);
});
