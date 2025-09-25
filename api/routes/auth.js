// api/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../utils/db.js";

const router = express.Router();

// Login endpoint
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const query = "SELECT * FROM admin_users WHERE email = ?";

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ error: "Login failed" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = results[0];

        try {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error("Password comparison error:", error);
            res.status(500).json({ error: "Login failed" });
        }
    });
});

// Register endpoint (for creating admin users)
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password, and name are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO admin_users (id, email, password, name, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;

        const userId = require('crypto').randomUUID();
        const values = [userId, email, hashedPassword, name];

        db.query(insertQuery, values, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Email already exists" });
                }
                console.error("Error creating user:", err);
                return res.status(500).json({ error: "Failed to create user" });
            }

            res.status(201).json({
                message: "User created successfully",
                user: {
                    id: userId,
                    email,
                    name
                }
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Get current user
router.get("/me", verifyToken, (req, res) => {
    const query = "SELECT id, email, name FROM admin_users WHERE id = ?";

    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]);
    });
});

export default router;
