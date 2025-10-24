import { User, OtpCode } from "../../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyOtp = async (req, res) => {
  try {
    console.log("🔐 verifyOtp() called", req.body);

    const { email, otp_code } = req.body;
    if (!email || !otp_code)
      return res.status(400).json({ error: "Email dan OTP diperlukan" });

    // 🔹 Cek apakah user ada
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // 🔹 Ambil OTP terbaru user
    const otp = await OtpCode.findOne({
      where: { user_id: user.id, otp_code },
      order: [["created_at", "DESC"]],
    });

    if (!otp) return res.status(400).json({ error: "OTP tidak valid" });

    // 🔹 Cek kedaluwarsa OTP
    if (new Date() > new Date(otp.expires_at)) {
      await otp.destroy(); 
      return res.status(400).json({ error: "OTP telah kedaluwarsa" });
    }

    // 🔹 Hapus OTP agar tidak bisa digunakan lagi
    await otp.destroy();

    // 🔹 Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        instansi: user.instansi,
        no_hp: user.no_hp,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 Set cookie JWT (PERBAIKAN KRITIS untuk cross-site)
    res.cookie("token", token, {
      httpOnly: true,
      // Wajib disetel true agar SameSite: None berfungsi, meskipun di development
      secure: process.env.NODE_ENV === "production" || true, 
      maxAge: 60 * 60 * 1000,
      // Diperlukan jika frontend dan backend berbeda port
      sameSite: "None", 
      path: "/",
    });

    // 🔹 Respon sukses
    return res.status(200).json({
      message: "OTP valid, login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        instansi: user.instansi,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("🚨 verifyOtp Error:", error);
    return res.status(500).json({ error: "Verifikasi OTP gagal" });
  }
};