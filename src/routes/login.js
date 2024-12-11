const express = require("express"); //importing express from npm
const router = express.Router(); //creating a router variable to handle the route
const jwt = require("jsonwebtoken"); //importing jwt from npm
const pool = require("../db");
const { generateApiKey } = require("../helper_functions/generateApiKey"); //importing helper function

//calling function to generate, log for testing
const myKey = generateApiKey();
console.log("Generated API Key: ", myKey);

router.post("/", async (req, res) => {
  //getting username and password from body
  const { username, password } = req.body;

  //if no username or password return error
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required" });
  }

  //variablew to handle the query
  const query = `SELECT * FROM support_staff
WHERE username = $1 AND password = $2;`;

  //start try catch
  try {
    //sending query to database, assign to variable
    const result = await pool.query(query, [username, password]);

    //if nothing found return invalid
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    //assgin returned result to variable
    const user = result.rows[0];

    //create payload
    console.log(user.support_id);
    const payload = { userId: user.support_id };

    //create toke with jwt, payload and key
    const token = jwt.sign(payload, myKey);

    //responsed with token
    res.json(token);
    console.log(token);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
module.exports.myKey = myKey;
