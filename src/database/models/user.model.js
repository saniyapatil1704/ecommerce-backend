// const { DataTypes } = require('sequelize');



// const sequelize = require('../connection');  // Import sequelize directly, no destructuring


// // Define the User model
// // This is where we define the database schema for the users table.
// console.log("sequelize from user.model.js ",sequelize);  // Log the sequelize instance

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password_hash: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// }, {
//   // Model options
//   tableName: 'users',
//   timestamps: true // Automatically adds createdAt and updatedAt columns
// });

// // Export the User model
// module.exports = User;



/**
 * @fileoverview Defines the User model for the application.
 * This file sets up the 'users' table in the database using Sequelize.
 * It's where we define the columns (attributes) and their properties.
 */

// We import 'DataTypes' from the 'sequelize' library.
// We need this to tell our database what type of data each column will hold,
// like `STRING` for text or `INTEGER` for numbers.
import { DataTypes } from 'sequelize';

// We import our configured 'sequelize' instance from the connection file.
// This instance is our bridge to the database, and we use it to define our models.
import sequelize from '../connection.js';

// --- Model Definition ---

/**
 * Defines the User model.
 * The first argument, 'User', is the model name. Sequelize will automatically
 * look for a table named 'users' (the plural form) in the database.
 *
 * The second argument is an object that defines the columns (attributes) of our table.
 *
 * The third argument is an object for model options.
 */
const User = sequelize.define('User', {
    // Defines the 'id' column.
    id: {
        // The data type is an INTEGER (a whole number).
        type: DataTypes.INTEGER,
        // Tells the database to automatically add a new, unique number for each user.
        autoIncrement: true,
        // This column is the unique identifier for each row. This is a fundamental concept in databases.
        primaryKey: true,
    },
    
    // Defines the 'email' column.
    email: {
        // The data type is a STRING (a text field).
        type: DataTypes.STRING,
        // `allowNull: false` means this column cannot be empty. It is a required field.
        allowNull: false,
        // `unique: true` ensures that no two users can have the same email address.
        unique: true
    },
    
    // Defines the 'password_hash' column.
    // We store a hashed password here, which is a long string of characters.
    password_hash: {
        // The data type is a STRING.
        type: DataTypes.STRING,
        // This column is also required.
        allowNull: false
    }
}, {
    // --- Model Options ---

    // `tableName: 'users'` explicitly tells Sequelize to use the 'users' table in the database.
    // It's good practice to specify this, even if Sequelize would guess it correctly.
    tableName: 'users',
    
    // `timestamps: true` automatically adds two columns to our table:
    // `createdAt` and `updatedAt`. These columns will store the date and time
    // a user was created and last updated. This is very common for tracking data.
    timestamps: true 
});

// --- Exporting the Model ---

// `export default User;` uses the ES6 module syntax to export the User model.
// This allows other files (like controllers or services) to import and use it.
export default User;