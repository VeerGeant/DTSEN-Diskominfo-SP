import models from "../../models/index.js";
// Tambahkan Request Model jika diperlukan, tetapi untuk kepemilikan dokumen hanya butuh Document
const { Document } = models;

// GET documents by request_id (Logika kepemilikan request IDOR diatasi di router dengan peran)
export const getDocumentsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // Otentikasi dan otorisasi sudah di-handle oleh middleware
    const docs = await Document.findAll({ where: { request_id: requestId } });
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil dokumen", error });
  }
};

// CREATE document (Fix IDOR: ambil uploaded_by dari token)
export const createDocument = async (req, res) => {
  try {
    // ⚠️ Ambil uploaded_by dari token yang terverifikasi (req.user.id)
    const uploaded_by = req.user.id; 
    const { request_id, jenis_dokumen, nama_dokumen, file_url, file_type, keterangan } = req.body;
    
    const newDoc = await Document.create({ 
      request_id, 
      jenis_dokumen, 
      nama_dokumen, 
      file_url, 
      file_type, 
      keterangan, 
      uploaded_by // Gunakan ID dari token
    });
    res.status(201).json({ success: true, data: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambahkan dokumen", error });
  }
};

// DELETE document (Fix IDOR: cek kepemilikan dokumen)
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ success: false, message: "Dokumen tidak ditemukan" });

    // ⛔ Pengecekan IDOR: Jika bukan admin/verifikator, user hanya boleh menghapus dokumen yang diunggah olehnya.
    if (req.user.role === "user" && doc.uploaded_by !== req.user.id) {
        return res.status(403).json({ success: false, message: "Akses ditolak: Dokumen bukan milik Anda." });
    }

    await doc.destroy();
    res.status(200).json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus dokumen", error });
  }
};