import express from 'express';
import CartController from '../controllers/cart.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';   

// Create an Express Router instance
const router = express.Router();

/**
 * @description: Protects all cart-related routes with authentication middleware.
 * A user must be logged in to interact with their cart.
 */
router.use(authenticateToken);

/**
 * @description: Defines the API endpoints for cart operations.
 */
// POST /api/cart/add
router.post('/add', CartController.addItem);

// GET /api/cart/all
router.get('/all', CartController.getCartItems);

// PUT /api/cart/update/:cartItemId
router.put('/update/:cartItemId', CartController.updateItem);

// Route to remove an item from the cart.
// This is a DELETE request and requires a token.
router.delete('/remove/:cartItemId', CartController.removeItem);


/**
 * @api {post} /api/cart/checkout Checkout the cart
 * @apiDescription Completes the purchase by creating a new order from the cart items.
 * @apiPermission authenticated user
 */
router.post('/checkout', CartController.checkout);

export default router;