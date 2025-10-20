import express from "express";
import { loginUser } from "../controllers/auth/loginUser.js";
import { verifyOtp } from "../controllers/auth/verifyOtp.js";
import { logoutUser } from "../controllers/auth/logoutUser.js";
import { registerUser } from "../controllers/user/registerUser.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";
dotenv.config();


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logoutUser);

// ✅ Tambahan route baru untuk verifikasi token (dipanggil oleh dashboard-service)
router.post("/verify-token", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // 🔍 Cek apakah token sudah di-blacklist
    const checkBlacklist = await pool.query(
      "SELECT 1 FROM blacklisted_tokens WHERE token = $1",
      [token]
    );

    if (checkBlacklist.rows.length > 0) {
      return res.status(401).json({ error: "Token revoked. Please login again." });
    }

    // ✅ Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // kirim kembali data user agar bisa digunakan service lain
    res.status(200).json({
      valid: true,
      user: decoded,
    });
  } catch (error) {
    console.error("Verify token error:", error.message);
    res.status(403).json({ valid: false, error: "Invalid or expired token" });
  }
});

export default router;
