const { generateApiKey } = require('../controllers/authService');
const { getUser } = require('../controllers/userService');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /client/key:
 *   post:
 *     tags:
 *       - client
 *     summary: Generate an API key
 *     description: Create an API key for the given email and client
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Basic authentication credentials in the format "username:password" encoded in base64.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               client:
 *                 type: string
 *             required:
 *               - email
 *               - client
 *     responses:
 *       '200':
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                 clientId:
 *                   type: string
 */
module.exports = (router) => {
    router.post('/client/key', async (ctx) => {
        const user = await getUser(ctx.state.dataStore, ctx.state.user);
        console.log('user', user);
        if (!user) {
            ctx.status = 401;
            ctx.body = { error: 'Invalid credentials' };
            return;
        }

        const isValidPassword = await bcrypt.compare(ctx.state.pass, user.PASSWORD);
        if (!isValidPassword) {
            ctx.status = 401;
            ctx.body = { error: 'Invalid credentials' };
        }

        const isAdmin = user.ROLE === 'admin';
        if (isAdmin) {
            ctx.status = 403;
            ctx.body = { error: 'Forbidden' };
        }
        // Get the request email and context from the request body
        const { email, username } = ctx.request.body;

        const { apiKey, clientId } = await generateApiKey(ctx.state.dataStore, email, username);

        ctx.body = { apiKey, clientId };
        console.log('ctx.request.body', apiKey);
    });
};
