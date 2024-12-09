const pool = require("../db");

const postNewUser = async (newUsername, newPassword) => {
  const maxId = await pool.query(
    "SELECT COALESCE(MAX(user_id), 0) AS max_id FROM users;"
  );

  const newUserId = maxId.rows[0].max_id + 1;

  const result = await pool.query(
    `INSERT INTO users(user_id, username, password)
        VALUES ($1, $2, $3 )
        RETURNING *;`,
    [newUserId, newUsername, newPassword]
  );
  return result;
};

const getUser = async (userId) => {
  const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
};

const deleteUserById = async (userId) => {
  const result = await pool.query(`DELETE FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
};

module.exports = {
  postNewUser,
  getUser,
  deleteUserById,
};
