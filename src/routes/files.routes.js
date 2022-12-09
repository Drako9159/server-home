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
  FilesController.appUploadFile
);

router.get("/files/delete/:id", verifyToken, FilesController.appDeleteFile);

router.get("/files/download/:id", verifyToken, FilesController.appDownloadFile);

router.get("/files/edit/:id", verifyToken, FilesController.appRenderEditFile);

router.post("/files/edit/edit-file", verifyToken, FilesController.appUpdateFile);

module.exports = router;
