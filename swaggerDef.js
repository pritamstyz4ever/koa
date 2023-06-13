const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'Rest API documentation using swagger-jsdoc',
        },
    },
    apis: [path.join(__dirname, './routes/*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 

