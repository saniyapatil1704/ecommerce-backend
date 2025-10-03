// const bcrypt = require('bcryptjs');
// const User = require('../../database/models/user.model');

// // Service layer for all user-related business logic.
// // This layer interacts directly with the database models.
// const UserService = {

//   /**
//    * Registers a new user with a hashed password.
//    * @param {string} email - The user's email address.
//    * @param {string} password - The user's plain-text password.
//    * @returns {object} The newly created user object, excluding the password hash.
//    */
//   async registerUser(email, password) {
//     // Hash the password for security
//     const salt = await bcrypt.genSalt(10);
//     const password_hash = await bcrypt.hash(password, salt);

//     // Create a new user record in the database
//     // The `User` model is imported from the models directory.
//     const newUser = await User.create({
//       email,
//       password_hash
//     });

//     // Return the new user object, but exclude the password hash from the response
//     return {
//       id: newUser.id,
//       email: newUser.email,
//     };
//   }
// };

// module.exports = UserService;

//=== When we store jwtSecrete in env file ===
// import dotenv from "dotenv";
// dotenv.config();

// const bcrypt = require('bcryptjs');

// // For JWT TOKEN
// const jwt = require('jsonwebtoken');

// const User  = require('../../database/models/user.model');

// // It is best practice to store secrets in environment variables.
// // For now, we will use a placeholder.
// const jwtSecret = '06aec0b92df45f708d0aef6c876620df0d5cf5fec59841038ff5af86eadaf509c88be19353359994c78305bc179949aeb49e26c1b6631efc6b71a738215db05f'

// /**
//  * Service layer for all user-related business logic.
//  * This layer interacts directly with the database models.
//  */
// class UserService {

//     /**
//      * Registers a new user with a hashed password.
//      * @param {string} email - The user's email address.
//      * @param {string} password - The user's plain-text password.
//      * @returns {object} The newly created user object, without the password hash.
//      */
//     static async registerUser(email, password) {
//         // Hash the password for security. We use a salt round of 10.
//         // The salt round determines how complex the hashing process is.
//         const salt = await bcrypt.genSalt(10);
//         const passwordHash = await bcrypt.hash(password, salt);

//         // Create a new user record in the database.
//         // The password_hash field in the model maps to our hashed password.
//         const newUser = await User.create({
//             email,
//             password_hash: passwordHash,
//         });

//         // Return the new user object, but exclude sensitive data like the password hash.
//         return {
//             id: newUser.id,
//             email: newUser.email,
//         };
//     }

//     /**
//      * Authenticates a user by email and password.
//      * @param {string} email - The user's email address.
//      * @param {string} password - The user's plain-text password.
//      * @returns {object|null} The user object on successful login, or null on failure.
//      */
//     static async loginUser(email, password) {
//         // Find the user by their unique email.
//         // console.log("User model:", User);

//         const user = await User.findOne({ where: { email } });

//         // If the user doesn't exist, we return null to signify failure.
//         // We do this to prevent a timing attack, where an attacker could
//         // determine if an email exists in the database.
//         if (!user) {
//             return null;
//         }

//         // Compare the provided password with the hashed password in the database.
//         // The bcrypt.compare() function handles the hashing for us automatically.
//         const isMatch = await bcrypt.compare(password, user.password_hash);

//         // If the passwords don't match, we return null.
//         if (!isMatch) {
//             return null;
//         }

//         // If the passwords match, we generate a JWT.
//         // The payload contains the user's ID, which is a unique identifier.
//         // The token is signed with our secret key.
//         const payload = { userId: user.id };
//         const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

//         // If the passwords match, we return the user object (excluding the password hash).
//         return {
//             id: user.id,
//             email: user.email,
//             token,
//         };
//     }

//      /**
//      * Retrieves a user's profile by their ID.
//      * @param {number} userId - The ID of the authenticated user.
//      * @returns {object|null} The user object without the password hash, or null if not found.
//      */
//     static async getUserProfile(userId) {
//         // Find the user by their primary key (ID).
//         const user = await User.findByPk(userId, {
//             // We only want to return the `id` and `email` fields.
//             // This is a security measure to ensure the password hash is never exposed.
//             attributes: ['id', 'email']
//         });

//         // Return the user object if found, otherwise return null.
//         return user;
//     }

//      /**
//      * Updates a user's profile information.
//      * @param {number} userId - The ID of the authenticated user.
//      * @param {object} updates - An object containing the fields to update (e.g., { email: 'new@email.com' }).
//      * @returns {object|null} The updated user object without the password hash, or null if not found.
//      */
//     static async updateUserProfile(userId, updates) {
//         // Find the user by their ID.
//         const user = await User.findByPk(userId);

//         // If the user does not exist, return null.
//         if (!user) {
//             return null;
//         }

//         // This is a security measure. We do not allow password updates via this endpoint.
//         // A password change should be a separate, more secure process that requires
//         // the old password and potentially a new verification.
//         if (updates.passwordHash) {
//             delete updates.passwordHash;
//         }

//         // Apply the updates to the user object.
//         await user.update(updates);

//         // Return the updated user object, excluding the password hash.
//         return {
//             id: user.id,
//             email: user.email,
//         };
//     }
// }

// module.exports = UserService;

/**
 * @fileoverview Defines the service layer for all user-related business logic.
 * This file contains functions for user registration, login, and profile management.
 * It interacts directly with the database models to perform these operations.
 */

// We import `dotenv` and call `config()` to load environment variables from the `.env` file.
import dotenv from "dotenv";
dotenv.config();

// We import the `bcryptjs` library, which is used for hashing passwords.
import bcrypt from "bcryptjs";

// We import the `jsonwebtoken` (JWT) library for creating and verifying authentication tokens.
import jwt from "jsonwebtoken";

// We import our Sequelize User model to perform database operations on the users table.
import User from "../../database/models/user.model.js";

// It is a critical security practice to store secrets in environment variables.
// We get the secret from `process.env` to keep it out of our codebase.
const jwtSecret = process.env.JWT_SECRET || "your_fallback_secret_here";

/**
 * @classdesc Service layer for all user-related business logic.
 * This class provides a set of static methods to handle user operations.
 * Separating logic into a service layer helps keep our controllers and routes clean.
 */
class UserService {
  /**
   * @description Registers a new user with a hashed password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plain-text password.
   * @returns {object} The newly created user object, without the password hash.
   */
  static async registerUser(email, password) {
    // We use `await` because `bcrypt.genSalt` is an asynchronous operation.
    // The `genSalt` function generates a random string (a "salt") that is used
    // to make the password hash more secure and unique for each user.
    // The number 10 is the number of salt rounds, which determines the complexity.
    const salt = await bcrypt.genSalt(10);

    // We use `await` on `bcrypt.hash` to hash the user's password using the generated salt.
    const passwordHash = await bcrypt.hash(password, salt);

    // We use the Sequelize `create()` method to create a new user record in the database.
    // We pass the email and the secure, hashed password to our User model.
    const newUser = await User.create({
      email,
      password_hash: passwordHash,
    });

    // We return a new object with only the public user data (ID and email).
    // It is a crucial security practice to never expose the password hash to the client.
    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  /**
   * @description Authenticates a user by email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plain-text password.
   * @returns {object|null} The user object and a JWT on successful login, or null on failure.
   */
  static async loginUser(email, password) {
    // We use `User.findOne()` to find a single user record that matches the provided email.
    // The `where` option is how we filter our query.
    const user = await User.findOne({ where: { email } });

    // This check is important for security. If the user doesn't exist, we immediately return null.
    // We do this to prevent "timing attacks," where a malicious user could guess if an email exists
    // in the database based on how long the login process takes.
    if (!user) {
      return null;
    }

    // We use `bcrypt.compare()` to compare the plain-text password provided by the user
    // with the hashed password stored in our database. `bcrypt` handles the hashing automatically.
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // If `isMatch` is false, it means the passwords don't match, so we return null.
    if (!isMatch) {
      return null;
    }

    // If the passwords match, we create a JSON Web Token (JWT).
    // The `payload` is the data we want to store in the token; here, it's the user's ID.
    const payload = { userId: user.id };
    // `jwt.sign()` creates the token. It takes the payload, our secret key, and options.
    // We set `expiresIn: '1h'` so the token automatically becomes invalid after one hour.
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "10m" });

    // If authentication is successful, we return a new object with the user's ID, email, and the new token.
    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  /**
   * @description Retrieves a user's profile by their ID.
   * @param {number} userId - The ID of the authenticated user.
   * @returns {object|null} The user object without the password hash, or null if not found.
   */
  static async getUserProfile(userId) {
    // `User.findByPk()` is a Sequelize method to find a record by its primary key (in this case, the `id`).
    const user = await User.findByPk(userId, {
      // The `attributes` option is a security measure. We explicitly list the columns we want to retrieve.
      // This ensures that the password hash is never included in the result.
      attributes: ["id", "email"],
    });

    // We return the user object if found, otherwise `null`.
    return user;
  }

  /**
   * @description Updates a user's profile information.
   * @param {number} userId - The ID of the authenticated user.
   * @param {object} updates - An object containing the fields to update (e.g., { email: 'new@email.com' }).
   * @returns {object|null} The updated user object without the password hash, or null if not found.
   */
  static async updateUserProfile(userId, updates) {
    // We find the user by their ID.
    const user = await User.findByPk(userId);

    // If the user doesn't exist, we return null.
    if (!user) {
      return null;
    }

    // This is a crucial security measure. We prevent the password hash from being updated
    // through this general-purpose function. Password updates should have a separate,
    // more secure process.
    if (updates.passwordHash) {
      delete updates.passwordHash;
    }

    // We use the Sequelize `update()` method to apply the new values to the user object.
    // Sequelize will automatically save these changes to the database.
    await user.update(updates);

    // We return the updated user object with only public information.
    return {
      id: user.id,
      email: user.email,
    };
  }
}

// We use `export default` to make the entire `UserService` class available for other files to import.
export default UserService;
