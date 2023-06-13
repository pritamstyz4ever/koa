const queries = require('./queries');

async function fetchUserMetadata(dataStore, apiKey) {
    if (dataStore) {
        // Query to fetch the user metadata from the database
        const query = queries.userDataQuery;

        // Parameters for the query
        const params = {
            apiKey,
        };

        try {
            // Execute the query using the Snowflake driver
            const result = await dataStore.execute(query, params);

            // Check if a user record is found
            if (result.rowCount === 0) {
                throw new Error('Invalid API key');
            }

            // Extract the user metadata from the result
            const user = result.rows[0];

            return user;
        } catch (error) {
            throw new Error('Failed to fetch user metadata');
        }
    }
    const userData = [
        {
            apiKey: '52ba0d5093d32804d509b63074a6ad34',
            email: 'test1@example.com',
            scope: ['admin', 'user'],
            context: 'client1',
        },
        {
            apiKey: 'cebd86ef81e84c7ad8bbe7af29cb17f1',
            email: 'test2@example.com',
            scope: ['user'],
            context: 'client2',
        },
    ];

    const user = userData.find((user) => user.apiKey === apiKey);
    if (!user) {
        throw new Error('Invalid API key');
    }

    return user;
}

const getUser = async (dataStore, username) => {
    console.log('Fetching user:', username);
    const query = `
      SELECT USER_ID, USERNAME, EMAIL, PASSWORD, ROLE FROM USERS
      WHERE USERNAME = ?`;

    try {
        const statement = await dataStore.execute({ sqlText: query, binds: [username] });
        const rows = statement.fetchRows();
        // const stream = statement.streamRows();
        // const rows = [];
        // await new Promise((resolve, reject) => {
        //     stream.on('error', reject);
        //     stream.on('data', (row) => rows.push(row));
        //     stream.on('end', resolve);
        // });
        console.log('User:', rows[0]); // Assuming there is only one user with the given username
        return rows[0];
    } catch (error) {
        console.error('Error selecting user:', error);
    }
};


module.exports = {
    fetchUserMetadata,
    getUser
};