// Import the database connection instance
const { sequelize, testConnection } = require('./database/connection');

// Import all models. Importing them here ensures they are defined
// before we try to sync them with the database.
const User = require('./database/models/user.model');
const Product = require('./database/models/product.model');

async function syncAllModels() {
  // First, test the connection to ensure we can connect to the DB.
  await testConnection();

  try {
    // Sync all models at once. This is a simple way to create all tables.
    // WARNING: `force: true` will drop existing tables and data.
    // Use this only in development to start fresh.
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Error synchronizing models:', error);
  } finally {
    // If you were not running a server, you might close the connection here.
    // Since this is part of a larger application, the connection would typically
    // remain open as long as the server is running.
  }
}

// Run the sync function
syncAllModels();
