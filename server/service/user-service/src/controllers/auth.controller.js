// import pool from "../config/db.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// /**
//  * 🔧 Fungsi untuk membuat transporter dinamis
//  * Bisa pakai Gmail (service) atau SMTP custom (misalnya mail.bantenprov.go.id)
//  */
// const createTransporter = () => {
//   if (process.env.EMAIL_SERVICE === "gmail") {
//     // Gunakan Gmail
//     return nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//   } else {
//     // Gunakan SMTP kustom
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT) || 465,
//       secure: process.env.EMAIL_SECURE === "true", // true jika SSL
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false, // untuk sertifikat self-signed
//       },
//     });
//   }
// };

// /**
//  * ------------------------------
//  * 🔐 LOGIN: Generate OTP
//  * ------------------------------
//  */
// export const loginUser = async (req, res) => {
//   try {
//     console.log("📩 loginUser() called");
//     console.log("📩 Body:", req.body);

//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ error: "Email and password required" });

//     // Cek user di database
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = result.rows[0];
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Cek status akun
//     if (user.status === "pending") {
//       return res.status(403).json({
//         error: "Akun Anda saat ini menunggu persetujuan admin. Silakan tunggu approval.",
//       });
//     }
//     if (user.status === "inactive") {
//       return res.status(403).json({
//         error: "Akun Anda tidak aktif. Silakan hubungi admin.",
//       });
//     }

//     // Cek password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.status(401).json({ error: "Invalid password" });

//     // Generate OTP 6 digit
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

//     // Simpan OTP ke database
//     await pool.query(
//       "INSERT INTO otp_codes (user_id, otp_code, expires_at) VALUES ($1, $2, $3)",
//       [user.id, otpCode, expiresAt]
//     );

//     // Buat transporter email
//     const transporter = createTransporter();

//     // Coba verifikasi koneksi ke SMTP
//     await transporter.verify();
//     console.log("✅ SMTP connection verified");

//     // Kirim email OTP
//     const mailOptions = {
//       from: `"DTSEN System" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: "Your DTSEN Login OTP",
//       text: `Your OTP code is ${otpCode}. It will expire in 2 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ OTP email sent successfully to:", user.email);

//     // Response sukses
//     res.status(200).json({
//       message: "OTP has been sent to your email.",
//       otp_code: otpCode, // ⚠️ hanya untuk testing, hapus di produksi
//     });
//   } catch (error) {
//     console.error("🚨 Login Error:", error.message);
//     res.status(500).json({ error: "Login failed" });
//   }
// };
// /**
//  * ------------------------------
//  * ✅ VERIFY OTP + Generate JWT + Log Activity
//  * ------------------------------
//  */
// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp_code } = req.body;
//     if (!email || !otp_code)
//       return res.status(400).json({ error: "Email and OTP required" });

//     // Cek user
//     const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = userResult.rows[0];
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Cek status akun
//     if (user.status === "pending") {
//       return res.status(403).json({
//         error: "Akun Anda saat ini menunggu persetujuan admin. Silakan tunggu approval.",
//       });
//     }
//     if (user.status === "inactive") {
//       return res.status(403).json({
//         error: "Akun Anda tidak aktif. Silakan hubungi admin.",
//       });
//     }

//     // Cek OTP valid
//     const otpResult = await pool.query(
//       "SELECT * FROM otp_codes WHERE user_id = $1 AND otp_code = $2 AND is_used = FALSE AND expires_at > NOW()",
//       [user.id, otp_code]
//     );

//     if (otpResult.rows.length === 0)
//       return res.status(400).json({ error: "Invalid or expired OTP" });

//     // Tandai OTP sudah digunakan
//     await pool.query("UPDATE otp_codes SET is_used = TRUE WHERE id = $1", [
//       otpResult.rows[0].id,
//     ]);

//     // Buat JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" }
//     );

//     // ✅ Catat aktivitas login ke tabel login_logs
//     const logInsert = await pool.query(
//       `INSERT INTO login_logs (user_id, email, role, login_time, ip_address)
//        VALUES ($1, $2, $3, NOW(), $4)
//        RETURNING id`,
//       [user.id, user.email, user.role, req.ip]
//     );

//     console.log(`📝 Login log recorded for ${user.email}, log_id=${logInsert.rows[0].id}`);

//     // Kirim response
//     res.status(200).json({
//       message: "OTP verified successfully",
//       token,
//       user: {
//         id: user.id,
//         nama: user.nama,
//         email: user.email,
//         role: user.role,
//         status: user.status, // bisa dikirim untuk frontend
//       },
//     });
//   } catch (error) {
//     console.error("🚨 Verify OTP Error:", error.message);
//     res.status(500).json({ error: "OTP verification failed" });
//   }
// };

// /**
//  * ------------------------------
//  * 🚪 LOGOUT: Update logout_time
//  * ------------------------------
//  */
// export const logoutUser = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const authHeader = req.headers["authorization"];

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(400).json({ error: "No token provided" });
//     }

//     if (!email) {
//       return res.status(400).json({ error: "Email required" });
//     }

//     const token = authHeader.split(" ")[1];

//     // 🔍 Ambil log login terakhir user berdasarkan email
//     const lastLogin = await pool.query(
//       "SELECT id FROM login_logs WHERE email = $1 ORDER BY login_time DESC LIMIT 1",
//       [email]
//     );

//     if (lastLogin.rows.length === 0) {
//       return res.status(404).json({ error: "No active login found for this user" });
//     }

//     const logId = lastLogin.rows[0].id;

//     // 🕒 Update logout_time di login_logs
//     await pool.query("UPDATE login_logs SET logout_time = NOW() WHERE id = $1", [logId]);

//     const decoded = jwt.decode(token);

//     // ⛔ Masukkan token ke tabel blacklisted_tokens
//     await pool.query(
//         "INSERT INTO blacklisted_tokens (token, expires_at) VALUES ($1, to_timestamp($2))",
//         [token, decoded.exp]
//     );

//     console.log(`🚪 User ${email} logged out (log_id=${logId}), token revoked.`);

//     res.status(200).json({
//       message: "Logout successful, token revoked and logout_time recorded",
//     });
//   } catch (error) {
//     console.error("🚨 Logout Error:", error.message);
//     res.status(500).json({ error: "Logout failed" });
//   }
// };
