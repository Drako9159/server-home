const { Router } = require("express");
const router = Router();
const FilesController = require("../controllers/files.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");
const MulterUpload = require("../controllers/utils/multer.js");

router.get("/files", verifyToken, FilesController.appRenderFiles);

router.get("/files/new-file", verifyToken, FilesController.appRenderFormFiles);

router.post(
  "/files/new-file",
  verifyToken,
  MulterUpload.fileMulter.single("files"),
  FilesController.uploadFile
);

router.get("/files/delete/:id", verifyToken, FilesController.deleteFile);

router.get("/files/download/:id", verifyToken, FilesController.downloadFile);

router.get("/files/edit/:id", verifyToken, FilesController.editFile);

router.post("/files/edit/edit-file", verifyToken, FilesController.reloadFile);

module.exports = router;
