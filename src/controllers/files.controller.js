const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { v4: uuidv4 } = require("uuid");
//const { userActive } = require("./utils/userActive.js");
const { eraseFiles } = require("./utils/readerJson.js");

function render(req, res) {
  const userCheck = users.find((e) => e.id === req.userId);
  if (userCheck) {
    const userName = userCheck.user;
    const files = userCheck.filesPrivate;
    const nav = {
      add: "Añadir Archivo",
      link: "/files/new-file",
      user: userName,
    };
    res.render("files.ejs", { files, nav });
  }
}
async function renderForm(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  const userName = userCheck.user;
  const nav = {
    add: "Añadir Archivo",
    link: "/files/new-file",
    user: userName,
  };
  res.render("new-file.ejs", { nav });
}

function uploadFile(req, res) {
  const { title } = req.body;
  if (!title || !req.file) {
    res.status(400).send("No ingresaste todos los datos requeridos");
    if (req.files.drop) {
      let path = `src/public/uploads/files/${req.file.drop[0].filename}`;
      eraseFiles(path);
    }
    return;
  }
  const { mimetype, filename, size } = req.file;
  function evaluateSize() {
    let sizerMath = Math.floor(size / 1000);
    if (sizerMath > 1024) {
      return (sizerMath = `${sizerMath / 1000} MB`);
    } else {
      return (sizerMath = `${sizerMath} KB`);
    }
  }
  let newFile = {
    id: uuidv4(),
    title: title,
    tipo: mimetype,
    namepath: filename,
    size: evaluateSize(),
  };
  const userCheck = users.find((e) => e.id === req.userId);
  //const userCheck = userActive(req);
  if (userCheck) {
    let filesUser = userCheck.filesPrivate;
    filesUser.push(newFile);

    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.redirect("/files");
  }
}

async function deleteFile(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const files = userCheck.filesPrivate;
    const deleteFile = files.find((e) => e.id === req.params.id);
    const userFiles = files.filter((e) => e.id !== req.params.id);
    function deleteDroper(drop) {
      let path = `src/public/uploads/files/${drop.namepath}`;
      eraseFiles(path);
    }
    deleteDroper(deleteFile);
    userCheck.filesPrivate = userFiles;
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/files");
  }
}

async function downloadFile(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const files = userCheck.filesPrivate;
    const fileDownload = files.find((e) => e.id === req.params.id);
    const path = `src/public/uploads/files/${fileDownload.namepath}`;
    const head = {
      "Content-Type": `${fileDownload.tipo}`,
      "Content-Disposition": `attachment; filename=${fileDownload.namepath}`,
      "Content-Length": fileDownload.size,
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}

module.exports = {
  render,
  renderForm,
  uploadFile,
  deleteFile,
  downloadFile,
};
