const fs = require("fs");
fs.readFileSync("src/users.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function redirectTo(res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      res.redirect("/files");
    }, 1500);
  });
}

async function writeFile(res, user, file) {
  let files = users.find((e) => e.id === user);
  files.filesPrivate.push(file);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  if (files.filesPrivate.find((e) => e.filename === file.filename)) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    const enviar = await redirectTo(res);
  }
}
module.exports = { writeFile };
