import models from "../../models/index.js";
const { Document, Request } = models; // Asumsi Request diimpor karena digunakan di controller lama

// ✅ FUNGSI BARU: GET document file (with file_data/Base64) by ID
export const getDocumentFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, id: userId } = req.user;
        
        // Ambil dokumen beserta file_data-nya
        const document = await Document.findByPk(id, {
            attributes: ['file_data', 'file_type', 'nama_dokumen', 'request_id'] 
        });

        if (!document) {
            return res.status(404).json({ success: false, message: "Dokumen tidak ditemukan." });
        }

        // Karena rute sudah dilindungi oleh authorizeRoles("admin", "superadmin", "user"), 
        // kita hanya perlu memastikan file_data ada.
        if (!document.file_data) {
            return res.status(404).json({ success: false, message: "Konten file kosong." });
        }

        // Kirimkan data dokumen lengkap, termasuk file_data (Base64)
        res.status(200).json({ 
            success: true, 
            data: {
                file_data: document.file_data,
                file_type: document.file_type,
                nama_dokumen: document.nama_dokumen
            }
        });

    } catch (error) {
        console.error("🚨 Error getDocumentFileById:", error.name, error.message);
        res.status(500).json({ success: false, message: "Gagal mengambil data dokumen", error: error.message });
    }
};

// GET documents by request_id (Logika kepemilikan request IDOR diatasi di router dengan peran)
export const getDocumentsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // Otentikasi dan otorisasi sudah di-handle oleh middleware
    const docs = await Document.findAll({ where: { request_id: requestId }, attributes: { exclude: ['file_data'] } });
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
    // ✅ PERBAIKAN: Tambahkan file_data ke destructuring
    const { request_id, jenis_dokumen, nama_dokumen, file_url, file_data, file_type, keterangan } = req.body;
    
    const newDoc = await Document.create({ 
      request_id, 
      jenis_dokumen, 
      nama_dokumen, 
      file_url, 
      file_data, // ✅ Gunakan file_data
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

    // ⛔ Pengecekan IDOR: Jika bukan admin/superadmin, user hanya boleh menghapus dokumen yang diunggah olehnya.
    if (!["admin", "superadmin"].includes(req.user.role) && doc.uploaded_by !== req.user.id) {
        return res.status(403).json({ success: false, message: "Akses ditolak: Dokumen bukan milik Anda." });
    }

    await doc.destroy();
    res.status(200).json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    console.error("🚨 Error deleteDocument:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus dokumen", error });
  }
};