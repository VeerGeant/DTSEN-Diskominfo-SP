import bcrypt from "bcrypt";
import { createTransporter } from "./transporter.js";
import { User, OtpCode } from "../../models/index.js"; // pastikan sudah di-export di index.js

export const loginUser = async (req, res) => {
  try {
    console.log("📩 loginUser() called", req.body);

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email dan password diperlukan" });

    // 🔍 Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // 🚫 Cek status akun
    if (user.status === "pending")
      return res.status(403).json({ error: "Akun menunggu persetujuan admin" });
    if (user.status === "inactive")
      return res.status(403).json({ error: "Akun tidak aktif" });

    // 🔐 Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Password salah" });

    // 🔢 Buat OTP (6 digit)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

    // 💾 Simpan OTP ke tabel otp_codes
    await OtpCode.create({
      user_id: user.id,
      otp_code: otpCode,
      expires_at: expiresAt,
    });

    // 📧 Kirim email OTP
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"DTSEN System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Kode OTP Login DTSEN",
      text: `Kode OTP kamu adalah ${otpCode}. Berlaku selama 2 menit.`,
    });

    // ✅ Kirim respon ke client
    res.status(200).json({
      message: "OTP telah dikirim ke email kamu",
      otp_code: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });

  } catch (error) {
    console.error("🚨 Login Error:", error.message);
    res.status(500).json({ error: "Login gagal" });
  }
};
