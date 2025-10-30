'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
        // 1. HAPUS CONSTRAINT ENUM LAMA: Ubah kolom menjadi STRING sementara
        // Ini memungkinkan kita untuk memasukkan nilai 'serah_terima' tanpa error validasi ENUM.
        await queryInterface.changeColumn('request_stages', 'tahap', {
            type: Sequelize.STRING, 
            allowNull: false,
        }, { transaction });
        
        // 2. UPDATE DATA LAMA: Ubah semua nilai 'unduh_data' dan 'bast' menjadi 'serah_terima'
        await queryInterface.sequelize.query(
            `UPDATE request_stages SET tahap = 'serah_terima' WHERE tahap IN ('unduh_data', 'bast')`,
            { transaction }
        );

        // 3. DROP TIPE ENUM yang lama
        // Gunakan nama tipe ENUM default PostgreSQL
        await queryInterface.sequelize.query('DROP TYPE "enum_request_stages_tahap"', { transaction });

        // 4. RE-CREATE KOLOM dengan ENUM BARU
        await queryInterface.changeColumn('request_stages', 'tahap', {
            type: Sequelize.ENUM(
                "menyiapkan_dokumen",
                "ttd_gubernur",
                "dikirim",
                "verifikasi_teknis",
                "verifikasi_substansi",
                "koordinator",
                "pengolahan_data",
                "cek_kualitas",
                "serah_terima", // Nilai baru
                "selesai"
            ),
            allowNull: false,
        }, { transaction });

        await transaction.commit();
        
    } catch (error) {
        // Jika ada kesalahan, batalkan semua operasi
        await transaction.rollback();
        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert logic (untuk rollback)
    const transaction = await queryInterface.sequelize.transaction();
    try {
        // 1. Ubah kembali 'serah_terima' menjadi 'unduh_data' (asumsi rollback)
        await queryInterface.sequelize.query(
            `UPDATE request_stages SET tahap = 'unduh_data' WHERE tahap = 'serah_terima'`,
            { transaction }
        );

        // 2. Ulangi proses drop dan recreate ke ENUM lama
        await queryInterface.changeColumn('request_stages', 'tahap', { type: Sequelize.STRING }, { transaction });
        await queryInterface.sequelize.query('DROP TYPE "enum_request_stages_tahap"', { transaction });

        await queryInterface.changeColumn('request_stages', 'tahap', {
            type: Sequelize.ENUM(
                "menyiapkan_dokumen", "ttd_gubernur", "dikirim", "verifikasi_teknis", 
                "verifikasi_substansi", "koordinator", "pengolahan_data", "cek_kualitas", 
                "unduh_data", "bast", "selesai" // Nilai lama
            ),
            allowNull: false,
        }, { transaction });
        
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
  }
};