const { outToken } = require("./utils/getToken.js");

function logOut(req, res, next) {
  if (req.headers.cookie) {
    const myTokenName = req.headers.cookie.split("myTokenName=")[1];
    if (!myTokenName) {
      return res.status(400).json("no Token provider");
    } else {
      try {
        res.setHeader("Set-Cookie", outToken(myTokenName));
        res.status(200); //json("Logout Succesfully");
      } catch (error) {
        return res.status(401); //.json("Invalid Token");
      }
    }
  }

  next();
}

module.exports = { logOut };
