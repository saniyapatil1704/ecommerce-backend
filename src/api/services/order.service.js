// const sequelize = require("../../database/connection");
// const Order = require("../../database/models/order.model");
// const OrderItem = require("../../database/models/order_item.model");
// const Product = require("../../database/models/product.model");

// /**
//  * Service layer for all order-related business logic.
//  * This layer directly interacts with the database models.
//  */
// class OrderService {
//   /**
//    * Creates a new order and its associated order items.
//    * @param {number} userId - The ID of the user placing the order.
//    * @param {number} totalAmount - The total cost of the order.
//    * @param {array} items - An array of objects, each containing product details and quantity.
//    * @returns {object} The newly created order object with its items.
//    */
//   static async createOrder(userId, totalAmount, items) {
//     // Step 1: Create the main order record.
//     // We use the `create` method to save a new record in the `orders` table.
//     const newOrder = await Order.create({
//       userId,
//       totalAmount,
//       status: "pending", // A default status for a new order.
//     });

//     // Step 2: Prepare the order items for bulk creation.
//     // We use `map` to transform the incoming items array into the format Sequelize expects for `OrderItem`.
//     // We also add the `orderId` to each item to link it to the newly created order.
//     const orderItems = items.map((item) => ({
//       orderId: newOrder.id,
//       productId: item.productId,
//       quantity: item.quantity,
//       priceAtPurchase: item.priceAtPurchase,
//     }));

//     // Step 3: Create the order items in a single, efficient database operation.
//     // We use `bulkCreate` to insert all order items at once, which is much faster than
//     // creating them one by one.
//     const createdOrderItems = await OrderItem.bulkCreate(orderItems);

//     // Step 4: Return the complete order object with the newly created items.
//     // We return the main order along with the array of its items.
//     return {
//       ...newOrder.get({ plain: true }),
//       items: createdOrderItems.map((item) => item.get({ plain: true })),
//     };
//   }

//   /**
//    * Retrieves all orders for a specific user.
//    * @param {number} userId - The ID of the user.
//    * @returns {array} An array of order objects belonging to the user.
//    */
//   static async getOrdersByUserId(userId) {
//     // We use `findAll` with a `where` clause to filter the orders by the user's ID.
//     // We also use `include` to fetch the related `OrderItem` records for each order.
//     const orders = await Order.findAll({
//       where: { userId },
//       include: [
//         {
//           model: OrderItem,
//           as: "items",

//           include: [
//             {
//               model: Product,
//               as: "product",
//             },
//           ],
//         },
//       ],
//       order: [["createdAt", "DESC"]], // We order the results by the newest orders first.
//     });
//     return orders;
//   }

//   /**
//    * Deletes a specific order and its items, but only if the user is the owner.
//    * @param {number} orderId - The ID of the order to delete.
//    * @param {number} userId - The ID of the authenticated user.
//    * @returns {number} The number of orders deleted (should be 1 or 0).
//    */
//   static async deleteOrder(orderId, userId) {
//     // First, we find the order to ensure it exists and belongs to the user.
//     const order = await Order.findOne({
//       where: { id: orderId, userId: userId },
//     });

//     // If the order is not found or does not belong to the user, we return 0.
//     if (!order) {
//       return 0;
//     }

//     // We use a Sequelize transaction to ensure both deletions succeed or fail together.
//     // This is important because we don't want to delete the order but leave the order items.
//     const result = await sequelize.transaction(async (t) => {
//       // First, delete all order items associated with this order.
//       await OrderItem.destroy({
//         where: { orderId: orderId },
//         transaction: t,
//       });

//       // Then, delete the order itself.
//       const rowsDeleted = await Order.destroy({
//         where: { id: orderId, userId: userId },
//         transaction: t,
//       });

//       return rowsDeleted;
//     });

//     return result;
//   }
// }

// module.exports = OrderService;



import sequelize from "../../database/connection.js";
import Order from "../../database/models/order.model.js";
import OrderItem from "../../database/models/order_item.model.js";
import Product from "../../database/models/product.model.js";


/**
 * Service layer for all order-related business logic.
 * This layer directly interacts with the database models.
 */
class OrderService {
  /**
   * Creates a new order and its associated order items.
   * @param {number} userId - The ID of the user placing the order.
   * @param {number} totalAmount - The total cost of the order.
   * @param {array} items - An array of objects, each containing product details and quantity.
   * @returns {object} The newly created order object with its items.
   */
  static async createOrder(userId, totalAmount, items) {
    console.log("Starting createOrder transaction...");
    console.log("Items to process:", items);
    
    // We use a transaction to ensure atomicity for all operations:
    // checking stock, updating stock, and creating the order records.
    try {
      const result = await sequelize.transaction(async (t) => {
        // Step 1: Check and update the stock for each product in the order.
        for (const item of items) {
          console.log(`Processing item: productId=${item.productId}, quantity=${item.quantity}`);
          const product = await Product.findByPk(item.productId, { transaction: t });
          console.log("Found product:", product ? product.name : 'null');
          console.log("Product current stock:", product ? product.stock : 'N/A');

          // If the product is not found or there is not enough stock, throw an error.
          if (!product || product.stock < item.quantity) {
            console.error(`Insufficient stock for product ID ${item.productId}. Required: ${item.quantity}, Available: ${product?.stock || 0}`);
            throw new Error(`Insufficient stock for product ID ${item.productId}.`);
          }

          // Decrement the stock of the product.
          // We use the `decrement` method for a safe, atomic update.
          await product.decrement('stock', { by: item.quantity, transaction: t });
          console.log(`Decremented stock for product ${product.name} by ${item.quantity}. New stock will be: ${product.stock - item.quantity}`);
        }

        // Step 2: Create the main order record.
        const newOrder = await Order.create({
          userId,
          totalAmount,
          status: "pending", // A default status for a new order.
        }, { transaction: t });

        // Step 3: Prepare the order items for bulk creation.
        const orderItems = items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        }));

        // Step 4: Create the order items in a single, efficient database operation.
        const createdOrderItems = await OrderItem.bulkCreate(orderItems, { transaction: t });

        // Step 5: Return the complete order object with the newly created items.
        return {
          ...newOrder.get({ plain: true }),
          items: createdOrderItems.map((item) => item.get({ plain: true })),
        };
      });
      console.log("createOrder transaction finished successfully.");
      return result;
    } catch (error) {
      console.error("Error in createOrder transaction:", error.message);
      throw error;
    }
  }

  /**
   * Retrieves all orders for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {array} An array of order objects belonging to the user.
   */
  static async getOrdersByUserId(userId) {
    // We use `findAll` with a `where` clause to filter the orders by the user's ID.
    // We also use `include` to fetch the related `OrderItem` records for each order.
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",

          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]], // We order the results by the newest orders first.
    });
    return orders;
  }

  /**
   * Deletes a specific order and its items, but only if the user is the owner.
   * @param {number} orderId - The ID of the order to delete.
   * @param {number} userId - The ID of the authenticated user.
   * @returns {number} The number of orders deleted (should be 1 or 0).
   */


  static async deleteOrder(orderId, userId) {
  console.log("Starting cancelOrder transaction...");
  try {
    const result = await sequelize.transaction(async (t) => {
      // Step 1: Find the order to ensure it exists and belongs to the user.
      const order = await Order.findOne({
        where: { id: orderId, userId: userId },
        transaction: t,
      });

      if (!order) {
        console.error("Order not found or user is not the owner.");
        return 0;
      }

      // Step 2: Find all order items associated with this order.
      const orderItems = await OrderItem.findAll({
        where: { orderId: orderId },
        transaction: t,
      });

      // Step 3: Return stock for each product in the order.
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (product) {
          await product.increment('stock', { by: item.quantity, transaction: t });
          console.log(`Incremented stock for product ${product.name} by ${item.quantity}.`);
        }
      }

      // Step 4: Update the order status to "canceled".
      const rowsUpdated = await Order.update(
        { status: "canceled" }, // <-- status field
        {
          where: { id: orderId, userId: userId },
          transaction: t,
        }
      );
      console.log(`Order status changed to canceled. Rows affected: ${rowsUpdated[0]}.`);

      return rowsUpdated[0]; // return number of affected rows
    });

    console.log("cancelOrder transaction finished successfully.");
    return result;
  } catch (error) {
    console.error("Error in cancelOrder transaction:", error.message);
    throw error;
  }
}

}

export default OrderService;



  // static async deleteOrder(orderId, userId) {
  //   // We use a Sequelize transaction to ensure both deletions and stock updates succeed or fail together.
  //   console.log("Starting deleteOrder transaction...");
  //   try {
  //     const result = await sequelize.transaction(async (t) => {
  //       // Step 1: Find the order to ensure it exists and belongs to the user.
  //       const order = await Order.findOne({
  //         where: { id: orderId, userId: userId },
  //         transaction: t
  //       });

  //       // If the order is not found or does not belong to the user, we return 0.
  //       if (!order) {
  //         console.error("Order not found or user is not the owner.");
  //         return 0;
  //       }

  //       // Step 2: Find all order items associated with this order.
  //       const orderItems = await OrderItem.findAll({
  //         where: { orderId: orderId },
  //         transaction: t
  //       });

  //       // Step 3: Return the stock for each product in the order.
  //       for (const item of orderItems) {
  //         console.log(`Returning stock for product ID ${item.productId}. Quantity: ${item.quantity}`);
  //         const product = await Product.findByPk(item.productId, { transaction: t });
  //         if (product) {
  //           // Increment the stock of the product by the quantity of the deleted item.
  //           await product.increment('stock', { by: item.quantity, transaction: t });
  //           console.log(`Incremented stock for product ${product.name} by ${item.quantity}.`);
  //         }
  //       }

  //       // Step 4: Delete the order items.
  //       await OrderItem.destroy({
  //         where: { orderId: orderId },
  //         transaction: t,
  //       });
  //       console.log("Order items deleted.");

  //       // Step 5: Delete the order itself.
  //       const rowsDeleted = await Order.destroy({
  //         where: { id: orderId, userId: userId },
  //         transaction: t,
  //       });
  //       console.log(`Order deleted. Rows affected: ${rowsDeleted}.`);

  //       return rowsDeleted;
  //     });
  //     console.log("deleteOrder transaction finished successfully.");
  //     return result;
  //   } catch (error) {
  //     console.error("Error in deleteOrder transaction:", error.message);
  //     throw error;
  //   }
  // }
