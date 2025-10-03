// const UserService = require('../services/user.service');

// // Controller layer for handling incoming HTTP requests and sending responses.
// // This layer orchestrates the service layer and handles validation and errors.
// const UserController = {

//   /**
//    * Handles the user registration request.
//    * @param {object} req - The Express request object.
//    * @param {object} res - The Express response object.
//    */
//   async register(req, res) {
//     // Basic validation to ensure email and password are provided
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required.' });
//     }

//     try {
//       // Call the service layer to perform the registration logic
//       const newUser = await UserService.registerUser(email, password);

//       // Send a success response with the new user data
//       // We don't send the password hash back for security
//       return res.status(201).json({
//         message: 'User registered successfully!',
//         user: newUser,
//       });
//     } catch (error) {
//       console.error('Registration failed:', error);
//       // Handle Sequelize unique constraint error specifically
//       if (error.name === 'SequelizeUniqueConstraintError') {
//         return res.status(409).json({ error: 'This email is already in use.' });
//       }
//       return res.status(500).json({ error: 'Internal server error.' });
//     }
//   },
// };

// module.exports = UserController;


import UserService from '../services/user.service.js';
/**
 * Controller layer for handling incoming HTTP requests and sending responses.
 * This layer orchestrates the service layer and handles validation and errors.
 */
class UserController {

    /**
     * Handles the user registration request.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async register(req, res) {
        const { email, password } = req.body;

        // Basic request body validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        try {
            // Call the service layer to perform the business logic
            const newUser = await UserService.registerUser(email, password);

            // Send a success response
            return res.status(201).json({
                success: true,
                message: 'User registered successfully!',
                user: newUser,
            });
        } catch (error) {
            console.error('User registration failed:', error.message);
            
            // Handle specific errors for a better user experience
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already in use.'
                });
            }

            // Handle general server errors
            return res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    }

    /**
     * Handles the user login request.  and returns a JWT on Success
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async login(req, res) {
        const { email, password } = req.body;

        // Basic request body validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        try {
            // Call the service layer to perform authentication logic
            const user = await UserService.loginUser(email, password);

            if (!user) {
                // Return a generic error message for security.
                // This prevents an attacker from knowing if the email exists.
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.'
                });
            }
            
            // On successful login, send a success message and the user data.
            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                user,
            });
        } catch (error) {
            console.error('User login failed:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    }


      /**
     * Handles the request to get a user's profile.
     * This endpoint is protected by our authentication middleware.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async getProfile(req, res) {
        try {
            // The user ID is added to the request by the authentication middleware.
            const userId = req.user.userId;
            const userProfile = await UserService.getUserProfile(userId);

            if (!userProfile) {
                return res.status(404).json({
                    success: false,
                    message: 'User profile not found.'
                });
            }

            // If the profile is found, send it back as a success response.
            return res.status(200).json({
                success: true,
                message: 'User profile fetched successfully!',
                profile: userProfile
            });
        } catch (error) {
            console.error('Error fetching user profile:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    }

    /**
     * Handles the request to update a user's profile.
     * This endpoint is protected by our authentication middleware.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    static async updateProfile(req, res) {
        try {
            // Get the user ID from the authentication middleware.
            const userId = req.user.userId;
            // Get the updates from the request body.
            const updates = req.body;

            const updatedUser = await UserService.updateUserProfile(userId, updates);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User profile not found.'
                });
            }

            // If the update is successful, send back the updated user profile.
            return res.status(200).json({
                success: true,
                message: 'User profile updated successfully!',
                profile: updatedUser
            });
        } catch (error) {
            console.error('Error updating user profile:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    }
}

export default UserController;





// /**
//  * @classdesc Controller layer for handling user-related HTTP requests.
//  * 
//  * - This class receives requests from the routes and decides how to respond.
//  * - It validates input, calls the service layer to perform business logic, 
//  *   and handles success/error responses.
//  * - By keeping logic here, we ensure a clear separation between request handling 
//  *   (controller) and core business rules (service).
//  */



// class UserController {

//     /**
//      * Handles the user registration request.
//      * @param {object} req - The Express request object (contains client data).
//      * @param {object} res - The Express response object (used to send responses).
//      */
//     static async register(req, res) {
//         // Extract email and password from the request body (data sent by client).
//         const { email, password } = req.body;

//         // Basic validation → make sure both email and password exist.
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email and password are required.'
//             });
//         }

//         try {
//             // Call the Service layer → handles actual registration (hashing, saving to DB).
//             const newUser = await UserService.registerUser(email, password);

//             // If registration succeeds, return success response with user info.
//             return res.status(201).json({
//                 success: true,
//                 message: 'User registered successfully!',
//                 user: newUser,
//             });
//         } catch (error) {
//             console.error('User registration failed:', error.message);

//             // If email already exists → handle with clear error message.
//             if (error.name === 'SequelizeUniqueConstraintError') {
//                 return res.status(409).json({
//                     success: false,
//                     message: 'This email is already in use.'
//                 });
//             }

//             // Any other unknown error → send "Internal Server Error".
//             return res.status(500).json({
//                 success: false,
//                 message: 'Internal server error.',
//             });
//         }
//     }

//     /**
//      * Handles the user login request and returns a JWT on success.
//      */
//     static async login(req, res) {
//         // Extract email + password from request body.
//         const { email, password } = req.body;

//         // Basic validation → ensure both fields are present.
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email and password are required.'
//             });
//         }

//         try {
//             // Call the service layer to authenticate the user.
//             const user = await UserService.loginUser(email, password);

//             // If user not found or password invalid → generic error message.
//             // (Prevents attackers from guessing whether email exists).
//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Invalid email or password.'
//                 });
//             }

//             // On successful login → send user data (and usually JWT token here).
//             return res.status(200).json({
//                 success: true,
//                 message: 'Login successful!',
//                 user,
//             });
//         } catch (error) {
//             console.error('User login failed:', error.message);

//             // If something crashes → return "Internal Server Error".
//             return res.status(500).json({
//                 success: false,
//                 message: 'Internal server error.',
//             });
//         }
//     }

//     /**
//      * Handles the request to get a user's profile.
//      * (This endpoint is protected → requires authentication middleware).
//      */
//     static async getProfile(req, res) {
//         try {
//             // The authentication middleware attaches userId to req.user.
//             const userId = req.user.userId;

//             // Fetch user profile from Service layer.
//             const userProfile = await UserService.getUserProfile(userId);

//             // If no profile found → send "Not Found".
//             if (!userProfile) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'User profile not found.'
//                 });
//             }

//             // Profile found → return it as success response.
//             return res.status(200).json({
//                 success: true,
//                 message: 'User profile fetched successfully!',
//                 profile: userProfile
//             });
//         } catch (error) {
//             console.error('Error fetching user profile:', error.message);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Internal server error.'
//             });
//         }
//     }

    // /**
    //  * Handles the request to update a user's profile.
    //  * (Also protected by authentication middleware).
    //  */
    // static async updateProfile(req, res) {
    //     try {
    //         // Get userId from the auth middleware.
    //         const userId = req.user.userId;

    //         // Get update fields from the request body.
    //         const updates = req.body;

    //         // Call service layer to apply updates.
    //         const updatedUser = await UserService.updateUserProfile(userId, updates);

    //         // If no user found → return "Not Found".
    //         if (!updatedUser) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: 'User profile not found.'
    //             });
    //         }

    //         // Success → return updated profile.
    //         return res.status(200).json({
    //             success: true,
    //             message: 'User profile updated successfully!',
    //             profile: updatedUser
    //         });
    //     } catch (error) {
    //         console.error('Error updating user profile:', error.message);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Internal server error.'
    //         });
    //     }
    // }
// }

// // Export UserController so it can be used in routes.
// export default UserController;
