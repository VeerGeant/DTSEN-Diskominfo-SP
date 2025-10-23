// File: models/index.js (MODIFIED FULL VERSION)

import sequelize from "../config/db.js";
import Request from "./request.model.js";
import Document from "./document.model.js";
import RequestedDataset from "./requestedDataset.model.js";
import DatasetVariable from "./datasetVariable.model.js";
import RequestStage from "./requestStage.model.js";
import UserModel from "./user.model.js";
import OtpCodeModel from "./otp_code.js";
import SelectedVariableModel from "./selectedVariable.model.js"; // ✅ IMPORT BARU
import { DataTypes } from "sequelize";

const User = UserModel(sequelize, DataTypes);
const OtpCode = OtpCodeModel(sequelize, DataTypes);
const SelectedVariable = SelectedVariableModel(sequelize, DataTypes); // ✅ INSTATIASI BARU

// Relasi User (EXISTING)
User.hasMany(OtpCode, { foreignKey: "user_id", onDelete: "CASCADE" });
OtpCode.belongsTo(User, { foreignKey: "user_id" });

// ===================================
// RELASI BARU: RequestedDataset <--> SelectedVariable
// ===================================
RequestedDataset.hasMany(SelectedVariable, {
  foreignKey: "requested_dataset_id",
  onDelete: "CASCADE",
  as: "selected_variables", // Alias untuk eager loading
});
SelectedVariable.belongsTo(RequestedDataset, {
  foreignKey: "requested_dataset_id",
  as: "requested_dataset", // Alias untuk eager loading
});

const models = {
  sequelize,
  Request,
  Document,
  RequestedDataset,
  DatasetVariable,
  RequestStage,
  User,
  OtpCode,
  SelectedVariable, // ✅ TAMBAH MODEL BARU
};

export { sequelize, User, OtpCode, SelectedVariable }; // ✅ TAMBAH MODEL BARU KE NAMED EXPORTS
export default models;