// const { DataTypes } = require('sequelize');
// const sequelize = require('../connection');

// /**
//  * @description Represents a user's shopping cart.
//  * Each user has one cart, which holds multiple CartItems.
//  */
// const Cart = sequelize.define('Cart', {
//     // The id is a UUID and serves as the primary key.
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false,
//     },
// });

// module.exports = Cart;




/**
 * @fileoverview Defines the Cart model for the application.
 * This file sets up the 'carts' table in the database, which represents a user's shopping cart.
 * This model will be linked to the User and CartItem models.
 */

// We import 'DataTypes' to define our column types.
import { DataTypes } from 'sequelize';

// We import our configured 'sequelize' instance, our database connection.
import sequelize from '../connection.js';

// --- Model Definition ---

/**
 * Defines the Cart model.
 * The model name is 'Cart', and it maps to the 'carts' table in the database.
 * The Cart model holds a unique ID and will be associated with a User.
 * The actual products inside the cart will be stored in a separate table (e.g., 'CartItems').
 */
const Cart = sequelize.define('Cart', {
    // Defines the 'id' column, which serves as the primary key.
    id: {
        // Here, we use a UUID (Universally Unique Identifier) instead of an integer.
        // UUIDs are 128-bit numbers that are highly unlikely to be duplicated.
        // This is useful for distributed systems and preventing bots from guessing IDs.
        type: DataTypes.INTEGER,
            autoIncrement: true,  // ✅ Add this

        // `defaultValue: DataTypes.UUIDV4` tells Sequelize to automatically generate
        // a new random UUID (version 4) for each new cart.
        // defaultValue: DataTypes.UUIDV4,
        // This column is the primary key.
        primaryKey: true,
        // This column cannot be null, as every cart must have an ID.
        allowNull: false,
    },
}, {
    // --- Model Options ---

    // Explicitly sets the table name to 'carts' for clarity and consistency.
    tableName: 'carts',
    
    // `timestamps: true` adds `createdAt` and `updatedAt` columns automatically.
    timestamps: true 
});

// --- Exporting the Model ---

// Exports the Cart model using ES6 syntax.
export default Cart;