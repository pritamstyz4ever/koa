const rateLimit = require('koa-ratelimit');
// apply rate limit
const db = new Map();

// Rate limiting middleware
const rateLimitMiddleware = async (ctx, next) => {
    await rateLimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Too many requests, you are being rate limited.',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 100,
        disableHeader: false,
        whitelist: (ctx) => {
        },
        blacklist: (ctx) => {
            // some logic that returns a boolean
        }
    })
    await next();
};



module.exports = rateLimitMiddleware;