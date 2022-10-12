const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { serialize } = require("cookie");
const { v4: uuidv4 } = require("uuid");

const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function renderSignup(req, res, next) {
  const nav = {
    add: "Inicia Sesión",
    link: "/signup",
  };
  res.render("signup.ejs", { nav });
}
function renderSignin(req, res) {
  const nav = {
    add: "Inicia Sesion",
    link: "/signup",
  };
  res.render("signin.ejs", { nav });
}
async function createUser(req, res) {
  const { user, email, password } = req.body;
  if (!user || !email || !password) {
    res.status(400).send("Error al registrar nuevo usuario");
  } else {
    let newUser = {
      id: uuidv4(),
      user: user,
      email: email,
      password: await bcrypt.hash(password, 2),
    };
    users.push(newUser);
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    const token = jwt.sign({ id: newUser.id }, "secret", {
      expiresIn: 60 * 60 * 24,
    });
    const serialized = serialize("myTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    res.setHeader("Set-Cookie", serialized);
    /*
    async function littel(pass, hash) {
      const lol = await bcrypt.compare(pass, hash);
      console.log(lol);
    }
    littel("chocheman", newUser.password);*/
    //res.json({ token: token, newUser });
    res.redirect("/movies");
  }
}
function signinUser(req, res) {
  const { user, password } = req.body;
  console.log(user, password);
  //  users.find((e) => {});
}

module.exports = {
  renderSignup,
  renderSignin,
  createUser,
  signinUser,
};
