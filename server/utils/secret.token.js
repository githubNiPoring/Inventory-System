require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

module.exports = { createSecretToken };
