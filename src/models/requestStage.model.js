import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Request from "./request.model.js";

const RequestStage = sequelize.define(
  "RequestStage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "requests",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tahap: {
      type: DataTypes.ENUM(
        "menyiapkan_dokumen",
        "ttd_gubernur",
        "dikirim",
        "verifikasi_teknis",
        "verifikasi_substansi",
        "koordinator",
        "pengolahan_data",
        "cek_kualitas",
        "serah_terima", // NILAI BARU
        "selesai"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("menunggu", "proses", "selesai"),
      defaultValue: "menunggu",
    },
    tanggal_mulai: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tanggal_selesai: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    hari_kerja: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ✅ KOLOM BARU: Tanggal DTSEN Diterima
    tanggal_dtsen_diterima: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "request_stages",
    underscored: true,
    timestamps: true,
  }
);

// Relasi
RequestStage.belongsTo(Request, { foreignKey: "request_id", as: "request" });
Request.hasMany(RequestStage, { foreignKey: "request_id", as: "stages" });

export default RequestStage;
