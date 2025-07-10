const express = require("express");
const authenticateToken = require("../middleware/auth");
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  attendance,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", authenticateToken, getEvents);
router.post("/", authenticateToken, createEvent);
router.post("/:id/attendance", authenticateToken, attendance);
router.get("/:id", authenticateToken, getEventById);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);

module.exports = router;
