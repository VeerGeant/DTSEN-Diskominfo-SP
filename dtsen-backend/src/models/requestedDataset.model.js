// File: models/requestedDataset.model.js (FULL VERSION)

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Request from "./request.model.js";

const RequestedDataset = sequelize.define(
  "RequestedDataset",
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
    tema_data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format_file: {
      type: DataTypes.ENUM("csv", "xlsx", "json", "html5", "xml", "yaml", "ansi"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "requested_datasets",
    timestamps: false,
  }
);

RequestedDataset.belongsTo(Request, { foreignKey: "request_id", as: "request" });
Request.hasMany(RequestedDataset, { foreignKey: "request_id", as: "requested_datasets" });

export default RequestedDataset;