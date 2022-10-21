const { Router } = require("express");
const multer = require("multer");
const router = Router();
const {
  render,
  renderForm,
  uploadFile,
  deleteFile,
  downloadFile,
  editFile,
  reloadFile,
} = require("../controllers/files.controller");

const { verifyToken } = require("../controllers/utils/verifyToken.js");
/*
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
*/
const MulterUpload = require("../controllers/utils/multer.js");

router.get("/files", verifyToken, render);

router.get("/files/new-file", verifyToken, renderForm);

router.post("/files/new-file", verifyToken, MulterUpload.fileMulter.single("files"), uploadFile);

router.get("/files/delete/:id", verifyToken, deleteFile);

router.get("/files/download/:id", verifyToken, downloadFile);

router.get("/files/edit/:id", verifyToken, editFile);

router.post("/files/edit/edit-file", verifyToken, reloadFile);

module.exports = router;
