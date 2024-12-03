const express = require("express");
const pool = require("../db");

const getAllFromIncome = async () => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query("SELECT * FROM income ORDER BY incomeid");
  return result;
};

const postIncome = async (source, amount, description) => {
  //sending query find max id's in table
  const maxId = await pool.query(
    "SELECT COALESCE(MAX(incomeid), 0) AS max_id FROM income;"
  );

  //setting new id to max +1
  const newId = maxId.rows[0].max_id + 1;

  //sending a query, making varible to handle, returning results
  const result = await pool.query(
    `INSERT INTO income(incomeid, source, amount, description)
            VALUES ($1, $2, $3, $4 )
            RETURNING *;`,
    [newId, source, amount, description]
  );
  return result;
};

const putIncome = async (source, amount, description, incomeId) => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query(
    `UPDATE income
      SET source = $1, amount = $2, description = $3, created_at = CURRENT_TIMESTAMP
      WHERE incomeid = $4
      RETURNING *;`,
    [source, amount, description, incomeId]
  );
  return result;
};

const getIncomeById = async (incomeId) => {
  //sending a query, making varible to handle, returning results
  const result = await pool.query(`SELECT * FROM income WHERE incomeid = $1`, [
    incomeId,
  ]);
  return result;
};

module.exports = { getAllFromIncome, postIncome, putIncome, getIncomeById };
