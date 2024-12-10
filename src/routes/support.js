//setting variables to handle imports
const express = require("express");
const pool = require("../db");
const router = express.Router();

const {
  postNewUser,
  getUser,
  deleteUserById,
} = require("../helper_functions/supportServices");

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
