
/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get API status
 *     description: Returns the status of the API.
 *     responses:
 *       200:
 *         description: API is up and running
 */
module.exports = (router) => {
  router.get('/status', async (ctx) => {
    ctx.body = { status: 'OK' };
  });
};