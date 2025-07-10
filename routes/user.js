const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.post("/", authenticateToken, createUser);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;
