const express = require("express");
const authenticateToken = require("../middleware/auth");
const {
  getSkills,
  createSkill,
  updateBulkSkill,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", authenticateToken, getSkills);
router.post("/", authenticateToken, createSkill);
router.put("/rating", authenticateToken, updateBulkSkill);
router.get("/:id", authenticateToken, getSkillById);
router.put("/:id", authenticateToken, updateSkill);
router.delete("/:id", authenticateToken, deleteSkill);

module.exports = router;
