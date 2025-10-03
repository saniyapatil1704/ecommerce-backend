// const { DataTypes } = require('sequelize');
// const sequelize  = require('../connection');

// // Define the Product model
// // This defines the database schema for the products table.
// const Product = sequelize.define('Product', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   stock: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   },
//   image_url: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },

// }, {
//   // Model options
//   tableName: 'products',
//   timestamps: true // Automatically adds createdAt and updatedAt columns
// });

// // Export the Product model
// module.exports = Product;


/**
 * @fileoverview Defines the Product model for the application.
 * This file sets up the 'products' table in the database using Sequelize.
 * It's where we define the columns (attributes) for each product and their data types.
 */

// We import 'DataTypes' from the 'sequelize' library to define our column types.
import { DataTypes } from 'sequelize';

// We import our configured 'sequelize' instance, which is our connection to the database.
import sequelize from '../connection.js';

// --- Model Definition ---

/**
 * Defines the Product model.
 * The model name is 'Product', which maps to the 'products' table.
 *
 * The second argument is an object defining the attributes (columns).
 * The third argument is an object for model options.
 */
const Product = sequelize.define('Product', {
    // Defines the 'id' column. It's a unique identifier for each product.
    id: {
        // The data type is an INTEGER (a whole number).
        type: DataTypes.INTEGER,
        // Automatically adds a new, unique number for each new product.
        autoIncrement: true,
        // Sets this as the primary key, meaning it uniquely identifies each row.
        primaryKey: true,
    },
    
    // Defines the 'name' column.
    name: {
        // Data type is a STRING (a text field, good for short text).
        type: DataTypes.STRING,
        // The product name is a required field.
        allowNull: false
    },
    
    // Defines the 'description' column.
    description: {
        // The TEXT data type is used for long text, like a product description.
        type: DataTypes.TEXT,
        // The description is optional.
        allowNull: true
    },
    
    // Defines the 'price' column.
    price: {
        // DECIMAL(10, 2) is the best data type for money.
        // It stores numbers with a fixed decimal point.
        // 10 is the total number of digits, and 2 is the number of digits after the decimal point.
        type: DataTypes.DECIMAL(10, 2),
        // The price is a required field.
        allowNull: false
    },
    
    // Defines the 'stock' column.
    stock: {
        // Data type is an INTEGER.
        type: DataTypes.INTEGER,
        // The stock count is required.
        allowNull: false,
        // If a new product is created without a stock value, it defaults to 0.
        defaultValue: 0
    },
    
    // Defines the 'image_url' column.
    image_url: {
        // Data type is a STRING, as a URL is a string of characters.
        type: DataTypes.STRING,
        // The image URL is optional.
        allowNull: true
    },
    
    // Defines the 'userId' column. This is a crucial column.
    // It's a foreign key that will link this product to a user in the 'users' table.
    // This establishes a relationship: one user can have many products.
    userId: {
        // Data type is an INTEGER, matching the `id` in the User model.
        type: DataTypes.INTEGER,
        // This is optional for now, but will likely be required when we set up the association.
        allowNull: true
    },

}, {
    // --- Model Options ---

    // Explicitly sets the table name to 'products' to avoid any issues.
    tableName: 'products',
    
    // `timestamps: true` automatically adds `createdAt` and `updatedAt` columns
    // to track when each product was created and last modified.
    timestamps: true 
});

// --- Exporting the Model ---

// Exports the Product model using ES6 syntax so other files can import it.
export default Product;