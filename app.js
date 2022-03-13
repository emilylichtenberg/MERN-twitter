const express = require("express");
const app = express();
// DB
const db = require('./config/keys').mongoURI
const mongoose = require('mongoose');

const passport = require('passport');

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const User = require(('./models/User'))

// JSON parser / middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const req = require("express/lib/request");


mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

  // Port
  const port = process.env.PORT || 5500;
  app.listen(port, () => console.log(`Server is running on port ${port}`));


// app.get("/", (req, res) => res.send("Hello World!!"));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/tweets", tweets);

