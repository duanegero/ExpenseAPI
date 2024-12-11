//setting variables to handle imports
const express = require("express");
const pool = require("../db");
const router = express.Router();

const {
  postNewUser,
  getUser,
  deleteUserById,
} = require("../helper_functions/supportServices");
const verifyToken = require("../middleware/verifyToken");

router.post("/add-user", verifyToken, async (req, res) => {
  //getting the username and password from the request body
  const { newUsername, newPassword } = req.body;

  //if no username or password respond json error
  if (!newUsername || !newPassword) {
    return res.status(400).json({ error: "Username and Password required" });
  }

  try {
    //send a post request query
    const result = await postNewUser(newUsername, newPassword);
    //respond with success json message
    res
      .status(201)
      .json({ message: "User added successfully", user: result.rows[0] });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

router.get("/get-user/:id", async (req, res) => {
  //parse id from url
  const userId = parseInt(req.params.id);

  try {
    //send a get request query
    const result = await getUser(userId);
    //respond with result
    res.json(result.rows[0]);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

router.delete("/delete-user/:id", verifyToken, async (req, res) => {
  //parse id from url
  const userId = parseInt(req.params.id);

  try {
    //send a delete request query
    const result = await deleteUserById(userId);
    //if result finds nothing return json message
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    //if success send 200 ok and json success message
    res.status(200).json({ message: "User deleted", data: result.rows[0] });
  } catch (error) {
    //log any errors for troubleshoot
    console.log("Error", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
