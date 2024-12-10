const crypto = require("crypto"); //requiring the crypto module

function generateApiKey() {
  //returing a randon 32 hex number to use as a key
  return crypto.randomBytes(16).toString("hex");
}

//exporting the function to use else where
module.exports = { generateApiKey };
