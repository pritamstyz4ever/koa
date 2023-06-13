const pino = require('pino');
const logger = pino();

// Logger middleware
const loggerMiddleware = async (ctx, next) => {
    logger.info(`${ctx.method} ${ctx.url}`);
    await next();
};

// Request middleware
const requestMiddleware = async (ctx, next) => {
    // Handle the request
    await next();

    // Log the response
    const responseTime = ctx.response.get('X-Response-Time');
    logger.info(`${ctx.method} ${ctx.url} - ${ctx.status} - ${responseTime}`);
};

module.exports = {
    loggerMiddleware,
    requestMiddleware
};