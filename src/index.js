// Import the database connection instance
const { sequelize, testConnection } = require('./database/connection');

// Import all models to ensure they are defined before we sync
const User = require('./database/models/user.model');
const Product = require('./database/models/product.model');
const Order = require('./database/models/order.model');
const OrderItem = require('./database/models/order_item.model');

// Import the associations file to set up all relationships
require('./database/association');

async function syncAllModels() {
  // First, test the connection to ensure we can connect to the DB.
  // await testConnection();

  try {
    // Sync all models at once. This will create all tables and their relationships.
    // WARNING: `force: true` will drop existing tables and data.
    // Use this only in development to start fresh.
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
}

// Run the sync function
syncAllModels();
