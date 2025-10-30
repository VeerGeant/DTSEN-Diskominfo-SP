// migrations/20251022114142-create-requests.cjs
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_instansi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit_kerja: Sequelize.STRING,
      nomor_permohonan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tema_data: Sequelize.STRING,
      status: {
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
        defaultValue: "menyiapkan_dokumen",
      },
      tanggal_pengajuan: Sequelize.DATEONLY,
      total_hari_kerja: Sequelize.INTEGER,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('requests');
  }
};