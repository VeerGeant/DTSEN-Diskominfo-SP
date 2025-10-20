import pool from "../config/db.js";

export const createRequest = async (req, res) => {
  try {
    const { user } = req;
    const { no_hp } = req.body; // tetap manual dari form

    // ambil nama file PDF (kalau ada)
    const surat_permohonan = req.files["surat_permohonan"]?.[0]?.filename || null;
    const kak = req.files["kak"]?.[0]?.filename || null;
    const nda = req.files["nda"]?.[0]?.filename || null;

    // pastikan user dari JWT lengkap
    if (!user || !user.id || !user.nama || !user.email || !user.instansi) {
      return res.status(400).json({ message: "Data user tidak lengkap di token" });
    }

    // simpan ke database
    const result = await pool.query(
      `INSERT INTO requests (user_id, nama, email, instansi, no_hp, surat_permohonan, kak, nda, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       RETURNING *`,
      [user.id, user.nama, user.email, user.instansi, no_hp, surat_permohonan, kak, nda]
    );

    res.status(201).json({
      message: "✅ Request berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error membuat request:", error.message);
    res.status(500).json({
      message: "Gagal membuat request",
      error: error.message,
    });
  }
};
