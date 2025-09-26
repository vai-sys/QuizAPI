
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");


dotenv.config();


const app = express();


app.use(bodyParser.json()); 


connectDB();


app.get("/", (req, res) => {
  res.json({ message: "Hi there!!!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
