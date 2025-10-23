import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_instansi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_kerja: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nomor_permohonan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tema_data: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "menyiapkan_dokumen",
        "ttd_gubernur",
        "dikirim",
        "verifikasi_teknis",
        "verifikasi_substansi",
        "koordinator",
        "pengolahan_data",
        "cek_kualitas",
        "unduh_data",
        "bast",
        "selesai"
      ),
      defaultValue: "menyiapkan_dokumen",
    },
    tanggal_pengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    total_hari_kerja: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "requests",
    underscored: true,
    timestamps: true,
  }
);

export default Request;
