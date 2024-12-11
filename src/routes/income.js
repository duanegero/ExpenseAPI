//setting variables to handle imports
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getCurrentBalance } = require("../helper_functions/getCurrentBalance");

const {
  getAllFromIncome,
  postIncome,
  putIncome,
  getIncomeById,
  deleteIncomeById,
} = require("../helper_functions/incomeServices");
const verifyToken = require("../middleware/verifyToken");

//defining a route for GET URL
router.get("/", async (req, res) => {
  //Start try catch
  try {
    //calling function from for services
    const result = await getAllFromIncome();
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
    //calling function from for services
    const result = await postIncome(source, amount, description);

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
    //calling function from for services
    const result = await putIncome(source, amount, description, incomeId);

    //calling get current balance function
    const currentBalance = await getCurrentBalance();

    //return json with success message
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

//defining a route for GET requests
router.get("/:id", async (req, res) => {
  //parse the id from the URL
  const incomeId = parseInt(req.params.id);

  try {
    //calling function from for services
    const result = await getIncomeById(incomeId);
    //respond json result
    res.json(result.rows[0]);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

//defining a route for DELETE requests
router.delete("/:id", verifyToken, async (req, res) => {
  //getting the id from URL
  const incomeId = parseInt(req.params.id);

  try {
    //calling function and passing in id from url
    const result = await deleteIncomeById(incomeId);

    //if result finds nothing return message
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Income not found" });
    }
    //respond with ok and success message
    res.status(200).json({ message: "Income deleted", data: result.rows[0] });
  } catch (error) {
    //log any errors for troubleshoot
    console.log("Error", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
