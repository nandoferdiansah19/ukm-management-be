const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authService = require("../services/auth");
const { errorResponse, successResponse } = require("../utils/response");

// Register
exports.register = async (req, res) => {
  const { name, nim, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userData = await prisma.users.findUnique({ where: { nim } });

    if (userData) {
      return errorResponse(res, 400, "Nim sudah digunakan");
    }

    const user = await prisma.users.create({
      data: { name, nim, password: hashedPassword, role },
    });

    successResponse(res, 200, "Registrasi berhasil", user);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Login
exports.login = async (req, res) => {
  const { nim, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { nim } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "NIM atau password salah" });
    }

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    const accessTokenData = jwt.decode(accessToken);
    const accessTokenExpiry = accessTokenData
      ? accessTokenData.exp - Math.floor(Date.now() / 1000)
      : null;

    const userRes = {
      id: user?.id,
      name: user?.name,
      nim: user?.nim,
      program_study: user?.program_study,
      year: user?.year,
      phone: user?.phone,
      address: user?.address,
      division: user?.division,
      role: user?.role,
    };

    res.json({
      status: "success",
      message: "Berhasil login",
      accessToken,
      refreshToken,
      expires: accessTokenExpiry,
      data: userRes,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return errorResponse(res, 400, "Refresh token is required");
  }

  try {
    const user = await prisma.users.findUnique({ where: { nim } });
    if (!user) {
      return errorResponse(res, 404, "Data user tidak ditemukan");
    }

    const accessToken = authService.generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    errorResponse(res, 500, "Internal server error");
  }
};
