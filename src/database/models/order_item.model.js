// const { DataTypes } = require('sequelize');
// const  sequelize  = require('../connection');

// // Define the OrderItem model
// const OrderItem = sequelize.define('OrderItem', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 1
//   },
//   priceAtPurchase: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   }
// }, {
//   tableName: 'order_items',
//   timestamps: true // This automatically adds `createdAt` and `updatedAt` columns
// });

// module.exports = OrderItem;


/**
 * @fileoverview Defines the OrderItem model for the application.
 * This model serves as a "junction table" to connect an Order to a Product.
 * It's how we represent the many-to-many relationship: an order can have many products,
 * and a product can be in many different orders.
 */

// We import 'DataTypes' to define our column types.
import { DataTypes } from 'sequelize';

// We import our configured 'sequelize' instance, our database connection.
import sequelize from '../connection.js';

// --- Model Definition ---

/**
 * Defines the OrderItem model.
 * The model name is 'OrderItem', which maps to the 'order_items' table.
 *
 * This table will hold two foreign keys (orderId and productId) and the details
 * of a product within a specific order.
 */
const OrderItem = sequelize.define('OrderItem', {
    // Defines the 'id' column, the unique identifier for each item line in an order.
    id: {
        // The data type is an INTEGER.
        type: DataTypes.INTEGER,
        // Automatically adds a new, unique number for each new item.
        autoIncrement: true,
        // Sets this as the primary key.
        primaryKey: true,
    },
    
    // Defines the 'quantity' column.
    // This tells us how many of a specific product were ordered.
    quantity: {
        // The data type is an INTEGER.
        type: DataTypes.INTEGER,
        // The quantity cannot be null.
        allowNull: false,
        // Sets a default quantity of 1 for new items.
        defaultValue: 1
    },
    
    // Defines the 'priceAtPurchase' column.
    // This is a crucial field. It stores the product's price at the exact moment of purchase.
    // This prevents historical order data from changing if the product's price is updated later.
    priceAtPurchase: {
        // The DECIMAL(10, 2) data type is used for currency.
        type: DataTypes.DECIMAL(10, 2),
        // The price is a required field.
        allowNull: false
    }
}, {
    // --- Model Options ---

    // Explicitly sets the table name to 'order_items'.
    tableName: 'order_items',
    
    // Automatically adds `createdAt` and `updatedAt` columns.
    timestamps: true
});

// --- Exporting the Model ---

// Exports the OrderItem model using ES6 syntax.
export default OrderItem;