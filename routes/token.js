const userService = require('../controllers/userService');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /auth/token:
 *   post:
 *     tags:
 *       - auth
 *     summary: Generate a JWT token
 *     description: Create a JWT token
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *     securitySchemes:
 *       apiKeyAuth:
 *         type: apiKey
 *         in: header
 *         name: x-api-key
 *         description: API key
 */
module.exports = (router) => {
    router.get('/auth/token', async (ctx) => {
        try {
            const apiKey = ctx.request.headers['x-api-key'];

            // Fetch the user metadata from the database based on the API key
            const userMetadata = await userService.fetchUserMetadata(ctx.dataStore, apiKey);

            // Extract the necessary information from the user metadata
            const { email, scope, context } = userMetadata;

            // Generate the JWT token
            const token = jwt.sign(
                { email, scope, context },
                process.env.JWT_PRIVATE_KEY,
                {
                    expiresIn: '1h',
                    algorithm: 'RS256',
                    jwtid: uuidv4()
                }
            );

            // Return the token in the response
            ctx.body = { token };
        } catch (error) {
            console.error('Error generating JWT token:', error);
            ctx.status = 500;
            ctx.body = { error: 'Failed to generate JWT token' };
        }
    });
};
