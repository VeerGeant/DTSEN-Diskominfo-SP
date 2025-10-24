import { User } from "../../models/index.js"; // ✅ Import model User

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user; // ID didapat dari middleware (verifyToken)

    // ✅ Ambil user menggunakan Sequelize findByPk (Find by Primary Key)
    const user = await User.findByPk(id, {
      attributes: ['id', 'nama', 'email', 'role'] // Pilih kolom yang dibutuhkan
    });

    if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // ✅ user sudah berupa object data, tidak perlu .rows[0]
    res.json({ profile: user });
  } catch (err) {
    console.error("🚨 getProfile Error:", err.message);
    res.status(500).json({ error: "Gagal mengambil profil" });
  }
};

export default getProfile;