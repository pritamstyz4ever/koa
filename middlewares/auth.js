const jwt = require('jsonwebtoken');

// Basic Authentication middleware
const basicAuthMiddleware = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;

    console.log(ctx.headers);

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        ctx.throw(401, 'Authentication credentials not provided');
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
    const [name, pass] = decodedCredentials.split(':');

    const isValidCredentials = await validateCredentials(name, pass);

    if (!isValidCredentials) {
        ctx.throw(401, 'Invalid credentials');
    }
    ctx.state.user = name;
    ctx.state.pass = pass;
    await next();
};


// JWT Authentication middleware
const jwtAuthMiddleware = async (ctx, next) => {
    const token = ctx.request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        ctx.throw(401, 'Authentication credentials not provided');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
        ctx.state.user = decodedToken;
        await next();
    } catch (error) {
        ctx.throw(401, 'Invalid JWT token');
    }
};

// API Key Authentication middleware
const apiKeyAuthMiddleware = async (ctx, next) => {
    const apiKey = ctx.request.headers['x-api-key'];

    if (!apiKey) {
        ctx.throw(401, 'API key not provided');
    }

    await next();
};

// Helper function to validate username/password credentials
const validateCredentials = async (username, password) => {
    return true;
};

module.exports = {
    basicAuthMiddleware,
    jwtAuthMiddleware,
    apiKeyAuthMiddleware
};