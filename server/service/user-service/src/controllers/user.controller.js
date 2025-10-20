// import pool from "../config/db.js";
// import bcrypt from "bcrypt";



// export const getAllUsers = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ error: "Access denied: Admin only" });
//     }

//     const result = await pool.query("SELECT id, nama, email, role, status FROM users");
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching all users:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// /**
//  * 🧾 REGISTER USER
//  */
// export const registerUser = async (req, res) => {
//   try {
//     console.log("📩 registerUser() called");
//     console.log("📦 Body:", req.body);

//     const { nama, nip, jabatan, instansi, email, password, role } = req.body;

//     // Validasi input
//     if (!nama || !nip || !jabatan || !instansi || !email || !password || !role) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Cek apakah email sudah digunakan
//     const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert ke database
//     const query = `
//     INSERT INTO users (nama, nip, jabatan, instansi, email, password, role, status)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING id, nama, nip, jabatan, instansi, email, role, status
//     `;
//     const result = await pool.query(query, [
//     nama,
//     nip,
//     jabatan,
//     instansi,
//     email,
//     hashedPassword,
//     'opd',      // default role
//     'pending',  // default status
//     ]);

//     res.status(201).json({
//     message: "Registrasi berhasil, akun menunggu persetujuan admin.",
//     user: result.rows[0],
//   });
//   } catch (error) {
//     console.error("🚨 Register Error:", error.message);
//     res.status(500).json({ error: "Registration failed" });
//   }
// };

// /**
//  * 👤 GET PROFILE USER (dengan proteksi JWT)
//  * - Hanya bisa diakses jika user sudah login
//  * - Hanya bisa melihat profil miliknya sendiri
//  */
// export const getProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Ambil user dari token JWT
//     const loggedInUser = req.user;

//     // Cegah akses ke profile user lain
//     if (parseInt(id) !== loggedInUser.id) {
//       return res.status(403).json({
//         error: "Access denied: You can only view your own profile",
//       });
//     }

//     // Query ke database
//     const result = await pool.query(
//       "SELECT id, nama, nip, jabatan, instansi, email, role FROM users WHERE id = $1",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({
//       message: "Profile fetched successfully",
//       profile: result.rows[0],
//     });
//   } catch (error) {
//     console.error("🚨 Get Profile Error:", error.message);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// };
