//setting variables to handle imports
const express = require("express");
const router = express.Router();

const callbackRequest = [];

router.post("/", (req, res) => {
  const { name, phoneNumber, email } = req.body;

  if (!name && (!phoneNumber || !email)) {
    return res
      .status(400)
      .json({ error: "Name and phone number or email required " });
  }

  callbackRequest.push({
    name,
    phoneNumber,
    email,
    timestapm: new Date(),
  });

  console.log("Callback Request: ", { name, phoneNumber, email });
  res.status(200).json({ message: "Callback request recieved " });
});

module.exports = router;
