import pool from "../../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyOtp = async (req, res) => {
  try {
    console.log("🔐 verifyOtp() called");

    const { email, otp_code } = req.body;
    if (!email || !otp_code)
      return res.status(400).json({ error: "Email dan OTP diperlukan" });

    // Cek user
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // Ambil OTP terbaru user
    const otpResult = await pool.query(
      "SELECT * FROM otp_codes WHERE user_id = $1 AND otp_code = $2 ORDER BY id DESC LIMIT 1",
      [user.id, otp_code]
    );
    const otpData = otpResult.rows[0];

    if (!otpData) return res.status(400).json({ error: "OTP tidak valid" });
    if (new Date() > new Date(otpData.expires_at))
      return res.status(400).json({ error: "OTP telah kedaluwarsa" });

    // Hapus OTP agar tidak bisa dipakai lagi
    await pool.query("DELETE FROM otp_codes WHERE user_id = $1", [user.id]);

    // Buat JWT token 1 jam
    // const token = jwt.sign(
    // {
    //   id: user.id,
    //   nama: user.nama,
    //   email: user.email,
    //   role: user.role,
    //   opd: user.opd, // ganti dari user.instansi ke user.opd biar konsisten dengan kolom di DB
    // },
    //   process.env.JWT_SECRET,
    // { expiresIn: "1h" }
    // );

const token = jwt.sign(
  {
    id: user.id,
    nama: user.nama,
    email: user.email,
    instansi: user.instansi,       // tambahkan ini
    role: user.role      // tambahkan ini juga bila ada
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


    // Simpan token di cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // aktif hanya di HTTPS
      maxAge: 60 * 60 * 1000, // 1 jam
      sameSite: "strict",
    });

    res.status(200).json({
      message: "OTP valid, login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        instansi : user.instansi,
      },
    });
  } catch (error) {
    console.error("🚨 verifyOtp Error:", error.message);
    res.status(500).json({ error: "Verifikasi OTP gagal" });
  }
};
