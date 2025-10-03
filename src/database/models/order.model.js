// // const { DataTypes } = require('sequelize');
// // const  sequelize  = require('../connection');

// import { DataTypes } from 'sequelize';
// import sequelize from '../connection';

// // Define the Order model
// const Order = sequelize.define('Order', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   totalAmount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   // userId: {
//   //   type: DataTypes.INTEGER,
//   //   allowNull: false
//   // },
//   status: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 'pending'
//   }
// }, {
//   tableName: 'orders',
//   timestamps: true // This automatically adds `createdAt` and `updatedAt` columns
// });

// module.exports = Order;



/**
 * @fileoverview Defines the Order model for the application.
 * This model represents a customer's order and its details, such as total amount and status.
 * It will be associated with the User and OrderItem models.
 */

// We import 'DataTypes' to define our column types.
import { DataTypes } from 'sequelize';

// We import our configured 'sequelize' instance, our database connection.
import sequelize from '../connection.js';

// --- Model Definition ---

/**
 * Defines the Order model.
 * The model name is 'Order', which maps to the 'orders' table.
 *
 * This table will store information about a user's purchase.
 */
const Order = sequelize.define('Order', {
    // Defines the 'id' column, the unique identifier for each order.
    id: {
        // The data type is an INTEGER.
        type: DataTypes.INTEGER,
        // Automatically adds a new, unique number for each new order.
        autoIncrement: true,
        // Sets this as the primary key.
        primaryKey: true,
    },
    
    // Defines the 'totalAmount' column.
    totalAmount: {
        // The DECIMAL(10, 2) data type is used for currency.
        // It holds numbers with up to 10 total digits, with 2 of them after the decimal point.
        type: DataTypes.DECIMAL(10, 2),
        // The total amount is a required field.
        allowNull: false
    },
    
    // This column is a foreign key that links an order to a specific user.
    // It's crucial for understanding which user placed which order.
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    
    // Defines the 'status' column.
    status: {
        // The data type is a STRING.
        type: DataTypes.STRING,
        // The status is a required field.
        allowNull: false,
        // Sets a default value of 'pending' for new orders.
        defaultValue: 'pending'
    }
}, {
    // --- Model Options ---

    // Explicitly sets the table name to 'orders'.
    tableName: 'orders',
    
    // Automatically adds `createdAt` and `updatedAt` columns.
    timestamps: true 
});

// --- Exporting the Model ---

// Exports the Order model using ES6 syntax for consistent formatting.
export default Order;
