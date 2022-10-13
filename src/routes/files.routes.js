const { Router } = require("express");
const multer = require("multer");
const router = Router();
const {
  render,
  renderForm,
  uploadFile,
  deleteFile,
  downloadFile,
} = require("../controllers/files.controller");
const { verifyToken } = require("../controllers/utils/verifyToken.js");
const storageDrop = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/files");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const fileMulter = multer({ storage: storageDrop });

router.get("/files", verifyToken, render);

router.get("/files/new-file", verifyToken, renderForm);

router.post(
  "/files/new-file",
  verifyToken,
  fileMulter.single("files"),
  uploadFile
);

router.get("/files/delete/:id", verifyToken, deleteFile);

router.get("/files/download/:id", verifyToken, downloadFile);

module.exports = router;
