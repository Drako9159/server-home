const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");
const { getSize } = require("./utils/getSize.js");
const { postFile, deleteFile, updateFile } = require("./utils/writeUsers.js");

class FilesController {
  static appRenderFiles(req, res) {
    let { user, filesPrivate } = getUserActive(req.userId);
    res.render("AppFiles.ejs", { user, filesPrivate });
  }
  static appRenderFormFiles(req, res) {
    let { user } = getUserActive(req.userId);
    res.render("AppFormNewFile.ejs", { user });
  }
  static appUploadFile(req, res) {
    const { title } = req.body;
    if (!title || !req.file) {
      res.status(400).send("No ingresaste todos los valores");
      eraseFiles(`src/public/uploads/files/${req.file.filename}`);
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

  static downloadFile(req, res) {
    //const userCheck =  users.find((e) => e.id === req.userId);
    let { filesPrivate } = getUserActive(req.userId);
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

  static appUpdateFile(req, res) {
    const { title, id } = req.body;
    if (!title) {
      res.status(400).send("No ingresaste todos los datos requeridos");
    } else {
      updateFile(res, req.userId, title, id);
    }
  }

  static appRenderEditFile(req, res) {
    let { user, filesPrivate } = getUserActive(req.userId);
    const detectFile = filesPrivate.find((e) => e.id === req.params.id);
    const file = {
      id: detectFile.id,
      title: detectFile.title,
    };
    res.render("AppFormEditFile.ejs", { file, user });
  }
}

module.exports = FilesController;
