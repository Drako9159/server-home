const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  getSaltPassword,
  getHashPassword,
  decryptPassword,
} = require("./utils/hashPassword.js");
const { getToken } = require("./utils/getToken.js");
const { getDateFormat } = require("./utils/getDateFormat");
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
    const nav = {
      add: "Inicia Sesion",
      link: "/signin",
      user: "Login",
      alert: "Datos insuficientes",
      color: "red"
    };
    res.status(400).render("signup.ejs", { nav });
  } else {
    const findUser = await users.find((e) => e.user === user);
    const findEmail = await users.find((e) => e.email === email);
    if (findUser) {
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        user: "Login",
        alert: "El usuario ya está registrado",
        color: "red"
      };
      res.status(400).render("signup.ejs", { nav })
      
    } else if (findEmail) {
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        user: "Login",
        alert: "El email ya está registrado",
        color: "red"
      };
      res.status(400).render("signup.ejs", { nav});
    } else {
      let salt = await getSaltPassword(10);
      let newUser = {
        id: uuidv4(),
        user: user,
        email: email,
        salt: salt,
        hash: await getHashPassword(password, salt),
        createdAt: getDateFormat(),
        moviesPrivate: [],
        filesPrivate: [],
      };
      users.push(newUser);
      fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
      res.setHeader("Set-Cookie", getToken(newUser.id));
      res.redirect("/movies");
    
     
    }
  }
}
async function signinUser(req, res) {
  const { user, password } = req.body;
  if (!user || !password) {
    const nav = {
      add: "Inicia Sesion",
      link: "/signin",
      user: "Login",
      alert: "Datos insuficientes",
      color: "red"
    };
    res.status(400).render("signin.ejs", { nav });
  } else {
    const checkUser = await users.find((e) => e.user === user);
    if (!checkUser) {
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        user: "Login",
        alert: "El usuario no existe",
        color: "red"
      };
      res.status(400).render("signin.ejs", { nav });
    } else {
      if (await decryptPassword(password, checkUser.hash)) {
        res.setHeader("Set-Cookie", getToken(checkUser.id));
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
