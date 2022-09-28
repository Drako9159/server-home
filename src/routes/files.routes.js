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

router.get("/files", render);

router.get("/files/new-file", renderForm);

router.post("/files/new-file", fileMulter.single("files"), uploadFile);

router.get("/files/delete/:id", deleteFile);

router.get("/files/download/:id", downloadFile);

module.exports = router;
