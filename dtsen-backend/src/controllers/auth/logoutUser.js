import pool from "../../config/db.js";
import jwt from "jsonwebtoken";

export const logoutUser = async (req, res) => {
  try {
    console.log("🚪 logoutUser() called");

    // Hapus cookie token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("🚨 Logout Error:", error.message);
    res.status(500).json({ error: "Logout gagal" });
  }
};