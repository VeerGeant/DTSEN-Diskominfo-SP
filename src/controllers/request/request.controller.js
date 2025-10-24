import models from "../../models/index.js";
// ✅ Pastikan model User di-destructure di sini
const { Request, Document, RequestedDataset, RequestStage, SelectedVariable, User, sequelize } = models;

// GET all requests
export const getAllRequests = async (req, res) => {
  try {
    // req.user sudah dijamin memiliki role dan id (dari verifyToken)
    const { role, id: userId } = req.user;
    let whereCondition = {};

    // ⛔ IMPLEMENTASI FILTER BERDASARKAN ROLE
    // Jika role adalah 'user', hanya ambil request yang user_id-nya cocok.
    if (role === 'user') {
        // Hanya tampilkan data milik user yang sedang login
        whereCondition = { user_id: userId };
    }
    // Jika role adalah 'admin' atau 'verifikator', whereCondition tetap kosong ({}) sehingga mengambil semua data.

    const requests = await Request.findAll({
      where: whereCondition, // Terapkan kondisi filter
      include: [
        { model: Document, as: "documents" },
        { model: RequestedDataset, as: "requested_datasets", 
          // Eager load SelectedVariable (variables)
          include: [{ model: SelectedVariable, as: "selected_variables" }]
        },
        { model: RequestStage, as: "stages" },
        // ✅ EAGER LOADING USER: Pastikan alias 'user' konsisten
        { model: User, as: "user", attributes: ['nama', 'jabatan', 'instansi', 'email'] } 
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data permohonan berhasil diambil",
      data: requests,
    });
  } catch (error) {
    // ✅ PERBAIKAN: Log error lengkap untuk diagnosis di server
    console.error("🚨 Error di getAllRequests:", error.name, error.message);
    
    // Kirim pesan error yang lebih informatif ke frontend (tanpa detail internal error)
    res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil data permohonan. (Server Error: Cek relasi model atau data database.)", 
      error: error.message 
    });
  }
};

// GET one request
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id, {
      include: [
        { model: Document, as: "documents" },
        { model: RequestedDataset, as: "requested_datasets",
          include: [{ model: SelectedVariable, as: "selected_variables" }]
        },
        { model: RequestStage, as: "stages" },
        // ✅ EAGER LOADING USER: Ambil data pemohon
        { model: User, as: "user", attributes: ['nama', 'jabatan', 'instansi', 'email'] }
      ],
    });

    if (!request)
      return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("🚨 Error getRequestById:", error.name, error.message);
    res.status(500).json({ success: false, message: "Gagal mengambil data", error: error.message });
  }
};

// CREATE new request
export const createRequest = async (req, res) => {
  // Pastikan user sudah terautentikasi (req.user harus ada dari verifyToken middleware)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
  }

  const t = await sequelize.transaction();
  try {
    // ✅ Ambil user ID dari token
    const userId = req.user.id; 
    
    const {
      nama_instansi,
      unit_kerja,
      nomor_permohonan, 
      tema_data,
      tanggal_pengajuan,
      total_hari_kerja,
      documents,
      datasets,
      stages,
    } = req.body;

    // 1️⃣ Buat request utama
    const newRequest = await Request.create(
      { 
        // ✅ TAMBAHKAN user_id
        user_id: userId,
        nama_instansi, 
        unit_kerja, 
        nomor_permohonan, 
        tema_data, 
        tanggal_pengajuan, 
        total_hari_kerja 
      },
      { transaction: t }
    );
    const newRequestId = newRequest.id;

    // 2️⃣ Buat documents jika ada
    if (documents?.length) {
      // FIX IDOR: Ambil ID user dari token (req.user.id)
      const uploaderId = req.user.id; 
      await Document.bulkCreate(
        documents.map((d) => ({
          ...d,
          request_id: newRequestId,
          uploaded_by: uploaderId, // <-- FIX IDOR: Ambil dari token
        })),
        { transaction: t }
      );
    }

    // 3️⃣ Buat datasets dan variabel terkait
    const allVariablesToCreate = [];

    if (datasets?.length) {
      await Promise.all(datasets.map(async (d) => {
        // a. Buat RequestedDataset
        const newDataset = await RequestedDataset.create(
          {
            request_id: newRequestId,
            tema_data: d.tema_data,
            format_file: d.format_file,
          },
          { transaction: t }
        );

        // b. Siapkan data SelectedVariable (variabel yang dipilih)
        if (d.variables?.length) {
          d.variables.forEach((variableName) => {
            allVariablesToCreate.push({
              requested_dataset_id: newDataset.id,
              variable_name: variableName,
            });
          });
        }
      }));

      // c. Simpan semua SelectedVariable secara massal (bulkCreate)
      if (allVariablesToCreate.length > 0) {
          await SelectedVariable.bulkCreate(allVariablesToCreate, { transaction: t });
      }
    }

    // 4️⃣ Buat stages jika ada, pastikan enum valid
    const validStatuses = ["menunggu", "proses", "selesai"];
    if (stages?.length) {
      await RequestStage.bulkCreate(
        stages.map((s) => ({
          request_id: newRequestId,
          tahap: s.tahap, 
          status: validStatuses.includes(s.status) ? s.status : "menunggu",
          tanggal_mulai: s.tanggal_mulai || null,
          tanggal_selesai: s.tanggal_selesai || null,
          hari_kerja: s.hari_kerja || null,
          keterangan: s.keterangan || null,
        })),
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ 
      success: true, 
      message: "Permohonan berhasil dibuat", 
      data: newRequest,
    });
  } catch (error) {
    await t.rollback();
    console.error("🚨 Error createRequest:", error);
    
    // FIX UNIQUE CONSTRAINT HANDLING
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path || 'nomor_permohonan';
      return res.status(409).json({ 
        success: false, 
        message: `Gagal membuat permohonan. Nilai ${field} ('${req.body[field]}') sudah ada. Mohon masukkan ${field} yang unik.`, 
        error: error.message 
      });
    }

    res.status(500).json({ success: false, message: "Gagal membuat permohonan", error });
  }
};

// UPDATE request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    // Tambahkan logic otorisasi jika diperlukan (misal: user hanya bisa update request-nya sendiri)
    // if (req.user.role === 'user' && request.user_id !== req.user.id) { ... }

    await request.update(req.body);
    res.status(200).json({ success: true, message: "Permohonan berhasil diperbarui", data: request });
  } catch (error) {
    console.error("🚨 Error updateRequest:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui data", error });
  }
};

// DELETE request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    // Tambahkan logic otorisasi: hanya admin yang boleh menghapus (sudah di middleware)

    await request.destroy();
    res.status(200).json({ success: true, message: "Permohonan dan data terkait berhasil dihapus" });
  } catch (error) {
    console.error("🚨 Error deleteRequest:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus data", error });
  }
};
