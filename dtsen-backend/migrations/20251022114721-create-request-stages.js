export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('request_stages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'requests', key: 'id' },
      onDelete: 'CASCADE',
    },
    tahap: {
      type: Sequelize.ENUM(
        "menyiapkan_dokumen",
        "ttd_gubernur",
        "dikirim",
        "verifikasi_teknis",
        "verifikasi_substansi",
        "koordinator",
        "pengolahan_data",
        "cek_kualitas",
        "unduh_data",
        "bast",
        "selesai"
      ),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("menunggu", "proses", "selesai"),
      defaultValue: "menunggu",
    },
    tanggal_mulai: Sequelize.DATEONLY,
    tanggal_selesai: Sequelize.DATEONLY,
    hari_kerja: Sequelize.INTEGER,
    keterangan: Sequelize.TEXT,
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('request_stages');
}
