import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DatasetVariable = sequelize.define(
  "DatasetVariable",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tema_data: {
      type: DataTypes.ENUM("Set Data Keluarga", "Set Data Anggota Keluarga (Individu)"),
      allowNull: false,
    },
    variable_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "dataset_variables",
    timestamps: false,
  }
);

export default DatasetVariable;
