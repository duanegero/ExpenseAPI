const pool = require("../db");

const postNewUser = async (newUsername, newPassword) => {
  //sending a query to find max number in id collum
  const maxId = await pool.query(
    "SELECT COALESCE(MAX(user_id), 0) AS max_id FROM users;"
  );

  //making a new id by adding 1 to the max
  const newUserId = maxId.rows[0].max_id + 1;

  //sending a query and assigning to a varible to return
  const result = await pool.query(
    `INSERT INTO users(user_id, username, password)
        VALUES ($1, $2, $3 )
        RETURNING *;`,
    [newUserId, newUsername, newPassword]
  );
  return result;
};

const getUser = async (userId) => {
  //sending a query to database, assigning results to a variable
  const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
};

const deleteUserById = async (userId) => {
  //sending a query to database, assigning results to a variable
  const result = await pool.query(`DELETE FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
};

const postDeleteRequest = async (details) => {
  const result = await pool.query(
    `INSERT INTO delete_new_user_requests(details) VALUES($1) RETURNING *`,
    [details]
  );
  return result;
};

const postNewUserRequest = async (newUserName, newUserRole) => {
  const result = await pool.query(
    `INSERT INTO delete_new_user_requests(new_name, new_role) VALUES($1, $2)`,
    [newUserName, newUserRole]
  );
  return result;
};

//exporting functions to use else where
module.exports = {
  postNewUser,
  getUser,
  deleteUserById,
  postDeleteRequest,
  postNewUserRequest,
};
