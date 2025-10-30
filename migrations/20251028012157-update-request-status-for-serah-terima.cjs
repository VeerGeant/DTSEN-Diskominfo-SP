'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
        // 1. HAPUS CONSTRAINT ENUM LAMA: Ubah kolom menjadi STRING sementara
        await queryInterface.changeColumn('requests', 'status', {
            type: Sequelize.STRING, 
            allowNull: false,
        }, { transaction });
        
        // 2. UPDATE DATA LAMA: Ubah semua nilai 'unduh_data' dan 'bast' menjadi 'serah_terima'
        await queryInterface.sequelize.query(
            `UPDATE requests SET status = 'serah_terima' WHERE status IN ('unduh_data', 'bast')`,
            { transaction }
        );

        // 3. DROP TIPE ENUM yang lama
        await queryInterface.sequelize.query('DROP TYPE "enum_requests_status"', { transaction });

        // 4. RE-CREATE ENUM TIPE BARU (Membuat tipe ENUM di database)
        const enumValues = [
            "menyiapkan_dokumen", "ttd_gubernur", "dikirim", "verifikasi_teknis", 
            "verifikasi_substansi", "koordinator", "pengolahan_data", "cek_kualitas", 
            "serah_terima", "selesai"
        ];
        
        await queryInterface.sequelize.query(
            `DO $$ BEGIN 
                CREATE TYPE "public"."enum_requests_status" AS ENUM(${enumValues.map(v => `'${v}'`).join(', ')}); 
            EXCEPTION WHEN duplicate_object THEN NULL; END $$;`, 
            { transaction }
        );

        // 5. RE-CREATE KOLOM dengan ENUM BARU dan SET DEFAULT secara terpisah
        await queryInterface.sequelize.query(
            // Kunci: Gunakan `::TEXT` untuk mengkonversi nilai yang ada (yang saat ini STRING) ke ENUM baru
            `ALTER TABLE "requests" ALTER COLUMN "status" TYPE "public"."enum_requests_status" USING "status"::TEXT::"public"."enum_requests_status"`,
            { transaction }
        );
        
        // Atur nilai default setelah tipe kolom berhasil diubah
        await queryInterface.sequelize.query(
            `ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'menyiapkan_dokumen'`,
            { transaction }
        );

        await transaction.commit();
        
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Logic rollback (seperti di sesi sebelumnya)
    const transaction = await queryInterface.sequelize.transaction();
    try {
        // 1. Ubah kembali 'serah_terima' menjadi 'unduh_data' (untuk rollback)
        await queryInterface.sequelize.query(
            `UPDATE requests SET status = 'unduh_data' WHERE status = 'serah_terima'`,
            { transaction }
        );

        // 2. Ulangi proses drop dan recreate ke ENUM lama
        await queryInterface.changeColumn('requests', 'status', { type: Sequelize.STRING }, { transaction });
        await queryInterface.sequelize.query('DROP TYPE "enum_requests_status"', { transaction });

        await queryInterface.changeColumn('requests', 'status', {
            type: Sequelize.ENUM(
                "menyiapkan_dokumen", "ttd_gubernur", "dikirim", "verifikasi_teknis", 
                "verifikasi_substansi", "koordinator", "pengolahan_data", "cek_kualitas", 
                "unduh_data", "bast", "selesai" 
            ),
            defaultValue: "menyiapkan_dokumen",
            allowNull: false,
        }, { transaction });
        
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
  }
};