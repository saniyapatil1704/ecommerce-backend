import CartService from '../services/cart.service.js';
/**
 * @description Controller for all cart-related operations.
 * This layer handles incoming HTTP requests and sends responses.
 */
class CartController {

    /**
     * @description Adds a product to the authenticated user's cart.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async addItem(req, res) {
        try {
            // Get the user ID from the token set by our middleware.
            const userId = req.user.userId;
            console.log("User ID from token from cart:", userId);
            // Get the product details from the request body.
            const { productId, quantity } = req.body;

            // Call the service to add the item to the cart.
            const cartItem = await CartService.addItem({ userId, productId, quantity });

            // Send a success response with the new cart item.
            res.status(201).json({
                message: 'Product added to cart successfully.',
                cartItem
            });
        } catch (error) {
            // Log the error for debugging.
            console.error('Error adding item to cart:', error);
            // Send an error response.
            res.status(500).json({
                message: 'Failed to add item to cart.',
                error: error.message
            });
        }
    }

     /**
     * @description Retrieves the authenticated user's cart with all items.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async getCartItems(req, res) {
        try {
            // Get the user ID from the token set by our middleware.
            const userId = req.user.userId;
            
            // Call the service to get all items from the cart.
            const cart = await CartService.getCartItems(userId);

            // If the cart is empty or doesn't exist, return a 404.
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found or is empty.' });
            }

            // Send the cart data as a success response.
            res.status(200).json({ cart });
        } catch (error) {
            // Log the error for debugging.
            console.error('Error getting cart items:', error);
            // Send an error response.
            res.status(500).json({
                message: 'Failed to retrieve cart items.',
                error: error.message
            });
        }
    }

      /**
     * @description Updates the quantity of a specific item in the authenticated user's cart.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async updateItem(req, res) {
        try {
            // Get the user ID from the token set by our middleware.
            const userId = req.user.userId;
            // Get the cart item ID from the URL parameters.
            const { cartItemId } = req.params;
            // Get the new quantity from the request body.
            const { quantity } = req.body;

            // Ensure the quantity is a positive number.
            if (quantity <= 0) {
                return res.status(400).json({ message: 'Quantity must be a positive number.' });
            }

            // Call the service to update the cart item.
            const updatedItem = await CartService.updateItem({ userId, cartItemId, newQuantity: quantity });

            // Send a success response with the updated cart item.
            res.status(200).json({
                message: 'Cart item updated successfully.',
                updatedItem
            });
        } catch (error) {
            // Log the error for debugging.
            console.error('Error updating cart item:', error);
            // Send an error response.
            res.status(500).json({
                message: 'Failed to update cart item.',
                error: error.message
            });
        }
    }

     /**
     * @description Deletes a specific item from the authenticated user's cart.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async removeItem(req, res) {
        try {
            // Get the user ID from the token set by our middleware.
            const userId = req.user.userId;
            // Get the cart item ID from the URL parameters.
            const { cartItemId } = req.params;

            // Call the service to delete the cart item.
            await CartService.deleteItem({ userId, cartItemId });

            // Send a success response.
            res.status(200).json({
                message: 'Cart item removed successfully.'
            });
        } catch (error) {
            // Log the error for debugging.
            console.error('Error removing cart item:', error);
            // Send an error response.
            res.status(500).json({
                message: 'Failed to remove cart item.',
                error: error.message
            });
        }
    }

      /**
     * @description: Handles the checkout process for a user's cart.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     * @returns {object} The HTTP response with the newly created order.
     */
    static async checkout(req, res) {
        try {
            // Get user ID from the authenticated request object.
            const userId = req.user.userId;

            // Call the service to perform the checkout.
            const newOrder = await CartService.checkout(userId);

            // Send a success response.
            return res.status(200).json({
                success: true,
                message: 'Checkout successful. Your order has been placed.',
                data: newOrder,
            });
        } catch (error) {
            // Handle errors and send an error response.
            console.error('Error during checkout:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'An error occurred during checkout.',
            });
        }
    }
}


export default CartController;