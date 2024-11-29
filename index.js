const express = require("express"); //importing exprees
const cors = require("cors"); //importing cors
const app = express(); //setting variable to handle express
const PORT = process.env.PORT || 3001; //setting port number for server

//setting variables to handle routes in API?
const moneyInRoute = require("./routes/income");
const moneyOutRoute = require("./routes/expenses");

app.use(express.json()); //middleware to parse and handle json
app.use(cors()); //enable cors for all routes

app.use("/income", moneyInRoute);
app.use("/expenses", moneyOutRoute);

app.get("/", (req, res) => {
  res.send("Welcome To Expense API");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
