const fs = require("fs");

async function readerDatabase() {
  const json_users = fs.readFileSync("src/users.json", "utf-8");
  let users = await JSON.parse(json_users);
  return users;
}
async function writerDatabase(database) {
  fs.writeFileSync("src/users.json", JSON.stringify(database), "utf-8");
}
async function getUserActive(userId) {
  let users = await readerDatabase();
  return users.find((e) => e.id === userId);
}

module.exports = { getUserActive, writerDatabase, readerDatabase};
