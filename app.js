const express = require("express");
const app = express();

const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

  
// ROUTES
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

app.get("/", (req, res) => res.send("Hello World!!"));
app.use("/api/users", users);
app.use("/api/tweets", tweets);

// Port
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// JSON parser / middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());