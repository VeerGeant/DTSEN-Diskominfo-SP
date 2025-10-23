const OtpCodeFactory = (sequelize, DataTypes) => {
  const OtpCode = sequelize.define(
    "OtpCode",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "otp_codes",
      timestamps: true,
      createdAt: "created_at",   // map Sequelize createdAt → created_at
      updatedAt: false,          // karena tidak ada kolom updated_at
    }
  );

  OtpCode.associate = (models) => {
    OtpCode.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return OtpCode;
};

export default OtpCodeFactory;
