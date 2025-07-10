const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return errorResponse(res, 401, "Akses ditolak");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return errorResponse(res, 403, "Token tidak valid");
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
