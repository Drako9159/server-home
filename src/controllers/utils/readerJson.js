const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function writeJson() {
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  console.log(users);
}
function eraseFiles(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file removed
  });
}

module.exports = { writeJson, eraseFiles };
