const fs = require("fs");
;
fs.readFileSync("src/users.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("../utils/readerJson.js");

async function postFile(res, user, file) {
  let getUser = users.find((e) => e.id === user);
  getUser.filesPrivate.push(file);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  if (getUser.filesPrivate.find((e) => e.filename === file.filename)) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.redirect("/files");
  }
}

function deleteFile(res, user, file) {
  let getUser = users.find((e) => e.id === user);
  const deleteFile = getUser.filesPrivate.find((e) => e.id === file);
  const userFiles = getUser.filesPrivate.filter((e) => e.id !== file);
  function deleteDroper(drop) {
    if (drop) {
      let path = `src/public/uploads/files/${drop.namepath}`;
      eraseFiles(path);
    }
  }
  deleteDroper(deleteFile);
  getUser.filesPrivate = userFiles;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}

function updateFile(res, user, newTitle, id) {
  let getUser = users.find((e) => e.id === user);
  const detectFile = getUser.filesPrivate.find((e) => e.id === id);
  detectFile.title = newTitle;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}

module.exports = { postFile, deleteFile, updateFile };
