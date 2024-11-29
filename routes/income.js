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
    const result = await pool.query("SELECT * FROM income ORDER BY incomeid");

    //calling get current balance function
    const currentBalance = await getCurrentBalance();

    //returing the JSON
    res.json({
      totalDeposits: result.rows,
      totalIncome: currentBalance.totalIncome,
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
  const { source, amount, description } = req.body;

  //if all fields are filled return error
  if (!source || !amount || !description) {
    return res
      .status(400)
      .json({ message: "Source, amount and description are required." });
  }

  try {
    //sending query find max id's in table
    const maxId = await pool.query(
      "SELECT COALESCE(MAX(incomeid), 0) AS max_id FROM income;"
    );

    //setting new id to max +1
    const newId = maxId.rows[0].max_id + 1;

    //creating a query variable to use when send queries
    const query = `INSERT INTO income(incomeid, source, amount, description)
            VALUES ($1, $2, $3, $4 )
            RETURNING *;`;
    //sending a query with query variable and info from request body
    const result = await pool.query(query, [
      newId,
      source,
      amount,
      description,
    ]);

    //calling get current balance function
    const currentBalance = await getCurrentBalance();

    //sending JSON result back
    res.status(201).json({
      message: "Added successfully",
      newIncome: result.rows[0],
      totalIncome: currentBalance.totalIncome,
      currentBalance: currentBalance.currentBalance,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

//defining a route for PUT to URL
router.put("/:id", async (req, res) => {
  //parse the id from the URL
  const incomeId = parseInt(req.params.id);

  //getting the info from the request body
  const { source, amount, description } = req.body;

  try {
    //creating a query variable to use when send queries
    const query = `UPDATE income
        SET source = $1, amount = $2, description = $3, created_at = CURRENT_TIMESTAMP
        WHERE incomeid = $4
        RETURNING *;`;
    //sending a query with query variable and info from request body
    const result = await pool.query(query, [
      source,
      amount,
      description,
      incomeId,
    ]);

    //calling get current balance function
    const currentBalance = await getCurrentBalance();

    res.status(200).json({
      message: "Updated successfully",
      updatedIncome: result.rows[0],
      totalIncome: currentBalance.totalIncome,
      currentBalance: currentBalance.currentBalance,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

//defining a route for GETT requests
router.get("/:id", async (req, res) => {
  //parse the id from the URL
  const incomeId = parseInt(req.params.id);

  try {
    //sending a query and assigning variable
    const result = await pool.query(
      `SELECT * FROM income WHERE incomeid = $1`,
      [incomeId]
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
