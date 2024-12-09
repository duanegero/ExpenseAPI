//setting variables to handle imports
const express = require("express");
const pool = require("../db");
const router = express.Router();

//creating empty array varible to handle requests
const supportRequests = [];
const newUserRequest = [];

const {
  postNewUser,
  getUser,
  deleteUserById,
} = require("../helper_functions/supportServices");

//defining route for POST requests
router.post("/", (req, res) => {
  //creating variable to handle body of request
  const { details } = req.body;

  //if no deatils return error
  if (!details) {
    return res.status(400).json({ error: "Details are required" });
  }

  //push the request object the supprt array
  supportRequests.push({
    details,
    timestamp: new Date(),
  });

  //log the details of request
  console.log("Support Request:", details);

  //sending JSON result back
  res.status(200).json({ message: "Support request recieved!" });
});

//defining route for POST requests
router.post("/new-user", (req, res) => {
  //creating variable to handle body of request
  const { newUserName, newUserRole } = req.body;

  //if no name or role reture error
  if (!newUserName || !newUserRole) {
    return res.status(400).json({ error: "Name and role are required" });
  }

  //pushing the request object to array
  newUserRequest.push({ newUserName, newUserRole, timestamp: new Date() });

  //log new user info
  console.log("New User Request:", newUserName, newUserRole);

  //respond with json
  res.status(200).json({ message: "New User request recieved!" });
});

router.post("/add-user", async (req, res) => {
  const { newUsername, newPassword } = req.body;

  if (!newUsername || !newPassword) {
    return res.status(400).json({ error: "Username and Password required" });
  }

  try {
    const result = await postNewUser(newUsername, newPassword);
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
  const userId = parseInt(req.params.id);

  try {
    const result = await getUser(userId);
    res.json(result.rows[0]);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await deleteUserById(userId);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted", data: result.rows[0] });
  } catch (error) {
    //log any errors for troubleshoot
    console.log("Error", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
