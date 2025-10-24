import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ✅ TAMBAH FIELD: NIP
    nip: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Asumsi NIP bersifat unik
    },
    // ✅ TAMBAH FIELD: Jabatan
    jabatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "inactive"),
      defaultValue: "pending",
    },
    instansi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "users",
    timestamps: true,
    underscored: true,
  });

  return User;
};

export default UserModel;