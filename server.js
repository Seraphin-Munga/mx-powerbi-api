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

  var strategy = new OAuth2Strategy({
    authorizationURL: 'https://www.example.com/oauth2/authorize',
    tokenURL: `https://www.example.com/oauth2/${token}`,
    clientID: 'ABC123',
    clientSecret: 'secret',
    callbackURL: 'https://www.example.net/auth/example/callback',
    state: true,
    pkce: true
  },
  function(accessToken, profile, done) {
    if (accessToken == token) { 
      return done(null, { id: '1234' }, { message: 'Hello' });
    }
    return done(null, false);
  })
}

app.listen(3000);
