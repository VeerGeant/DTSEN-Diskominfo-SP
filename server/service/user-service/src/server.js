import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/db.js"; // PostgreSQL Pool
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // ganti sesuai domain frontend kamu
    credentials: true, // agar cookie bisa dikirim dari frontend
  })
);
app.use(express.urlencoded({ extended: true }));

// ====== TEST DATABASE CONNECTION ======
pool
  .connect()
  .then(client => {
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ====== DEFAULT ROUTE ======
app.get("/", (req, res) => {
  res.json({
    message: "🚀 User Service API is running successfully",
    version: "1.0.0",
  });
});

// ====== ERROR HANDLER ======
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});
