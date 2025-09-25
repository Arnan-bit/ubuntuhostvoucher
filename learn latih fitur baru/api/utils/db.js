// api/utils/db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Membuat koneksi ke database menggunakan kredensial dari file .env
// Perhatikan bahwa di backend Node.js, kita tidak perlu process.env.NEXT_PUBLIC_
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export default db;
