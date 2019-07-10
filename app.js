const express = require("express");
const authRoutes = require("./routes/auth-routes.js");
const profileRoutes = require("./routes/profile-routes.js");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
require("env2")("./config.env");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

// set up view engine
app.set("view engine", "ejs");

// cookie middleware
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIEKEY]
  })
);

// initialise passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(
  process.env.DBURI,
  () => {
    console.log("connected to mongodb");
  }
);

// setup authRoutes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// set up server on port 3000
app.listen(3000, () => {
  console.log("app now listening on port 3000");
});
