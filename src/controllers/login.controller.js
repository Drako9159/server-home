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
    link: "/signin",
    user: "Login",
  };
  res.render("signup.ejs", { nav });
}
function renderSignin(req, res) {
  const nav = {
    add: "Inicia Sesion",
    link: "/signin",
    user: "Login",
  };
  res.render("signin.ejs", { nav });
}
async function createUser(req, res) {
  const { user, email, password } = req.body;
  if (!user || !email || !password) {
    res.status(400).send("Los datos no son suficientes");
  } else {
    const findUser = await users.find((e) => e.user === user);
    const findEmail = await users.find((e) => e.email === email);
    if (findUser) {
      res.status(400).send("El usuario ya está registrador");
    } else if (findEmail) {
      res.status(400).send("El email ya está registrador");
    } else {
      let newUser = {
        id: uuidv4(),
        user: user,
        email: email,
        password: await bcrypt.hash(password, 2),
        moviesPrivate: [],
        filesPrivate: [],
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
      res.redirect("/movies");
    }
  }
}
async function signinUser(req, res) {
  const { user, password } = req.body;
  if (!user || !password) {
    res.status(400).send("Los datos no son suficientes");
  } else {
    const checkUser = await users.find((e) => e.user === user);
    if (!checkUser) {
      res.status(400).send("El usuario no existe");
    } else {
      //decrypt
      async function checkPass(pass, hash) {
        const decrypt = await bcrypt.compare(pass, hash);
        return decrypt;
      }
      const passCheck = await checkPass(password, checkUser.password);
      if (passCheck) {
        const token = jwt.sign({ id: checkUser.id }, "secret", {
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
        res.redirect("/movies");
      } else {
        res.json({ messaje: "Error de contraseña" });
      }
    }
  }
}

module.exports = {
  renderSignup,
  renderSignin,
  createUser,
  signinUser,
};
