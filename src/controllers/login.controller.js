
const { v4: uuidv4 } = require("uuid");
const {
  getSaltPassword,
  getHashPassword,
  decryptPassword,
} = require("./utils/hashPassword.js");
const { getToken } = require("./utils/getToken.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { alertToast } = require("./utils/getToast.js");
const {
  postUser,
  validationUp,
  validationIn,
} = require("./utils/writeUsers.js");

class LoginController {
  static appRenderSignup(req, res, next) {
    res.render("AppSignUp.ejs", { toast: "" });
  }
  static appRenderSignin(req, res) {
    res.render("AppSignin.ejs", { toast: "" });
  }

  static async appCreateUser(req, res) {
    const { user, email, password } = req.body;
    if (!user || !email || !password) {
      let toast = alertToast("red", "Datos insuficientes");
      res.status(400).render("AppSignUp.ejs", { toast });
    } else {
      let haveUser = await validationUp(user, email);
      if (haveUser === "haveUser") {
        let toast = alertToast("red", "El usuario ya está registrado");
        res.status(400).render("AppSignUp.ejs", { toast });
      } else if (haveUser === "haveEmail") {
        let toast = alertToast("red", "El email ya está registrado");
        res.status(400).render("AppSignUp.ejs", { toast });
      } else if (haveUser === "ok") {
        postUser(res, {
          id: uuidv4(),
          user: user,
          email: email,
          salt: await getSaltPassword(10),
          hash: await getHashPassword(password, await getSaltPassword(10)),
          createdAt: getDateFormat(),
          moviesPrivate: [],
          filesPrivate: [],
        });
      }
    }
  }
  
  

  static async appSigninUser(req, res) {
    const { user, password } = req.body;
    if (!user || !password) {
      let toast = alertToast("red", "Datos insuficientes");
      res.status(400).render("AppSignin.ejs", { toast });
    } else {
      let haveUser = await validationIn(user);
      if (!haveUser) {
        let toast = alertToast("red", "El usuario no existe");
        res.status(400).render("AppSignin.ejs", { toast });
      } else {
        if (await decryptPassword(password, haveUser.hash)) {
          res.setHeader(
            "Set-Cookie",
            getToken(haveUser.id, haveUser.user, haveUser.email)
          );
          res.redirect("/files");
        } else {
          let toast = alertToast("red", "Contraseña incorrecta");
          res.status(400).render("AppSignin.ejs", { toast });
        }
      }
    }
  }

  
 
  
}

module.exports = LoginController;
