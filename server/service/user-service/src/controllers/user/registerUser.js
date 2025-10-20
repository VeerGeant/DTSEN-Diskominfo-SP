import pool from "../../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { nama, nip, jabatan, instansi, email, password } = req.body;
    if (!nama || !nip || !jabatan || !instansi || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (nama,nip,jabatan,instansi,email,password,role,status)
       VALUES ($1,$2,$3,$4,$5,$6,'opd','pending')
       RETURNING id,nama,email,status`,
      [nama, nip, jabatan, instansi, email, hashed]
    );

    res.status(201).json({
      message: "Registrasi berhasil, menunggu persetujuan admin.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("🚨 Register Error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
};
export default registerUser;