'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tambahkan kolom user_id (Foreign Key ke tabel users)
    await queryInterface.addColumn('requests', 'user_id', {
      type: Sequelize.INTEGER,
      // Dibuat allowNull: true untuk mengakomodasi data lama yang mungkin sudah ada
      // sebelum kolom ini ditambahkan. Setelah data diverifikasi, bisa diubah menjadi false.
      allowNull: true, 
      references: {
        model: 'users', // Mereferensikan tabel users
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Jika pengguna dihapus, user_id di request di-set NULL
    });

    // 2. Tambahkan index untuk optimasi query berdasarkan user
    await queryInterface.addIndex('requests', ['user_id']);
  },

  async down(queryInterface) {
    // Hapus index
    await queryInterface.removeIndex('requests', ['user_id']);
    // Hapus kolom user_id saat rollback
    await queryInterface.removeColumn('requests', 'user_id');
  }
};