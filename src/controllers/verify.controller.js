const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (!req.headers.cookie) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }
  const token = req.headers.cookie.split("myTokenName=")[1];
  /*
  const token = req.headers["x-access-token"]; */
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }
  const decoded = jwt.verify(token, "secret");
  req.userId = decoded.id;

  next();
}
module.exports = {
  verifyToken,
};
