//setting variables to handle imports
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getCurrentBalance } = require("../helper_functions/getCurrentBalance");

//defining a route for GET URL
router.get("/", async (req, res) => {
  //Start try catch
  try {
    //sending a query, making varible to handle
    const result = await pool.query("SELECT * FROM expense ORDER BY expenseid");
    //creating variable to get total

    const currentBalance = await getCurrentBalance();

    //return the JSON
    res.json({
      expensesDetails: result.rows,
      totalExpenses: currentBalance.totalExpenses,
      currentBalance: currentBalance.currentBalance,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "ERROR" });
  }
});

//defining a route for POST to URL
router.post("/", async (req, res) => {
  //getting the info from the request body
  const { payee, amount, description } = req.body;

  //if all fields are filled return error
  if (!payee || !amount || !description) {
    return res
      .status(400)
      .json({ message: "Payee, amount and description are required." });
  }

  try {
    //sending query find max id's in table
    const maxId = await pool.query(
      "SELECT COALESCE(MAX(expenseid), 0) AS max_id FROM expense;"
    );

    //setting new id to max +1
    const newId = maxId.rows[0].max_id + 1;

    //creating a query variable to use when send queries
    const query = `INSERT INTO expense(expenseid, payee, amount, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
    //sending a query with query variable and info from request body
    const result = await pool.query(query, [newId, payee, amount, description]);

    const currentBalance = await getCurrentBalance();

    //sending JSON result back
    res.status(201).json({
      message: "Expense added successfully",
      newExpense: result.rows[0],
      totalExpenses: currentBalance.totalExpenses,
      currentBalance: currentBalance.currentBalance,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

//defining route for PUT requests
router.put("/:id", async (req, res) => {
  //parse the id from the URL
  const expenseId = parseInt(req.params.id);

  //getting the info from the request body
  const { payee, amount, description } = req.body;

  try {
    //creating a query variable to use when send queries
    const query = `UPDATE expense 
      SET payee = $1, amount = $2, description = $3
      WHERE expenseid = $4
      RETURNING *;`;

    //sending a query with query variable and info from request body
    const result = await pool.query(query, [
      payee,
      amount,
      description,
      expenseId,
    ]);

    //calling get current balance function
    const currentBalance = await getCurrentBalance();

    //sending JSON result back
    res.status(200).json({
      message: "Updated successfully",
      updatedExpense: result.rows[0],
      totalExpenses: currentBalance.totalExpenses,
      currentBalance: currentBalance.currentBalance,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }

  //Will allow user to update a expense, the where and why and amount
});

//defining route for GET requests
router.get("/:id", async (req, res) => {
  //parse the id from the URL
  const expenseId = parseInt(req.params.id);

  try {
    //sending a query and assigning variable
    const result = await pool.query(
      `SELECT * FROM expense WHERE expenseid = $1`,
      [expenseId]
    );
    //returning JSON
    res.json(result.rows[0]);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
