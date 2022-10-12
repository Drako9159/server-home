const { verify } = require("jsonwebtoken");
const { serialize } = require("cookie");

function logOut(req, res, next) {
  if (req.headers.cookie) {
    const myTokenName = req.headers.cookie.split("myTokenName=")[1];
    if (!myTokenName) {
      return res.status(400).json("no Token provider");
    } else {
      try {
        verify(myTokenName, "secret");
        const serialized = serialize("myTokenName", null, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        });
        res.setHeader("Set-Cookie", serialized);
        res.status(200); //json("Logout Succesfully");
      } catch (error) {
        return res.status(401); //.json("Invalid Token");
      }
    }
  }

  next();
}

module.exports = { logOut };
