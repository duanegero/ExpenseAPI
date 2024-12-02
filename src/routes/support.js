//setting variables to handle imports
const express = require("express");
const router = express.Router();

//creating empty array varible to handle requests
const supportRequests = [];

//defining route for POST requests
router.post("/", (req, res) => {
  //creating details object to handle body of request
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

module.exports = router;
