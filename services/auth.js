const jwt = require("jsonwebtoken");
const {
  // jwtSecret,
  jwtExpiration,
  jwtRefreshExpiration,
} = require("../config/config");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      nim: user.nim,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: jwtExpiration }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      nim: user.nim,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: jwtRefreshExpiration,
    }
  );
};
