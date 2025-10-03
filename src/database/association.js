// // Import the models
// const User = require('./models/user.model');
// const Product = require('./models/product.model');

// // Define the associations between the models.
// // A User has many Products.
// User.hasMany(Product, {
//   foreignKey: 'userId', // This will create a `userId` column in the `products` table
//   as: 'products' // This is the alias for the association, so we can do `user.getProducts()`
// });

// // A Product belongs to a User.
// Product.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'seller' // This is the alias for the association, so we can do `product.getSeller()`
// });

// // You can add more associations here as your application grows.
// // For example: Order.belongsTo(User), Order.hasMany(OrderItem), etc.

// // Import all models
// const User = require("./models/user.model");
// const Product = require("./models/product.model");
// const Order = require("./models/order.model");
// const OrderItem = require("./models/order_item.model.js");
// const Cart = require("./models/cart.model.js");
// const CartItem = require("./models/cart_item.model.js");

// // ===================================
// // User and Order Relationship
// // ===================================
// // A User has many Orders. This will add a `userId` column to the `orders` table.
// User.hasMany(Order, {
//   foreignKey: "userId",
//   as: "orders",
// });
// // An Order belongs to a User.
// Order.belongsTo(User, {
//   foreignKey: "userId",
//   as: "customer",
// });

// Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" }); // ✅ FIX

// // ===================================
// // Order and Product (Many-to-Many) Relationship
// // ===================================
// // An Order has many Products, through the OrderItem joining table.
// Order.belongsToMany(Product, {
//   through: OrderItem,
//   foreignKey: "orderId",
//   otherKey: "productId",
//   as: "products",
// });
// // A Product has many Orders, through the OrderItem joining table.
// Product.belongsToMany(Order, {
//   through: OrderItem,
//   foreignKey: "productId",
//   otherKey: "orderId",
//   as: "orders",
// });

// // ===================================
// // One-to-Many relationships for the joining table
// // ===================================
// // An OrderItem belongs to an Order.
// OrderItem.belongsTo(Order, {
//   foreignKey: "orderId",
//   as: "order",
// });

// // An OrderItem belongs to a Product.
// OrderItem.belongsTo(Product, {
//   foreignKey: "productId",
//   as: "product",
// });


// // ===================================
// // User and Cart Relationship (One-to-One)
// // ===================================
// // A User has one Cart. This will add a `userId` column to the `carts` table.
// User.hasOne(Cart, {
//   foreignKey: 'userId',
//   as: 'cart'
// });
// // A Cart belongs to a User.
// Cart.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'user'
// });

// // ===================================
// // Cart and CartItem Relationship (One-to-Many)
// // ===================================
// // A Cart has many CartItems. This will add a `cartId` column to the `cart_items` table.
// Cart.hasMany(CartItem, {
//   foreignKey: 'cartId',
//   as: 'items'
// });
// // A CartItem belongs to a Cart.
// CartItem.belongsTo(Cart, {
//   foreignKey: 'cartId',
//   as: 'cart'
// });

// // ===================================
// // Product and CartItem Relationship (One-to-Many)
// // ===================================
// // A Product has many CartItems. This will add a `productId` column to the `cart_items` table.
// Product.hasMany(CartItem, {
//   foreignKey: 'productId',
//   as: 'cartItems'
// });
// // A CartItem belongs to a Product.
// CartItem.belongsTo(Product, {
//   foreignKey: 'productId',
//   as: 'product'
// });


/**
 * @fileoverview Defines the Sequelize model associations for the application.
 * This file sets up the relationships (one-to-one, one-to-many, many-to-many)
 * between all our database models. This is a fundamental step for building a
 * relational database structure.
 */

// We import all of our Sequelize models using ES6 syntax.
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import Order from "./models/order.model.js";
import OrderItem from "./models/order_item.model.js";
import Cart from "./models/cart.model.js";
import CartItem from "./models/cart_item.model.js";


// ===================================
// User and Order Relationship (One-to-Many)
// ===================================

// A User has many Orders.
// This command will automatically add a `userId` column to the `orders` table,
// establishing a link from an order back to its user.
User.hasMany(Order, {
    // We explicitly define the foreign key name as 'userId'.
    foreignKey: "userId",
    // We define a human-readable alias, 'orders', for this relationship.
    // This allows us to access a user's orders later using `user.getOrders()`.
    as: "orders",
});

// An Order belongs to a User.
// This is the inverse of the `hasMany` relationship.
// It allows us to access the user from an order instance using `order.getCustomer()`.
Order.belongsTo(User, {
    foreignKey: "userId",
    as: "customer",
});


// ===================================
// Order and Product (Many-to-Many) Relationship
// ===================================
// A many-to-many relationship requires a junction table (or "through" table).
// In this case, OrderItem links Orders and Products.

// An Order has many Products.
Order.belongsToMany(Product, {
    // We specify the junction table that connects the two models.
    through: OrderItem,
    // The foreign key in the junction table that refers to the `orders` table.
    foreignKey: "orderId",
    // The foreign key in the junction table that refers to the `products` table.
    otherKey: "productId",
    // Alias to access products from an order, e.g., `order.getProducts()`.
    as: "products",
});

// A Product has many Orders.
// This is the inverse relationship.
Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: "productId",
    otherKey: "orderId",
    // Alias to access orders from a product, e.g., `product.getOrders()`.
    as: "orders",
});


// ===================================
// One-to-Many relationships for the junction tables
// ===================================
// These associations are often created for convenience when querying the junction table directly.

// An OrderItem belongs to an Order.
OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

// An OrderItem belongs to a Product.
OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});


// ===================================
// User and Cart Relationship (One-to-One)
// ===================================
// A one-to-one relationship means each user can have only one cart, and each cart belongs to one user.

// A User has one Cart.
// This will add a `userId` foreign key to the `carts` table.
User.hasOne(Cart, {
    foreignKey: 'userId',
    as: 'cart'
});

// A Cart belongs to a User.
// This is the inverse relationship.
Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});


// ===================================
// Cart and CartItem Relationship (One-to-Many)
// ===================================

// A Cart has many CartItems.
// This will add a `cartId` column to the `cart_items` table.
Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'items'
});

// A CartItem belongs to a Cart.
CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart'
});


// ===================================
// Product and CartItem Relationship (One-to-Many)
// ===================================
// This association links a product directly to the items in a cart.

// A Product has many CartItems.
// This will add a `productId` column to the `cart_items` table.
Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems'
});

// A CartItem belongs to a Product.
CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});


// Order has many OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

// // OrderItem belongs to Order
// OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product has many OrderItems
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });

// OrderItem belongs to Product
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "productss" });

// Now that all models and their associations are defined, this file
// should be imported in your main server file (e.g., `server.js` or `app.js`)
// before you sync the database.









// // ==============Updated with clear explanition ====





// /**
//  * @fileoverview Defines the Sequelize model associations for the application.
//  * This file sets up the relationships (one-to-one, one-to-many, many-to-many)
//  * between all our database models. This is a fundamental step for building a
//  * relational database structure that reflects the real-world relationships in an
//  * e-commerce application.
//  */

// // We import all of our Sequelize models using ES6 syntax.
// // Each of these files (e.g., user.model.js) defines a single table (or model)
// // in our database.
// import User from "./models/user.model.js";
// import Product from "./models/product.model.js";
// import Order from "./models/order.model.js";
// import OrderItem from "./models/order_item.model.js";
// import Cart from "./models/cart.model.js";
// import CartItem from "./models/cart_item.model.js";


// // ===================================
// // User and Order Relationship (One-to-Many)
// // Purpose: To link a customer (User) to all of the purchases they have made (Orders).
// // Business Logic: A single user can have multiple orders over time. However, a specific
// // order belongs to one and only one user.
// // ===================================

// // A User has many Orders.
// // The `User.hasMany(Order)` command establishes the "one" side of the relationship.
// // This is the source model, and Sequelize will automatically create a foreign key
// // in the target model (`Order`) that links back to the source (`User`).
// User.hasMany(Order, {
//     // We explicitly define the foreign key name as 'userId'. This is the column
//     // that Sequelize will add to the `orders` table. It will store the primary key
//     // of the user who placed the order.
//     foreignKey: "userId",
//     // We define a human-readable alias, 'orders', for this relationship.
//     // This allows us to access a user's orders later using convenient Sequelize
//     // methods like `user.getOrders()`, `user.createOrder()`, etc.
//     as: "orders",
// });

// // An Order belongs to a User.
// // The `Order.belongsTo(User)` command establishes the "many" side of the relationship.
// // This is the inverse of the `hasMany` relationship. It's crucial for establishing a
// // two-way link. It also allows us to access the user from an order instance
// // using `order.getCustomer()`. The `foreignKey` specified here must match the
// // one defined in the `hasMany` call.
// Order.belongsTo(User, {
//     foreignKey: "userId",
//     // We use the alias 'customer' to make the relationship's name semantically clear
//     // in the context of an order. For example, `order.getCustomer()`.
//     as: "customer",
// });


// // ===================================
// // Order and Product (Many-to-Many) Relationship
// // Purpose: To link an order to all the products it contains.
// // Business Logic: An order can contain multiple products, and a single product
// // can be included in many different orders. This requires a third table, known as a
// // "junction" or "through" table, to resolve the relationship. Here, `OrderItem` is
// // our junction table. It holds foreign keys for both `Order` and `Product` and
// // stores additional data about the relationship, such as quantity.
// // ===================================

// // An Order has many Products.
// Order.belongsToMany(Product, {
//     // We specify the junction table that Sequelize must use to connect the
//     // two models. This is the heart of a many-to-many relationship.
//     through: OrderItem,
//     // The foreign key in the junction table (`OrderItem`) that refers to the `orders` table.
//     // This column will store the primary key of the order.
//     foreignKey: "orderId",
//     // The foreign key in the junction table (`OrderItem`) that refers to the `products` table.
//     // This column will store the primary key of the product.
//     otherKey: "productId",
//     // This alias, 'products', allows us to get a list of all products in a given order,
//     // for example, `order.getProducts()`.
//     as: "products",
// });

// // A Product has many Orders.
// // This is the inverse relationship, which is equally important. It allows us to
// // find all orders that contain a specific product.
// Product.belongsToMany(Order, {
//     through: OrderItem,
//     foreignKey: "productId",
//     otherKey: "orderId",
//     // This alias, 'orders', allows us to get a list of all orders for a product,
//     // for example, `product.getOrders()`.
//     as: "orders",
// });


// // ===================================
// // One-to-Many relationships for the junction tables
// // Purpose: These associations make it easier to query the junction table itself.
// // Business Logic: An `OrderItem` is a single line item. It belongs to one specific
// // order and represents one specific product.
// // ===================================

// // An OrderItem belongs to an Order.
// // This allows us to easily find the parent order of a given order item, e.g.,
// // `orderItem.getOrder()`. This association is crucial for querying related data.
// OrderItem.belongsTo(Order, {
//     foreignKey: "orderId",
//     as: "order",
// });

// // An OrderItem belongs to a Product.
// // This allows us to easily find the product associated with an order item, e.g.,
// // `orderItem.getProduct()`.
// OrderItem.belongsTo(Product, {
//     foreignKey: "productId",
//     as: "product",
// });


// // ===================================
// // User and Cart Relationship (One-to-One)
// // Purpose: To give each user a single, dedicated shopping cart.
// // Business Logic: A user can only have one shopping cart at a time, and a cart
// // is exclusively owned by a single user.
// // ===================================

// // A User has one Cart.
// // The `hasOne` command sets up the one-to-one relationship. It will automatically
// // add a `userId` foreign key to the `carts` table, which points back to the user.
// User.hasOne(Cart, {
//     foreignKey: 'userId',
//     as: 'cart'
// });

// // A Cart belongs to a User.
// // The `belongsTo` command completes the one-to-one relationship from the other side.
// // It allows us to find the user from the cart, e.g., `cart.getUser()`.
// Cart.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'user'
// });


// // ===================================
// // Cart and CartItem Relationship (One-to-Many)
// // Purpose: To link a shopping cart to all the products (represented by CartItems) it contains.
// // Business Logic: A single cart can contain multiple items, but each item in the cart
// // belongs to one specific cart.
// // ===================================

// // A Cart has many CartItems.
// // This command will add a `cartId` foreign key to the `cart_items` table.
// Cart.hasMany(CartItem, {
//     foreignKey: 'cartId',
//     as: 'items' // Alias for retrieving items in the cart, e.g., `cart.getItems()`.
// });

// // A CartItem belongs to a Cart.
// CartItem.belongsTo(Cart, {
//     foreignKey: 'cartId',
//     as: 'cart' // Alias for retrieving the cart from an item, e.g., `cartItem.getCart()`.
// });


// // ===================================
// // Product and CartItem Relationship (One-to-Many)
// // Purpose: To link a product to all the cart items that reference it.
// // Business Logic: A product can be in multiple carts at the same time. This association is
// // essential for finding out which carts a particular product is in.
// // ===================================

// // A Product has many CartItems.
// // This establishes the link from the product to the items that are referencing it.
// Product.hasMany(CartItem, {
//     foreignKey: 'productId',
//     as: 'cartItems' // Alias to find all cart items for a given product.
// });

// // A CartItem belongs to a Product.
// // This establishes the inverse link, allowing us to find the product from a cart item.
// CartItem.belongsTo(Product, {
//     foreignKey: 'productId',
//     as: 'product' // Alias to find the product for a given cart item.
// });


// // ===================================
// // Additional Junction Table Associations (For Convenience)
// // ===================================
// // These are similar to the relationships defined for OrderItem. They are not strictly
// // necessary for Sequelize to function, but they provide convenience methods for
// // direct queries on the junction tables themselves.

// // Order has many OrderItems
// // This is redundant with the `Order.belongsToMany(Product, { through: OrderItem })`
// // relationship above, but it serves the purpose of making it possible to find all
// // `OrderItem` records for a given `Order` via `order.getOrderItems()`. It creates a
// // one-to-many relationship from the `Order` model to the `OrderItem` model.
// Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

// // Product has many OrderItems
// // Similar to the above, this is for direct querying of the `OrderItem` table from a
// // `Product` instance, e.g., `product.getOrderItems()`.
// Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });

// // Now that all models and their associations are defined, this file
// // should be imported in your main server file (e.g., `server.js` or `app.js`)
// // before you sync the database. Importing this single file is enough to
// // establish all the relationships we've defined.
