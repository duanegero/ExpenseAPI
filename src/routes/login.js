const express = require("express"); //importing express from npm
const router = express.Router(); //creating a router variable to handle the route
const jwt = require("jsonwebtoken"); //importing jwt from npm
const pool = require("../db");
const { generateApiKey } = require("../helper_functions/generateApiKey"); //importing helper function
const crypto = require("crypto"); //importing crypto to generate keys

//calling function to generate, log for testing
const myKey = generateApiKey();
console.log("Generated API Key: ", myKey);

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required" });
  }

  const query = `SELECT * FROM users
WHERE username = $1 AND password = $2;`;

  try {
    const result = await pool.query(query, [username, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const user = result.rows[0];

    const payload = { userId: user.user_id };

    const token = jwt.sign(payload, myKey);

    res.json(token);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
