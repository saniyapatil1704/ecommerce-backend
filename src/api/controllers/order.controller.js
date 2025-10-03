import OrderService from '../services/order.service.js';
/**
 * Controller layer for handling incoming HTTP requests and sending responses
 * for order-related actions.
 */
class OrderController {

    /**
     * Handles the request to create a new order.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async create(req, res) {
        // We get the total amount and the list of items from the request body.
        const { totalAmount, items } = req.body;

        // The user ID is added to the request object by our authentication middleware.
        // This is a crucial step to link the order to a logged-in user.
        const userId = req.user.userId;

        // Basic validation to ensure required data is present.
        if (!totalAmount || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Total amount and at least one item are required to create an order.'
            });
        }

        try {
            // We call the service layer to perform the core business logic.
            const newOrder = await OrderService.createOrder(userId, totalAmount, items);

            // If the order is successfully created, we send back a success response with the new order data.
            return res.status(201).json({
                success: true,
                message: 'Order created successfully!',
                order: newOrder,
            });
        } catch (error) {
            console.error('Error creating order:', error.message);
            // We send a generic server error to the client for security reasons.
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    }


        /**
     * Handles the request to get all orders for the authenticated user.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async getOrders(req, res) {
        // We get the user ID from the request object, which was added by our auth middleware.
        const userId = req.user.userId;

        try {
            // We call the service layer to fetch all orders for the user.
            const orders = await OrderService.getOrdersByUserId(userId);

            // We send back a success response with the array of orders.
            return res.status(200).json({
                success: true,
                message: 'Orders fetched successfully!',
                orders: orders,
            });
        } catch (error) {
            console.error('Error fetching orders:', error.message);
            // We send a generic server error for security reasons.
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    }


     /**
     * Handles the request to delete a specific order.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async remove(req, res) {
        // The order ID is passed in the URL parameters.
        const { id } = req.params;
        // The user ID is added to the request by the auth middleware.
        const userId = req.user.userId;

        // Basic validation to ensure the ID is present.
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required to delete an order.'
            });
        }

        try {
            // We call the service layer to perform the core business logic.
            const deletedRows = await OrderService.deleteOrder(id, userId);

            // If the number of deleted rows is 0, it means the order was not found
            // or the user was not the owner.
            if (deletedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found or you do not have permission to delete this order.'
                });
            }

            // If a row was deleted, we send back a success response.
            return res.status(200).json({
                success: true,
                message: 'Order deleted successfully.'
            });
        } catch (error) {
            console.error('Error deleting order:', error.message);
            // We send a generic server error to the client.
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    }
}

export default OrderController;