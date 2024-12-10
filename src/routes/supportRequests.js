//setting variables to handle imports
const express = require("express");
const pool = require("../db");
const { default: axios } = require("axios");
const router = express.Router();
const {
  postDeleteRequest,
  postNewUserRequest,
} = require("../helper_functions/supportServices");

//defining route for POST requests
router.post("/", async (req, res) => {
  //creating variable to handle body of request
  const { details } = req.body;

  //if no deatils return error
  if (!details) {
    return res.status(400).json({ error: "Details are required" });
  }

  try {
    const result = await postDeleteRequest(details);
    const deleteRequest = result.rows[0];
    res.status(201).json({
      message: "Request sent successfully",
      deleteRequest,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }

  //log the details of request
  console.log("Support Request:", details);
});

//defining route for POST requests
router.post("/new-user", async (req, res) => {
  //creating variable to handle body of request
  const { newUserName, newUserRole } = req.body;

  //if no name or role reture error
  if (!newUserName || !newUserRole) {
    return res.status(400).json({ error: "Name and role are required" });
  }

  try {
    const result = await postNewUserRequest(newUserName, newUserRole);
    const userRequest = result.rows[0];
    res.status(201).json({
      message: "Request sent successfully",
      userRequest,
    });
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }

  //log new user info
  console.log("New User Request:", newUserName, "Role:", newUserRole);
});

module.exports = router;
