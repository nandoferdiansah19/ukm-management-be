const express = require("express");
const authenticateToken = require("../middleware/auth");
const {
  getInstruments,
  createIntrument,
  loanInstrument,
  returnInstrument,
  getInstrumentById,
  updateInstrument,
  deleteInstrument,
} = require("../controllers/intrumentController");

const router = express.Router();

router.get("/", authenticateToken, getInstruments);
router.post("/", authenticateToken, createIntrument);
router.post("/:id/loan", authenticateToken, loanInstrument);
router.put("/:id/return", authenticateToken, returnInstrument);
router.get("/:id", authenticateToken, getInstrumentById);
router.put("/:id", authenticateToken, updateInstrument);
router.delete("/:id", authenticateToken, deleteInstrument);

module.exports = router;
