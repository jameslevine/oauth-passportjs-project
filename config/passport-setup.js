const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
require("env2")("./config.env");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in database
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have a user, no need to save this one
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // no user exists, so create one
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture
          })
            .save()
            .then(newUser => {
              console.log("New User Created: ", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
