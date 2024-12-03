//setting variables to handle imports
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getCurrentBalance } = require("../helper_functions/getCurrentBalance");
const {
  getAllFromExpenses,
  postExpense,
  putExpense,
  getExpenseById,
} = require("../helper_functions/expenseServices");

//defining a route for GET URL
router.get("/", async (req, res) => {
  //Start try catch
  try {
    //calling function from for services
    const result = await getAllFromExpenses();
    // console.log(result.rows);
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
  //Start try catch
  try {
    //calling function from for services
    const result = await postExpense(payee, amount, description);
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
  //Start try catch
  try {
    //calling function from for services
    const result = await putExpense(expenseId, payee, amount, description);

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
});

//defining route for GET requests
router.get("/:id", async (req, res) => {
  //parse the id from the URL
  const expenseId = parseInt(req.params.id);
  //Start try catch
  try {
    //calling function from for services
    const result = await getExpenseById(expenseId);
    //returning JSON
    res.json(result.rows[0]);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;