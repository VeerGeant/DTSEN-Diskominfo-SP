import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { createUserTable } from './models/user.model.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config(); // harus dipanggil sebelum middleware/verifikasi JWT

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Buat tabel jika belum ada
(async () => {
  await pool.query(createUserTable);
  console.log('✅ Users table ready');
})();

app.use('/api/users', userRoutes);

export default app;
