require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const instrumentRoutes = require("./routes/instrument");
const skillRoutes = require("./routes/skill");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Backend UKM Musik API" });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/instruments", instrumentRoutes);
app.use("/skills", skillRoutes);

const PORT = process.env.PORT || 8000;
checkDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
});
