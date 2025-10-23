export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('requested_datasets', {
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
    tema_data: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    format_file: {
      type: Sequelize.ENUM("csv", "xlsx", "json", "html5", "xml", "yaml", "ansi"),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('requested_datasets');
}
