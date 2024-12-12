//setting variables to handle imports
const express = require("express");
const pool = require("../db");
const router = express.Router();
const {
  postDeleteRequest,
  postNewUserRequest,
  getAllRequest,
  deleteRequest,
} = require("../helper_functions/supportServices");
const verifyToken = require("../middleware/token");

//defining route for POST requests
router.post("/", async (req, res) => {
  //creating variable to handle body of request
  const { details } = req.body;

  //if no deatils return error
  if (!details) {
    return res.status(400).json({ error: "Details are required" });
  }

  try {
    //send query to post request to data base
    const result = await postDeleteRequest(details);
    //assign the new request to a varible
    const deleteRequest = result.rows[0];
    //response status and json
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
    //sending query to add new user request to data base
    const result = await postNewUserRequest(newUserName, newUserRole);
    //assign the new user request to a varible
    const userRequest = result.rows[0];
    //return json and success message
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

//defining route for GET request
router.get("/", verifyToken, async (req, res) => {
  try {
    //send a get query to get a requests in table
    const result = await getAllRequest();
    //response ok status
    res.status(200).json(result.rows);
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(500).json({ message: "Error" });
  }
});

//defining route for delete request
router.delete("/:id", verifyToken, async (req, res) => {
  //parsing the ID from URL
  const requestId = parseInt(req.params.id);

  try {
    //try a delete query with the id from url
    const result = await deleteRequest(requestId);
    //if no results from database respond with message
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }
    //else repsonsed 200 status and success message
    res.status(200).json({ message: "Request deleted", data: result.rows[0] });
  } catch (error) {
    //log any errors for troubleshoot
    console.log("Error", error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
