import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import { createTransporter } from "./transporter.js";

export const loginUser = async (req, res) => {
  try {
    console.log("📩 loginUser() called");

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email dan password diperlukan" });

    // Cek apakah user ada
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // Cek status akun
    if (user.status === "pending")
      return res.status(403).json({ error: "Akun menunggu persetujuan admin" });
    if (user.status === "inactive")
      return res.status(403).json({ error: "Akun tidak aktif" });

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Password salah" });

    // Buat OTP random (6 digit)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

    // Simpan OTP ke tabel otp_codes
    await pool.query(
      "INSERT INTO otp_codes (user_id, otp_code, expires_at) VALUES ($1, $2, $3)",
      [user.id, otpCode, expiresAt]
    );

    // Kirim email OTP
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"DTSEN System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Kode OTP Login DTSEN",
      text: `Kode OTP kamu adalah ${otpCode}. Berlaku selama 2 menit.`,
    });

    // Kirim respon
    res.status(200).json({
      message: "OTP telah dikirim ke email kamu",
      otp_code: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });
  } catch (error) {
    console.error("🚨 Login Error:", error.message);
    res.status(500).json({ error: "Login gagal" });
  }
};
