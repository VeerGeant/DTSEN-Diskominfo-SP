import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";

// import routes
import userRoutes from "./routes/user-services/user.routes.js";
import authRoutes from "./routes/user-services/auth.routes.js";
import adminRoutes from "./routes/user-services/admin.routes.js";
import requestRouter from "./routes/request/index.js";

const app = express();

// ====== MIDDLEWARE ======
// ❗ PERBAIKAN KRITIS: MENINGKATKAN BATAS PAYLOAD (untuk file Base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// ❗ AKHIR PERBAIKAN

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
// app.use(express.urlencoded({ extended: true })); // Baris ini diganti oleh baris di atas

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/request", requestRouter);

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

export default app;


// import models
// import { createUserTable, createUserTrigger } from "./models/users.model.js";
// import { createOtpTable } from "./models/otp.model.js";
// import { createBlacklistedTokensTable } from "./models/tokenBlacklisted.model.js";

// ====== CREATE TABLES WHEN APP STARTS ======
// (async () => {
    //   try {
        //     await pool.query(createUserTable);
        //     await pool.query(createUserTrigger);
        //     console.log("✅ Users table & trigger ready");
        
        //     await pool.query(createOtpTable);
        //     console.log("✅ OTP codes table ready");
        
        //     await pool.query(createBlacklistedTokensTable);
        //     console.log("✅ Blacklisted tokens table ready");
        //   } catch (err) {
            //     console.error("❌ Error creating tables:", err);
            //   }
            // })();