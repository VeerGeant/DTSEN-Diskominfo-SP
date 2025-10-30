'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.addColumn('request_stages', 'tanggal_dtsen_diterima', {
type: Sequelize.DATEONLY,
allowNull: true,
after: 'keterangan', // Tentukan posisi kolom (opsional)
});
},

async down(queryInterface) {
await queryInterface.removeColumn('request_stages', 'tanggal_dtsen_diterima');
}
};