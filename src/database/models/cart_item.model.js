// const { DataTypes } = require('sequelize');
// const  sequelize  = require('../connection');

// /**
//  * @description Represents a single product with a specific quantity in a user's cart.
//  * This table links a Cart to a Product.
//  */
// const CartItem = sequelize.define('CartItem', {
//     // A unique ID for each cart item.
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     // The quantity of the product in the cart.
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 1
//     }
// }, {
//     tableName: 'cart_items',
//     timestamps: true // This will automatically add createdAt and updatedAt columns
// });

// module.exports = CartItem;



/**
 * @fileoverview Defines the CartItem model for the application.
 * This model serves as a "junction table" or "join table" to connect a Cart to a Product.
 * It's how we represent a many-to-many relationship: a cart can have many products,
 * and a product can be in many different carts.
//  */

// // We import 'DataTypes' to define our column types.
// import { DataTypes } from 'sequelize';

// // We import our configured 'sequelize' instance, our database connection.
// import sequelize from '../connection.js';

// // --- Model Definition ---

// /**
//  * Defines the CartItem model.
//  * The model name is 'CartItem', which maps to the 'cart_items' table.
//  *
//  * This table will hold two foreign keys (cartId and productId) which will be
//  * added automatically by Sequelize when we define the model associations.
//  * It also holds the `quantity` of a product within a specific cart.
//  */
// const CartItem = sequelize.define('CartItem', {
//     // Defines the 'id' column for each specific item entry in the cart.
//     id: {
//         // The data type is an INTEGER.
//         type: DataTypes.INTEGER,
//         // Automatically adds a new, unique number for each new item.
//         autoIncrement: true,
//         // Sets this as the primary key.
//         primaryKey: true,
//     },
    
//     // Defines the 'quantity' column.
//     // This tells us how many of a specific product are in the cart.
//     quantity: {
//         // The data type is an INTEGER.
//         type: DataTypes.INTEGER,
//         // The quantity cannot be null.
//         allowNull: false,
//         // If a new item is added without a quantity, it defaults to 1.
//         defaultValue: 1
//     }
// }, {
//     // --- Model Options ---

//     // Explicitly sets the table name to 'cart_items'.
//     tableName: 'cart_items',
    
//     // Automatically adds `createdAt` and `updatedAt` columns.
//     timestamps: true
// });

// // --- Exporting the Model ---

// // Exports the CartItem model using ES6 syntax.
// export default CartItem;


// models/cartItem.js
import { DataTypes } from "sequelize";
import sequelize from "../connection.js";
import Product from "./product.model.js";
import Cart from "./cart.model.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
        autoIncrement: true,  // ✅ Add this

    // defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "carts", // table name in DB
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "products", // table name of products
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: "cart_items",
  timestamps: true,
});

// // Associations
// Cart.hasMany(CartItem, { as: "items", foreignKey: "cartId" });
// CartItem.belongsTo(Cart, { foreignKey: "cartId" });

export default CartItem;
