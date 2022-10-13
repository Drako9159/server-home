const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function userActive(req) {
  let user = users.find((e) => e.id === req.userId);
  return user;
}

module.exports = {
  userActive,
};
