'use strict';

/** @type {import('sequelize-cli').Migration} */
export default  {
  // The "up" function is for applying the migration
  async up (queryInterface, Sequelize) {
    /**
     * Here, you define the changes you want to apply to your database schema.
     * This function adds the new 'email' column to the 'Users' table.
     */
    return queryInterface.addColumn('tests', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  // The "down" function is for reversing the migration
  async down (queryInterface, Sequelize) {
    /**
     * Here, you define the steps to reverse the 'up' function.
     * This function removes the 'email' column from the 'Users' table.
     * It's crucial for rolling back changes if needed.
     */
    return queryInterface.removeColumn('tests', 'email');
  }
};