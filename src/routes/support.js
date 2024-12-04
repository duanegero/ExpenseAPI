//setting variables to handle imports
const express = require("express");
const router = express.Router();

//creating empty array varible to handle requests
const supportRequests = [];
const newUserRequest = [];

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

module.exports = router;
