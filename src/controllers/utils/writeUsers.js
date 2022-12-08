const fs = require("fs");
fs.readFileSync("src/users.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function writeFile(user, file) {
  let files = users.find((e) => e.id === user);
  files.filesPrivate.push(file)
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
}
module.exports = { writeFile };
