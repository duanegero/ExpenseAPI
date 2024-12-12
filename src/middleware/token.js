const jwt = require("jsonwebtoken"); //requiring jwt to verify token
const { myKey } = require("../routes/login"); //importing mykey from login

const verifyToken = function (req, res, next) {
  const authHeader = req.headers["authorization"]; //checking the request header for token, authorization is the key
  const token = authHeader.split(" ")[1]; //removing the bearer from the token
  try {
    //using jwt to verify token and key
    jwt.verify(token, myKey);
    next();
  } catch (error) {
    console.log("ERROR", error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

//export to use else where
module.exports = verifyToken;
