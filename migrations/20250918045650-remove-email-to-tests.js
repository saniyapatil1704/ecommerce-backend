'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  // The 'up' function removes the column from the 'tests' table
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('tests', 'email');
  },

  // The 'down' function adds the column back, allowing for rollback
  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('tests', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  }
};