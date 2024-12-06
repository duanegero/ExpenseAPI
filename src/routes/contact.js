//setting variables to handle imports
const express = require("express");
const router = express.Router();

//creating a array variable to handle requests made
const callbackRequest = [];

router.post("/", (req, res) => {
  //variables handle details n request body
  const { name, phoneNumber, email } = req.body;

  //if not enough details for request return error
  if (!name && (!phoneNumber || !email)) {
    return res
      .status(400)
      .json({ error: "Name and phone number or email required " });
  }

  //pushing request to array
  callbackRequest.push({
    name,
    phoneNumber,
    email,
    timestapm: new Date(),
  });

  //log request for testing
  console.log("Callback Request: ", { name, phoneNumber, email });
  //return ok status with message
  res.status(200).json({ message: "Callback request recieved " });
});

module.exports = router;
