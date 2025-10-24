'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'selected_variables'
     */
    await queryInterface.createTable('selected_variables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Foreign Key ke RequestedDataset
      requested_dataset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'requested_datasets', // Nama tabel yang direferensikan
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      variable_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Timestamps (karena kita menggunakan `timestamps: true` dan `underscored: true` di model)
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      // Opsi: Pastikan nama tabel cocok
      tableName: 'selected_variables',
      // Anda bisa menambahkan opsi lain seperti `charset`, `collate` di sini jika diperlukan
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk menghapus tabel saat rollback
     */
    await queryInterface.dropTable('selected_variables');
  }
};