const fs = require("fs");
const json_files = fs.readFileSync("src/files.json", "utf-8");
let files = JSON.parse(json_files);
const { v4: uuidv4 } = require("uuid");

function render(req, res) {
  const nav = {
    add: "Añadir Archivo",
    link: "/files/new-file",
  };
  res.render("files.ejs", { files, nav });
}
function renderForm(req, res) {
  const nav = {
    add: "Añadir Archivo",
    link: "/files/new-file",
  };
  res.render("new-file.ejs", { nav });
}
function uploadFile(req, res) {
  const { title } = req.body;

  if (!title || !req.file) {
    res.status(400).send("No ingresaste todos los datos requeridos");
    if (req.files.drop) {
      fs.unlink(
        `src/public/uploads/files/${req.file.drop[0].filename}`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        }
      );
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
  files.push(newFile);
  fs.writeFileSync("src/files.json", JSON.stringify(files), "utf-8");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.redirect("/files");
}
function deleteFile(req, res) {
  const deleteFile = files.find((e) => e.id === req.params.id);
  files = files.filter((e) => e.id !== req.params.id);
  function deleteDroper(drop) {
    const path = `src/public/uploads/files/${drop.namepath}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }

  deleteDroper(deleteFile);

  fs.writeFileSync("src/files.json", JSON.stringify(files), "utf-8");
  res.redirect("/files");
}
function downloadFile(req, res) {
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
module.exports = {
  render,
  renderForm,
  uploadFile,
  deleteFile,
  downloadFile,
};
