// File: request.controller.js (MODIFIED FULL VERSION)

import models from "../../models/index.js";
// ✅ Pastikan SelectedVariable di-destructure di sini
const { Request, Document, RequestedDataset, RequestStage, SelectedVariable, sequelize } = models;

// GET all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      // ✅ Tambahkan selected_variables ke RequestedDataset untuk eager loading
      include: [
        { model: Document, as: "documents" },
        { model: RequestedDataset, as: "requested_datasets", 
          include: [{ model: SelectedVariable, as: "selected_variables" }]
        },
        { model: RequestStage, as: "stages" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data permohonan berhasil diambil",
      data: requests,
    });
  } catch (error) {
    console.error("Error getAllRequests:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data", error });
  }
};

// GET one request
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id, {
      // ✅ Tambahkan selected_variables ke RequestedDataset untuk eager loading
      include: [
        { model: Document, as: "documents" },
        { model: RequestedDataset, as: "requested_datasets",
          include: [{ model: SelectedVariable, as: "selected_variables" }]
        },
        { model: RequestStage, as: "stages" },
      ],
    });

    if (!request)
      return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Error getRequestById:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data", error });
  }
};

// CREATE new request (MODIFIED LOGIC)
export const createRequest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      nama_instansi,
      unit_kerja,
      nomor_permohonan,
      tema_data,
      tanggal_pengajuan,
      total_hari_kerja,
      documents,
      datasets, // Kini mengandung data tema dan array 'variables'
      stages,
    } = req.body;

    // 1️⃣ Buat request utama
    const newRequest = await Request.create(
      { nama_instansi, unit_kerja, nomor_permohonan, tema_data, tanggal_pengajuan, total_hari_kerja },
      { transaction: t }
    );
    const newRequestId = newRequest.id;

    // 2️⃣ Buat documents jika ada
    if (documents?.length) {
      await Document.bulkCreate(
        documents.map((d) => ({
          ...d,
          request_id: newRequestId,
          // ⚠️ Peringatan: Pastikan logika uploaded_by Anda sudah benar, 
          // misalnya d.uploaded_by: req.user.id
        })),
        { transaction: t }
      );
    }

    // 3️⃣ Buat datasets dan variabel terkait (Logic BARU)
    const allVariablesToCreate = [];

    if (datasets?.length) {
      // Kita perlu membuat dataset satu per satu untuk mendapatkan ID-nya (newDataset.id)
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
              requested_dataset_id: newDataset.id, // Gunakan ID dataset yang baru dibuat
              variable_name: variableName,
            });
          });
        }
      }));

      // c. Simpan semua SelectedVariable secara massal (bulkCreate)
      if (allVariablesToCreate.length > 0) {
          // ✅ Menggunakan SelectedVariable model
          await SelectedVariable.bulkCreate(allVariablesToCreate, { transaction: t });
      }
    }

    // 4️⃣ Buat stages jika ada, pastikan enum valid
    const validStatuses = ["menunggu", "proses", "selesai"];
    if (stages?.length) {
      await RequestStage.bulkCreate(
        stages.map((s) => ({
          request_id: newRequestId,
          tahap: s.tahap, // enum tahap
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
    res.status(201).json({ success: true, message: "Permohonan berhasil dibuat", data: newRequest });
  } catch (error) {
    await t.rollback();
    console.error("Error createRequest:", error);
    res.status(500).json({ success: false, message: "Gagal membuat permohonan", error });
  }
};

// UPDATE request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    await request.update(req.body);
    res.status(200).json({ success: true, message: "Permohonan berhasil diperbarui", data: request });
  } catch (error) {
    console.error("Error updateRequest:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui data", error });
  }
};

// DELETE request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ success: false, message: "Request tidak ditemukan" });

    await request.destroy();
    res.status(200).json({ success: true, message: "Permohonan dan data terkait berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteRequest:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus data", error });
  }
};