// const express = require('express');

// // Create the Express application
// const app = express();

// // Define the port the server will run on
// const PORT = process.env.PORT || 3000;

// // Middleware to parse incoming JSON requests
// app.use(express.json());

// // A simple "Hello World" route to test if the server is working
// app.get('/', (req, res) => {
//   res.send('Hello World! Our E-commerce API is running.');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './database/connection.js';
import dotenv from 'dotenv';
// const bodyParser = require('body-parser');
// const sequelize = require('./database/connection');  // Correctly import sequelize

// Import models and associations
import User from './database/models/user.model.js';
import Product from './database/models/product.model.js';
import Order from './database/models/order.model.js';
import OrderItem from './database/models/order_item.model.js';
import Cart from './database/models/cart.model.js';
import CartItem from './database/models/cart_item.model.js';
import Test from './database/models/test.model.js';
// Ensure associations are set up
// We import the association file to set up relationships between models.
// const User = require('./database/models/user.model');
// const Product = require('./database/models/product.model');
// const Order = require('./database/models/order.model');
// const OrderItem = require('./database/models/order_item.model');
// require('./database/association');  // Ensure associations are set up

import './database/association.js'
// Import routes
import userRoutes from './api/routes/user.routes.js';
import productRoutes from './api/routes/products.routes.js';
import orderRoutes from './api/routes/order.routes.js';
import cartRoutes from './api/routes/cart.routes.js';
//
// const userRoutes = require('./api/routes/user.routes');
// const productRoutes = require('./api/routes/products.routes');
// const orderRoutes = require('./api/routes/order.routes');
// const cartRoutes = require('./api/routes/cart.routes');

// const cors = require('cors');
import cors from 'cors';


const app = express();
dotenv.config();
const PORT = process.env.DB_PORT;


// Enable CORS for requests from localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Allow only your frontend to access the API
  methods: 'GET, POST, PUT, DELETE',  // Specify allowed HTTP methods
  credentials: true,  // Allow cookies or authorization headers
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up API routes
// For user-related routes, we use the userRoutes module.
app.use('/api/users', userRoutes);

// For product-related routes, we directly require the product routes module.
app.use('/api/products', productRoutes);

// For order-related routes, we directly require the order routes module.
app.use('/api/orders', orderRoutes);

// For cart-related routes, we directly require the cart routes module.
app.use('/api/cart', cartRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API!');
});

// Function to connect to the database and start the server
async function setupDatabaseAndServer() {
  try {
    // Log the sequelize instance to verify it's correct
    console.log(sequelize);  // Check if it's valid

    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with the database
    await sequelize.sync() // Use caution with force: true
    console.log('All models were synchronized successfully.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start the server:');
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Start the setup process
setupDatabaseAndServer();
