// const express = require('express');
// const userController = require('../controllers/user.controller');

// // Create an Express Router instance
// const router = express.Router();

// // Define the user registration route.
// // This handles POST requests to /api/users/register.
// // It calls the `register` function in our user controller.
// router.post('/register', userController.register);

// module.exports = router;



import express from 'express';
import UserController from '../controllers/user.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

// Create an Express Router instance. This is a mini-application that
// defines a set of routes, which we can then "mount" on our main server.
const router = express.Router();

/**
 * @description: API endpoint for user registration.
 * @route POST /api/users/register
 * @access Public (anyone can create an account)
 */
router.post('/register', UserController.register);

/**
 * @description: API endpoint for user login.
 * @route POST /api/users/login
 * @access Public (anyone can log in with valid credentials)
 */
router.post('/login', UserController.login);



/**
 * @description: API endpoint to get the authenticated user's profile.
 * @route GET /api/users/profile
 * This route is protected by `authenticateToken` to ensure only a logged-in user
 * can view their profile.
 */
router.get('/profile', authenticateToken, UserController.getProfile);

/**
 * @description: API endpoint to update the authenticated user's profile.
 * @route PUT /api/users/profile
 * This route is protected by `authenticateToken` to ensure only a logged-in user
 * can update their profile.
 */
router.put('/profile', authenticateToken, UserController.updateProfile);


export default router;