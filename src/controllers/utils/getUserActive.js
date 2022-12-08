const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function getUserActive(userId) {
  return users.find((e) => e.id === userId);
}
module.exports = { getUserActive };
