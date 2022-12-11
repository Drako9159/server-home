const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");
const { getSize } = require("./utils/getSize.js");
const {
  postFile,
  deleteFile,
  updateFile,
  shareFile,
} = require("./utils/writeUsers.js");

class FilesController {
  static async appRenderFiles(req, res) {
    try {
      let { user, filesPrivate } = await getUserActive(req.userId);
      res.render("AppFiles.ejs", { user, filesPrivate });
    } catch (e) {
      console.log(e);
      res.redirect("/signin");
    }
  }
  static async appRenderFormFiles(req, res) {
    try {
      let { user } = await getUserActive(req.userId);
      res.render("AppFormNewFile.ejs", { user });
    } catch (e) {
      res.redirect("/signin");
    }
  }
  static appUploadFile(req, res) {
    const { title } = req.body;
    if (!title || !req.file) {
      res.status(400).send("No ingresaste todos los valores");
      if (req.file.filename) {
        eraseFiles(`src/public/uploads/files/${req.file.filename}`);
      }
      return;
    } else {
      const { mimetype, filename, size, destination, path } = req.file;
      postFile(res, req.userId, {
        id: uuidv4(),
        title: title,
        tipo: mimetype,
        namepath: filename,
        size: getSize(size),
        createdAt: getDateFormat(),
        share: false,
        destination: destination,
        path: path,
      });
    }
  }

  static appDeleteFile(req, res) {
    deleteFile(res, req.userId, req.params.id);
  }

  static appUpdateFile(req, res) {
    const { title, id } = req.body;
    if (!title) {
      res.status(400).send("No ingresaste todos los datos requeridos");
    } else {
      updateFile(res, req.userId, title, id);
    }
  }

  static async appRenderEditFile(req, res) {
    try {
      let { user, filesPrivate } = await getUserActive(req.userId);
      const detectFile = filesPrivate.find((e) => e.id === req.params.id);
      const file = {
        id: detectFile.id,
        title: detectFile.title,
      };
      res.render("AppFormEditFile.ejs", { file, user });
    } catch (e) {
      res.redirect("/signin");
    }
  }

  static async appDownloadFile(req, res) {
    //const userCheck =  users.find((e) => e.id === req.userId);
    let { filesPrivate } = await getUserActive(req.userId);
    const fileDownload = filesPrivate.find((e) => e.id === req.params.id);
    const path = `src/public/uploads/files/${fileDownload.namepath}`;
    const head = {
      "Content-Type": `${fileDownload.tipo}`,
      "Content-Disposition": `attachment; filename=${fileDownload.namepath}`,
      //"Content-Length": fileDownload.size,
      //TODO size is deprecated in my browser
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
  static async appShareFile(req, res) {
    shareFile(res, req.userId, req.params.id);
  }
}

module.exports = FilesController;
