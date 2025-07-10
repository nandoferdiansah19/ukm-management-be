const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `uploads/${folder}/`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung"), false);
  }
};

const uploadFile = (
  folder = "others",
  allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
  maxSizeMB = 5
) =>
  multer({
    storage: storage(folder),
    fileFilter: fileFilter(allowedTypes),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

module.exports = uploadFile;
