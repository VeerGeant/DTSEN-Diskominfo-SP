// // models/tokenBlacklist.model.js
// export const createBlacklistedTokensTable = `
// CREATE TABLE IF NOT EXISTS blacklisted_tokens (
//   id SERIAL PRIMARY KEY,
//   token TEXT NOT NULL,
//   blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   expires_at TIMESTAMP NOT NULL
// );
// `;
import { DataTypes } from "sequelize";

const BlacklistedTokenModel = (sequelize) => {
  const BlacklistedToken = sequelize.define(
    "BlacklistedToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true, // Token harus unik
      },
      blacklisted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "blacklisted_tokens",
      timestamps: false, // Tidak menggunakan created_at/updated_at default Sequelize
      underscored: true,
    }
  );

  return BlacklistedToken;
};

export default BlacklistedTokenModel;