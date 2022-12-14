const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");

function getToken(id, user, email) {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      id: id,
      email: email,
      username: user,
    },
    "secret" /*{
    expiresIn: 60 * 60 * 24,
  }*/
  );
  const serialized = serialize("myTokenName", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return serialized;
}

function outToken(myTokenName) {
  //jwt.verify(myTokenName, "secret");
  const serialized = serialize("myTokenName", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return serialized;
}

function aproveToken(token) {
  const decoded = jwt.verify(token, "secret");
  return decoded.id;
}

module.exports = {
  getToken,
  outToken,
};
