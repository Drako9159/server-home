const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { v4: uuidv4 } = require("uuid");
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");
const { getSize } = require("./utils/getSize.js");
const { writeFile } = require("./utils/writeUsers.js");

class FilesController {
  static appRenderFiles(req, res) {
    let { user, filesPrivate } = getUserActive(req.userId);
    res.render("AppFiles.ejs", { user, filesPrivate });
  }
  static appRenderFormFiles(req, res) {
    let { user } = getUserActive(req.userId);
    res.render("AppFormNewFile.ejs", { user });
  }
  static uploadFile(req, res) {
    const { title } = req.body;
    if (!title || !req.file) {
      res.status(400).send("No ingresaste todos los valores");
      eraseFiles(`src/public/uploads/files/${req.file.filename}`);
      return;
    } else {
      const { mimetype, filename, size, destination, path } = req.file;
      writeFile(res, req.userId, {
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

  static async deleteFile(req, res) {
    const userCheck = users.find((e) => e.id === req.userId);
    if (userCheck) {
      const files = userCheck.filesPrivate;
      const deleteFile = files.find((e) => e.id === req.params.id);
      const userFiles = files.filter((e) => e.id !== req.params.id);
      function deleteDroper(drop) {
        if (drop) {
          let path = `src/public/uploads/files/${drop.namepath}`;
          eraseFiles(path);
        }
      }
      deleteDroper(deleteFile);
      userCheck.filesPrivate = userFiles;
      fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
      res.redirect("/dashboard");
    }
  }
  static async downloadFile(req, res) {
    const userCheck = getUserActive(req);
    if (userCheck) {
      const files = userCheck.filesPrivate;
      const fileDownload = files.find((e) => e.id === req.params.id);
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
  }
  static async reloadFile(req, res) {
    const { title, id } = req.body;
    if (!title) {
      res.status(400).send("No ingresaste todos los datos requeridos");
    }
    const userCheck = users.find((e) => e.id === req.userId);
    const detectFile = userCheck.filesPrivate.find((e) => e.id === id);
    detectFile.title = title;
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/movies");
  }
  static async editFile(req, res) {
    const userCheck = getUserActive(req.userId);
    const detectFile = userCheck.filesPrivate.find(
      (e) => e.id === req.params.id
    );
    if (userCheck) {
      const userName = userCheck.user;
      const nav = {
        add: "Añadir Película",
        link: "/movies/new-movie",
        user: userName,
        dashboard: "/dashboard",
      };
      const file = {
        id: detectFile.id,
        title: detectFile.title,
      };
      res.render("edit-file.ejs", { nav, file });
    }
  }
}

module.exports = FilesController;
