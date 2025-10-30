'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom file_data ke tabel 'documents'
    await queryInterface.addColumn('documents', 'file_data', {
      type: Sequelize.TEXT, // Menggunakan TEXT untuk string Base64 yang panjang
      allowNull: true,
    });
    
    // Opsional: Pastikan kolom file_url diubah menjadi allowNull: true 
    // jika Anda belum membuat migrasi untuk perubahan tersebut sebelumnya.
    await queryInterface.changeColumn('documents', 'file_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom file_data saat rollback
    await queryInterface.removeColumn('documents', 'file_data');
    
    // Opsional: Jika Anda mengubah file_url, kembalikan ke allowNull: false jika itu adalah setting aslinya
    // await queryInterface.changeColumn('documents', 'file_url', {
    //   type: Sequelize.TEXT,
    //   allowNull: false, 
    // });
  }
};