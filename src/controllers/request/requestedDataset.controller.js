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
