// File: models/index.js (FINALIZED VERSION)

import sequelize from "../config/db.js";
import Request from "./request.model.js";
import Document from "./document.model.js";
import RequestedDataset from "./requestedDataset.model.js";
import DatasetVariable from "./datasetVariable.model.js";
import RequestStage from "./requestStage.model.js";
import UserModel from "./user.model.js";
import OtpCodeModel from "./otp_code.js";
import SelectedVariableModel from "./selectedVariable.model.js"; 
import BlacklistedTokenModel from "./tokenBlacklisted.model.js"; // ✅ Tambah Import
import { DataTypes } from "sequelize";

const User = UserModel(sequelize, DataTypes);
const OtpCode = OtpCodeModel(sequelize, DataTypes);
const SelectedVariable = SelectedVariableModel(sequelize, DataTypes); 
const BlacklistedToken = BlacklistedTokenModel(sequelize, DataTypes); // ✅ Instansiasi Model

// Relasi User (EXISTING)
User.hasMany(OtpCode, { foreignKey: "user_id", onDelete: "CASCADE" });
OtpCode.belongsTo(User, { foreignKey: "user_id" });

// ✅ TAMBAH RELASI: User <--> Request
User.hasMany(Request, { foreignKey: "user_id", as: "requests" });
Request.belongsTo(User, { foreignKey: "user_id", as: "user" });

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
  SelectedVariable, 
  BlacklistedToken, // ✅ Tambah Model ke Export Default
};

// ✅ Ekspor Model BlacklistedToken agar bisa diimpor menggunakan named import
export { sequelize, User, OtpCode, SelectedVariable, BlacklistedToken }; 
export default models;