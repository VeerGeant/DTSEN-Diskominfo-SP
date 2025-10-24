'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Sesuai dengan model Anda
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // ✅ TAMBAH KOLOM: NIP
      nip: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      // ✅ TAMBAH KOLOM: Jabatan
      jabatan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        // Mendefinisikan ENUM secara eksplisit
        type: Sequelize.ENUM('user', 'admin', 'superadmin'),
        defaultValue: 'user',
        allowNull: false
      },
      status: {
        // Mendefinisikan ENUM secara eksplisit
        type: Sequelize.ENUM('active', 'pending', 'inactive'),
        defaultValue: 'pending',
        allowNull: false
      },
      instansi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      no_hp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Kolom timestamps, menggunakan underscored: true
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      tableName: 'users',
      // Anda mungkin ingin menambahkan opsi lain seperti `charset` dan `collate` di sini
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};