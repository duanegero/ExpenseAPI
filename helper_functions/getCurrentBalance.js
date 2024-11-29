const pool = require("../db");

const getCurrentBalance = async () => {
  try {
    //creating variable to get total
    const totalQuery =
      "SELECT COALESCE(SUM(amount), 0) AS total_amount FROM income";

    //sending query to get total
    const totalResult = await pool.query(totalQuery);
    //assigning results to variable
    const totalIncome = totalResult.rows[0].total_amount;

    //creating query variable to handle expense total
    const totalExpensesQuery =
      "SELECT COALESCE(SUM(amount), 0) AS total_expense FROM expense";
    //sending query to get expense total
    const totalExpensesResult = await pool.query(totalExpensesQuery);
    //assigning results to a variable
    const totalExpenses = totalExpensesResult.rows[0].total_expense;

    //varible to handle current balance
    const currentBalance = (totalIncome - totalExpenses).toFixed(2);

    //return variables to use else where
    return { totalIncome, currentBalance, totalExpenses };
  } catch (error) {
    console.error("Error in getCurrentBalance", error);
    throw error;
  }
};

module.exports = { getCurrentBalance };
