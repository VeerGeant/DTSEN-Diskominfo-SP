import pool from "../../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const userResult = await pool.query("SELECT id, nama, email, role FROM users WHERE id = $1", [id]);
    res.json({ profile: userResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil profil" });
  }
};

export default getProfile;