import sequelize from "../../database/connection.js";
import Cart from "../../database/models/cart.model.js";
import CartItem from "../../database/models/cart_item.model.js";
import Order from "../../database/models/order.model.js";
import OrderItem from "../../database/models/order_item.model.js";
import Product from "../../database/models/product.model.js";

/**
 * @description Service layer for all cart-related business logic.
 * This layer interacts directly with the database models.
 */
class CartService {
  /**
   * @description Adds an item to a user's cart or updates the quantity if it already exists.
   * @param {object} data - An object containing all the cart item details.
   * @param {string} data.userId - The unique ID of the user.
   * @param {number} data.productId - The unique ID of the product to add.
   * @param {number} data.quantity - The quantity of the product.
   * @returns {object} The cart item that was added or updated.
   */
  static async addItem(data) {
    // Use a transaction to ensure all database operations are atomic.
    // This means if any part fails, the entire operation is rolled back.
    const result = await sequelize.transaction(async (t) => {
      // Find the user's cart. If one doesn't exist, create it.
      const [cart, created] = await Cart.findOrCreate({
        where: { userId: data.userId },
        include: [{ model: CartItem, as: "items" }],
        transaction: t,
      });

      // Find the specific product to ensure it exists.
      const product = await Product.findByPk(data.productId, {
        transaction: t,
      });

      // If the product doesn't exist, throw an error.
      if (!product) {
        throw new Error("Product not found.");
      }

      // Check if the product is already in the cart.
      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId: data.productId },
        transaction: t,
      });

      if (existingItem) {
        // If the item exists, update its quantity.
        await existingItem.increment("quantity", {
          by: data.quantity,
          transaction: t,
        });
        // Reload the updated item to return the new quantity.
        const updatedItem = await CartItem.findByPk(existingItem.id, {
          transaction: t,
          include: [{ model: Product, as: "product" }],
        });
        return updatedItem;
      } else {
        // If the item is new, create a new CartItem record.
        const newItem = await CartItem.create(
          {
            cartId: cart.id,
            productId: data.productId,
            quantity: data.quantity,
          },
          { transaction: t }
        );
        // Reload the new item to include product details for the response.
        const createdItemWithProduct = await CartItem.findByPk(newItem.id, {
          transaction: t,
          include: [{ model: Product, as: "product" }],
        });
        return createdItemWithProduct;
      }
    });

    return result;
  }

  /**
   * @description Retrieves all items from a user's cart.
   * @param {string} userId - The unique ID of the user.
   * @returns {object} The user's cart with all of its items.
   */
  static async getCartItems(userId) {
    // Find the user's cart and include all of its associated items.
    // We also include the Product details for each item.
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // If the cart doesn't exist, return null.
    if (!cart) {
      return null;
    }

    // Return the cart object with all its items.
    return cart;
  }

  /**
   * @description Updates the quantity of a specific item in the user's cart.
   * @param {object} data - An object containing the update details.
   * @param {string} data.userId - The unique ID of the user.
   * @param {number} data.cartItemId - The unique ID of the cart item to update.
   * @param {number} data.newQuantity - The new quantity for the item.
   * @returns {object} The updated cart item.
   */
  static async updateItem(data) {
    // Use a transaction to ensure all database operations are atomic.
    const result = await sequelize.transaction(async (t) => {
      // Find the cart item to be updated.
      const cartItem = await CartItem.findByPk(data.cartItemId, {
        include: [
          {
            model: Cart,
            as: "cart",
            where: { userId: data.userId }, // Security check: ensure item belongs to the user
          },
        ],
        transaction: t,
      });

      if (!cartItem) {
        throw new Error("Cart item not found or does not belong to the user.");
      }

      // Update the quantity.
      await cartItem.update({ quantity: data.newQuantity }, { transaction: t });

      // Reload the updated item to include product details for the response.
      const updatedItemWithProduct = await CartItem.findByPk(cartItem.id, {
        include: [{ model: Product, as: "product" }],
        transaction: t,
      });

      return updatedItemWithProduct;
    });

    return result;
  }
  /**
   * @description Deletes a specific item from the authenticated user's cart.
   * @param {object} data - An object containing the delete details.
   * @param {string} data.userId - The unique ID of the user.
   * @param {number} data.cartItemId - The unique ID of the cart item to delete.
   * @returns {boolean} A boolean indicating if the deletion was successful.
   */
  static async deleteItem(data) {
    // Use a transaction to ensure atomicity.
    const result = await sequelize.transaction(async (t) => {
      // Find the cart item to be deleted.
      const cartItem = await CartItem.findByPk(data.cartItemId, {
        include: [
          {
            model: Cart,
            as: "cart",
            where: { userId: data.userId }, // Security check: ensure item belongs to the user
          },
        ],
        transaction: t,
      });

      // If the item doesn't exist or doesn't belong to the user, throw an error.
      if (!cartItem) {
        throw new Error("Cart item not found or does not belong to the user.");
      }

      // Delete the cart item. The result will be the number of rows affected (1 for a successful delete).
      const deleted = await cartItem.destroy({ transaction: t });

      return deleted > 0;
    });

    return result;
  }

  /**
   * @description: Handles the checkout process by creating a new order from a user's cart.
   * @param {number} userId - The ID of the user checking out.
   * @returns {Promise<object>} The newly created order object.
   */
  static async checkout(userId) {
    // We will wrap all of our checkout logic in a database transaction.
    // This ensures that all operations succeed or fail together.
    const result = await sequelize.transaction(async (t) => {
      // 1. Find the user's cart and all of its items within the transaction.
      console.log("Starting checkout process for user:", userId);
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
        transaction: t, // <-- Add transaction here
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty.");
      }
      

      // 2. Calculate the total amount for the order.
      let totalAmount = 0;
      for (const item of cart.items) {
        totalAmount += item.quantity * item.product.price;
      }

      // 3. Create a new Order record.
      const newOrder = await Order.create(
        {
          userId: userId,
          totalAmount: totalAmount,
          status: "pending",
        },
        { transaction: t }
      );

      console.log("Created new order with ID:", newOrder.id);

      // 4. Create OrderItem records for each item in the cart.
      const orderItems = cart.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      console.log("Created order items for order ID:", newOrder.id);
      // 5. Decrement the stock of each product.
      for (const item of cart.items) {
        // Find the product within the transaction for a lock on the row.
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });


        // Check if the product exists and has enough stock.
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        // --- CORRECTED LOGIC FOR INVENTORY MANAGEMENT ---
        // We use 'product.stock' instead of 'product.stockQuantity'
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Use the atomic `decrement` method for a safe update.
        await product.decrement('stock', { by: item.quantity, transaction: t });
        console.log(`Decremented stock for product ID ${product.id} by ${item.quantity}`);
      }

      // 6. Clear the user's cart.
      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      return newOrder;
    });

    return result;
  }
}

export default CartService;