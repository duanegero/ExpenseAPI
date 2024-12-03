//setting variables to handle imports
const express = require("express");
const pool = require("../db");

const getAllFromExpenses = async () => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query("SELECT * FROM expense ORDER BY expenseid");
  return result;
};

const postExpense = async (payee, amount, description) => {
  //query to find max id in table
  const maxId = await pool.query(
    "SELECT COALESCE(MAX(expenseid), 0) AS max_id FROM expense;"
  );
  //making a new id
  const newId = maxId.rows[0].max_id + 1;

  //sending a query, making varible to handle, returning results
  const result = await pool.query(
    `INSERT INTO expense(expenseid, payee, amount, description)
              VALUES ($1, $2, $3, $4)
              RETURNING *`,
    [newId, payee, amount, description]
  );
  return result;
};

const putExpense = async (expenseId, payee, amount, description) => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query(
    `UPDATE expense 
        SET payee = $1, amount = $2, description = $3, created_at = CURRENT_TIMESTAMP
        WHERE expenseid = $4
        RETURNING *;`,
    [payee, amount, description, expenseId]
  );
  return result;
};

const getExpenseById = async (expenseId) => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query(
    `SELECT * FROM expense WHERE expenseid = $1`,
    [expenseId]
  );
  return result;
};

module.exports = {
  getAllFromExpenses,
  postExpense,
  putExpense,
  getExpenseById,
};
