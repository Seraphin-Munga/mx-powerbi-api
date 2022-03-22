require("dotenv").config();

const express = require("express");
const { sendStatus } = require("express/lib/response");

const app = express();

const jwt = require("jsonwebtoken");

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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
    if (err) return sendStatus(403);
    req.token = token;
    next();
  });
}

app.listen(3000);
