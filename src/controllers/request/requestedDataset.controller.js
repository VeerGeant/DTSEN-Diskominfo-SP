import models from "../../models/index.js";
const { RequestedDataset } = models;

export const getDatasetsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const datasets = await RequestedDataset.findAll({ where: { request_id: requestId } });
    res.status(200).json({ success: true, data: datasets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil dataset", error });
  }
};

export const createDataset = async (req, res) => {
  try {
    const { request_id, tema_data, format_file } = req.body;
    const dataset = await RequestedDataset.create({ request_id, tema_data, format_file });
    res.status(201).json({ success: true, data: dataset });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambahkan dataset", error });
  }
};

// FUNGSI BARU: Update Versi Dataset (oleh Admin)
export const updateDatasetVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const { dataset_version } = req.body;

        if (!dataset_version) {
            return res.status(400).json({ success: false, message: "Versi dataset diperlukan." });
        }

        const dataset = await RequestedDataset.findByPk(id);
        
        if (!dataset) {
            return res.status(404).json({ success: false, message: "Dataset tidak ditemukan." });
        }
        
        await dataset.update({ dataset_version });

        res.status(200).json({ 
            success: true, 
            message: "Versi dataset berhasil diperbarui.", 
            data: dataset 
        });

    } catch (error) {
        console.error("🚨 Error updating dataset version:", error);
        res.status(500).json({ success: false, message: "Gagal memperbarui versi dataset.", error: error.message });
    }
};
