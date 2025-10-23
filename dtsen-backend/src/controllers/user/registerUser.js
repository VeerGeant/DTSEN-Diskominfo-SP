import { User } from "../../models/index.js"; // ✅ Import model User
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { nama, nip, instansi, jabatan, no_hp, email, password } = req.body;
    if (!nama || !nip || !instansi || !jabatan || !no_hp || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    // ✅ Cek user existing menggunakan Sequelize
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Buat user baru menggunakan Sequelize
    const newUser = await User.create({
      nama,
      nip,
      instansi,
      jabatan,
      no_hp,
      email,
      password: hashed,
      role: 'user',
      status: 'pending'
    }, {
      // Pilih kolom yang ingin dikembalikan (optional, tapi baik untuk response)
      attributes: ['id', 'nama', 'email', 'status'] 
    });

    res.status(201).json({
      message: "Registrasi berhasil, menunggu persetujuan admin.",
      user: {
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
          status: newUser.status,
      },
    });
  } catch (error) {
    console.error("🚨 Register Error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
};
export default registerUser;