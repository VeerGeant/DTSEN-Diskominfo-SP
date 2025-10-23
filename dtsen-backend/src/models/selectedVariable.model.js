// File: models/selectedVariable.model.js

import { DataTypes } from "sequelize";

const SelectedVariableModel = (sequelize) => {
  const SelectedVariable = sequelize.define(
    "SelectedVariable",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign Key ke tabel RequestedDataset (Tema Data yang diminta)
      requested_dataset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requested_datasets", // Nama tabel yang direferensikan
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Nama variabel yang dipilih (contoh: 'NIK Keluarga', 'Jenis Kelamin')
      variable_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "selected_variables",
      timestamps: true,
      underscored: true,
    }
  );

  return SelectedVariable;
};

export default SelectedVariableModel;