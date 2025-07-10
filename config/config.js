// config/config.js
require("dotenv").config();
module.exports = {
  // jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "1d",
  jwtRefreshExpiration: "7d",
};
