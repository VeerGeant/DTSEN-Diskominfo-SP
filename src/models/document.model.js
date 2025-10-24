import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Request from "./request.model.js";

const Document = sequelize.define(
  "Document",
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
    jenis_dokumen: {
      type: DataTypes.ENUM(
        "formulir_permohonan",
        "surat_pernyataan",
        "kak",
        "penetapan_kelembagaan",
        "dokumen_pendukung"
      ),
      allowNull: false,
    },
    nama_dokumen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "documents",
    underscored: true,
    timestamps: true,
  }
);

// Relasi
Document.belongsTo(Request, { foreignKey: "request_id", as: "request" });
Request.hasMany(Document, { foreignKey: "request_id", as: "documents" });

export default Document;
