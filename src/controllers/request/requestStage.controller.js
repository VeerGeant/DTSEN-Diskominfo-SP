import models from "../../models/index.js";
const { RequestStage } = models;

export const getStagesByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const stages = await RequestStage.findAll({ where: { request_id: requestId } });
    res.status(200).json({ success: true, data: stages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil tahapan", error });
  }
};

export const updateStageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tanggal_mulai, tanggal_selesai, keterangan } = req.body;

    const stage = await RequestStage.findByPk(id);
    if (!stage) return res.status(404).json({ success: false, message: "Tahap tidak ditemukan" });

    await stage.update({ status, tanggal_mulai, tanggal_selesai, keterangan });
    res.status(200).json({ success: true, message: "Status tahapan diperbarui", data: stage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui tahapan", error });
  }
};
