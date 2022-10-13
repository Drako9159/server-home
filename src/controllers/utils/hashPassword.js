const bcrypt = require("bcrypt");
/*
const salt = await bcrypt.genSalt(10)
//genera un salt que tarda 10s
const hash = await bcrypt.hash(password a cifrar, salt)
////
bcrypt.compare(password, hash)
//Para comparar el password y el hash 
*/
async function getSaltPassword(seg) {
  let salt = await bcrypt.genSalt(seg);
  return salt;
}
async function getHashPassword(password, salt) {
  let hash = await bcrypt.hash(password, salt);
  return hash;
}
async function decryptPassword(password, salt) {
  let decrypt = await bcrypt.compare(password, salt);
  return decrypt;
}
module.exports = { getSaltPassword, getHashPassword, decryptPassword };
