require("dotenv").config();

const express = require("express");
const { sendStatus } = require("express/lib/response");

const app = express();
const OAuth2Strategy = require('../lib/strategy');
const passport = require('passport-strategy')
app.use(express.json());

app.post("/api/validate-ping", authenicateToken, (req, res) => {
  const token = req.body.token;
  const jwt = { token: token };

  res.json({ token: jwt });
});

function authenicateToken(req, res, nex) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.example.com/as/authorization.oauth2',
    tokenURL: `https://www.example.com/as/${token}`,
    clientID: EXAMPLE_CLIENT_ID,
    clientSecret: EXAMPLE_CLIENT_SECRET,
    callbackURL: ""
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'ping.id' : profile.id }, function (err, user) {
        if (err) { return done(err); }
        if (user) {
            return done(null, user);
        } else {
            var newUser = new User();
            newUser.ping.id    = profile.id;
            newUser.ping.token = accessToken;
            newUser.ping.name  = profile.displayName;
            newUser.ping.email = profile.email;
            newUser.save(function(err) {
                if (err) { throw err; }
                return done(null, newUser);
            });
        }
    });
  }
));
}

app.listen(3000);
