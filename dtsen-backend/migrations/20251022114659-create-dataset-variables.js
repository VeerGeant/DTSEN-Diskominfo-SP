export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('dataset_variables', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tema_data: {
      type: Sequelize.ENUM("Set Data Keluarga", "Set Data Anggota Keluarga (Individu)"),
      allowNull: false,
    },
    variable_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('dataset_variables');
}
