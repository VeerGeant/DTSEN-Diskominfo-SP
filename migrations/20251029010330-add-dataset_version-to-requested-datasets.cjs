'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up (queryInterface, Sequelize) {
// Menambahkan kolom dataset_version ke tabel 'requested_datasets'
await queryInterface.addColumn('requested_datasets', 'dataset_version', {
type: Sequelize.STRING,
allowNull: true, // Diizinkan null karena diisi setelah request selesai
after: 'format_file', // Opsional: atur posisi kolom
});
},

async down (queryInterface, Sequelize) {
// Hapus kolom dataset_version saat rollback
await queryInterface.removeColumn('requested_datasets', 'dataset_version');
}
};