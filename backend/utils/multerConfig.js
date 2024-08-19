const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../data/uploads/profile_pictures"));
  },
  filename: (req, file, cb) => {
    const randomString = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();

    cb(null, randomString + "-" + timestamp + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
});

module.exports = upload;
