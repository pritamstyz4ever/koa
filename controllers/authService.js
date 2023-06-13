const crypto = require('crypto');

const generateApiKey = async (dataStore, email, username) => {
  // Generate the API key
  const apiKey = generateUniqueApiKey();

  // Store the metadata in the database
  const clientId = await storeApiKeyMetadata(dataStore, apiKey, email, username);

  // Return the generated API key as the response
  return {apiKey, clientId};
};

// Helper function to generate a unique API key
const generateUniqueApiKey = () => {
  // Generate a random API key using crypto module
  const apiKeyLength = 16; // Length of the API key in bytes
  const apiKey = crypto.randomBytes(apiKeyLength).toString('hex');

  // Return the generated API key
  return apiKey;
};

// Helper function to store the API key metadata in the database
const storeApiKeyMetadata = async (dataStore, apiKey, email, username) => {
  try {
    const insert1 = queries.insertUsersQuery;
    const values1 = [username, email, 'NULL', 'NULL', 'user'];
  
    const userResult = await dataStore.execute(insert1, values1);
    const userId = userResult[0].USER_ID;

    const insert2 = queries.insertApiKeysQuery;
    const values2 = [userId, apiKey];

    await dataStore.execute(insert2, values2);

    return userId;
  } catch (error) {
    // Handle error
    console.error('Error storing API key metadata:', error);
    throw error;
  }
};

module.exports = {
  generateApiKey
};