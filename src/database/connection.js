// const { Sequelize } = require('sequelize');

// // Replace with your actual database credentials
// // For a production app, these should be stored in environment variables.
// const sequelize = new Sequelize('ecommerce_db', 'postgres', 'sanvik', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection to the database has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// // Export the sequelize instance and the test function
// module.exports = {
//   sequelize,
//   testConnection
// };

// const { Sequelize } = require('sequelize');

// // Create a new Sequelize instance and connect to your database
// const sequelize = new Sequelize('ecommerce_db', 'postgres', 'sanvik', {
//     host: 'localhost',
//     dialect: 'postgres',
//     logging: false // Set to true to see SQL queries in the console
// });

// // Test the database connection
// // We will test it in server.js, so no need for this here.
// console.log("sequelize from connection.js ",sequelize);  // Check if sequelize instance is valid

// module.exports = sequelize;

// import { Sequelize } from "sequelize";
// import dotenv from 'dotenv';

// dotenv.config();

// const host= process.env.DB_HOST;
// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
// const database = process.env.DB_DATABASE;
// // Create a new Sequelize instance and connect to your database
// const sequelize = new Sequelize(database, username, password, {
//   host: host,
//   dialect: "postgres",
//   logging: false, // Set to true to see SQL queries in the console
// });

// // Test the database connection
// // We will test it in server.js, so no need for this here.
// console.log("sequelize from connection.js ", sequelize); // Check if sequelize instance is valid

// export default sequelize;


import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Access the single connection URL from your environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  // Good practice to handle cases where the URL is missing
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1); 
}

// Create a new Sequelize instance using the connection URL
const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false, // Set to true to see SQL queries in the console
});

// Test the database connection
// We will test it in server.js, so no need for this here.
console.log("sequelize from connection.js ", sequelize); // Check if sequelize instance is valid

export default sequelize;