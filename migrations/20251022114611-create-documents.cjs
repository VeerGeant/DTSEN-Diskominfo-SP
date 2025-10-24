// export async function up(queryInterface, Sequelize) {
//   await queryInterface.createTable('documents', {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     request_id: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: { model: 'requests', key: 'id' },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     },
//     jenis_dokumen: {
//       type: Sequelize.ENUM(
//         "formulir_permohonan",
//         "surat_pernyataan",
//         "kak",
//         "penetapan_kelembagaan",
//         "dokumen_pendukung"
//       ),
//       allowNull: false,
//     },
//     nama_dokumen: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     file_url: {
//       type: Sequelize.TEXT,
//       allowNull: false,
//     },
//     file_type: Sequelize.STRING,
//     keterangan: Sequelize.TEXT,
//     uploaded_by: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//     },
//     created_at: {
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.fn('NOW'),
//     },
//     updated_at: {
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.fn('NOW'),
//     },
//   });
// }

// export async function down(queryInterface) {
//   await queryInterface.dropTable('documents');
// }

// migrations/20251022114611-create-documents.cjs
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
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
        onUpdate: 'CASCADE',
      },
      jenis_dokumen: {
        type: Sequelize.ENUM(
          "formulir_permohonan",
          "surat_pernyataan",
          "kak",
          "penetapan_kelembagaan",
          "dokumen_pendukung"
        ),
        allowNull: false,
      },
      nama_dokumen: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      file_type: Sequelize.STRING,
      keterangan: Sequelize.TEXT,
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
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
    await queryInterface.dropTable('documents');
  }
};