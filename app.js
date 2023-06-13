const Koa = require('koa');
const Router = require('koa-router');
const dotenv = require('dotenv');
dotenv.config();

const { koaSwagger } = require('koa2-swagger-ui');
const bodyParser = require('koa-bodyparser');
const requireDirectory = require('require-directory');
const cors = require('@koa/cors');
const { basicAuthMiddleware, jwtAuthMiddleware, apiKeyAuthMiddleware } = require('./middlewares/auth');
const { loggerMiddleware, requestMiddleware } = require('./middlewares/logger');
const rateLimitMiddleware = require('./middlewares/ratelimit');

const helmet = require('koa-helmet');
// Load environment variables from .env file

const dataStoreMiddleware = require('./middlewares/dataStore');

const app = new Koa();
const router = new Router();


// Error handling middleware
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = 'Unauthorized access\n';
        } else {
            // Handle errors
            ctx.status = err.status || 500;
            ctx.body = { error: err.message };
            console.error(err);
        }
    }
});

app.use(loggerMiddleware)
app.use(requestMiddleware)
// app.use(rateLimitMiddleware);

// Apply the data store middleware
app.use(dataStoreMiddleware);


// Enable CORS
app.use(cors());

// Apply the bodyParser middleware to parse the request body
app.use(bodyParser());

// Authentication middleware
// Apply the authentication middleware globally, excluding '/status' and '/docs'
app.use(async (ctx, next) => {
    if (ctx.path === '/status' || ctx.path === '/docs') {
        await next();
    } else {
        if (ctx.path === '/client/key') {
            await basicAuthMiddleware(ctx, next);
        } else if (ctx.path === '/auth/token') {
            await apiKeyAuthMiddleware(ctx, next);
        } else {
            await jwtAuthMiddleware(ctx, next);
        }
    }
});

// Apply Helmet middleware
// app.use(helmet());

// Load and register routes from the routes directory
requireDirectory(module, './routes', {
    visit: (route) => {
        if (typeof route === 'function') {
            route(router);
        }
    },
});

// Swagger documentation route
const swaggerDef = require('./swaggerDef');
router.get('/docs', koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
        spec: swaggerDef
    }
}));


// Register routes
app.use(router.routes());
app.use(router.allowedMethods());


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
