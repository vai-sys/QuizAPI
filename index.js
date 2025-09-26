
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");
const quizRoutes = require("./routes/quizRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");

dotenv.config(); 
const app = express();


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Hi there!!! Quiz API is running " });
});


app.use("/api/quiz", quizRoutes);


app.use("/api/question", questionRoutes);





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
