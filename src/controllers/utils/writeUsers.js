const fs = require("fs");
fs.readFileSync("src/users.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("../utils/readerJson.js");
const { getToken } = require("../utils/getToken.js");
const { alertToast } = require("../utils/getToast");

function postFile(res, user, file) {
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

function postUser(res, user) {
  users.push(user);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.setHeader("Set-Cookie", getToken(user.id, user.user, user.email));
  res.redirect("/files");
}

function validationUp(user, email) {
  let checkUser = users.find((e) => e.user === user);
  let checkEmail = users.find((e) => e.email === email);
  if (checkUser) {
    return "haveUser";
  } else if (checkEmail) {
    return "haveEmail";
  } else {
    return "ok";
  }
}

function validationIn(user) {
  let checkUser = users.find((e) => e.user === user);
  if (checkUser) {
    return checkUser;
  }
}

module.exports = {
  postFile,
  deleteFile,
  updateFile,
  postUser,
  validationUp,
  validationIn,
};
