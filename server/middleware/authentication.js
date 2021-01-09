const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("authentication-token");
  const decoded = jwt.verify(token, config.get("jsonwebtokenSecretKey"));
  console.log(decoded);
  req.user = decoded.user;
  next();
};
