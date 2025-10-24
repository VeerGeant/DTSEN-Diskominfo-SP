// src/controllers/auth/logoutUser.js (KONTEN KOREKSI)

import dotenv from "dotenv";
dotenv.config();

export const logoutUser = async (req, res) => {
  try {
    console.log("🚪 logoutUser() called");

    // Hapus cookie token DENGAN KONFIGURASI YANG SAMA DENGAN verifyOtp.js
    res.clearCookie("token", {
      httpOnly: true,
      // WAJIB disetel ke true agar SameSite: None berfungsi
      secure: process.env.NODE_ENV === "production" || true, 
      // WAJIB sama dengan yang digunakan saat menyetel cookie
      sameSite: "None", 
      path: "/", // WAJIB sama
    });

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    // ... (Error handling)
  }
};