const snowflake = require('snowflake-sdk');

// Create a Snowflake connection pool
const snowflakeConfig = {
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    role: process.env.SNOWFLAKE_ROLE,
    schema: process.env.SNOWFLAKE_SCHEMA,
};
snowflake.configure({ ocspFailOpen: false, logLevel: "DEBUG" });

const connectionPool = snowflake.createPool(snowflakeConfig, {
    min: 1,
    max: 10,
});;

// Middleware to handle Snowflake connection and data store access
const dataStoreMiddleware = async (ctx, next) => {
    try {
        // Acquire a connection from the pool
        const connection = await connectionPool.acquire();

        // Execute a SQL query
        const sql = 'SELECT 1';
        const statement = await connection.execute({ sqlText: sql });
        const stream = statement.streamRows();

        stream.on('error', function (err) {
            console.error('Unable to consume all rows', err);
        }).on('data', function (row) {
            console.log('Received row:', row);
        }).on('end', function () {
            console.log('All rows consumed');
        });

        ctx.state.dataStore = connection;

        // Continue to the next middleware or route handler
        await next();
    } catch (error) {
        console.error('Error connecting to Snowflake:', error);
        ctx.throw(500, 'Internal Server Error');
    } finally {
        // Release the connection back to the pool
        if (ctx.state.dataStore) {
            connectionPool.release(ctx.state.dataStore);
        }
    }
};

module.exports = dataStoreMiddleware;
