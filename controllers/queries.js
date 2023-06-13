module.exports.userDataQuery = `SELECT u.*
FROM api_keys AS ak
JOIN users AS u ON ak.userId = u.userId
WHERE ak.apiKey = :apiKey
`;

module.exports.insertApiKeysQuery = `INSERT INTO API_KEYS (
  USER_ID,
  API_KEY,
  CREATION_TS,
  EXPIRATION_TS,
  DELETED_FLAG
)
VALUES (
  (SELECT USER_ID FROM USERS WHERE USER_ID = ?),
  ?,
  CURRENT_TIMESTAMP(),
  null,
  0
)`;

module.exports.insertUsersQuery = `INSERT INTO USERS (
    USERNAME,
    EMAIL,
    PASSWORD,
    SALT,
    ROLE,
    CREATED_TS,
    LAST_UPDATED_TS
  )
  VALUES (
    ?,
    ?,
    ?,
    ?,
    ?,
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
  )
`;