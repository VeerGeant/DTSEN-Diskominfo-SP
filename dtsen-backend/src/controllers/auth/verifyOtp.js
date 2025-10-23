// import pool from "../../config/db.js";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const verifyOtp = async (req, res) => {
//   try {
//     console.log("🔐 verifyOtp() called", req.body);

//     const { email, otp_code } = req.body;
//     if (!email || !otp_code)
//       return res.status(400).json({ error: "Email dan OTP diperlukan" });

//     // 🔹 Cek apakah user ada
//     const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = userResult.rows[0];
//     if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

//     // 🔹 Ambil OTP terbaru user
//     const otpResult = await pool.query(
//       `SELECT * FROM otp_codes 
//        WHERE user_id = $1 AND otp_code = $2 
//        ORDER BY created_at DESC LIMIT 1`,
//       [user.id, otp_code]
//     );

//     const otpData = otpResult.rows[0];
//     if (!otpData) return res.status(400).json({ error: "OTP tidak valid" });

//     // 🔹 Cek kedaluwarsa OTP
//     if (new Date() > new Date(otpData.expires_at))
//       return res.status(400).json({ error: "OTP telah kedaluwarsa" });

//     // 🔹 Hapus OTP agar tidak bisa digunakan lagi
//     await pool.query("DELETE FROM otp_codes WHERE user_id = $1", [user.id]);

//     // 🔹 Generate JWT
//     const token = jwt.sign(
//       {
//         id: user.id,
//         nama: user.nama,
//         email: user.email,
//         instansi: user.instansi,
//         no_hp: user.no_hp,
//         role: user.role || "user", // default ke "user" jika null
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // 🔹 Set cookie JWT
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 1000,
//       sameSite: "strict",
//     });

//     // 🔹 Respon sukses
//     return res.status(200).json({
//       message: "OTP valid, login berhasil",
//       user: {
//         id: user.id,
//         nama: user.nama,
//         email: user.email,
//         instansi: user.instansi,
//         role: user.role,
//       },
//       token, // opsional: bisa dikirim juga ke client
//     });
//   } catch (error) {
//     console.error("🚨 verifyOtp Error:", error);
//     return res.status(500).json({ error: "Verifikasi OTP gagal" });
//   }
// };
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
    if (new Date() > new Date(otp.expires_at))
      return res.status(400).json({ error: "OTP telah kedaluwarsa" });

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

    // 🔹 Set cookie JWT
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
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
