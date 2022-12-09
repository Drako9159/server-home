const fs = require("fs");
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
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

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
      let haveUser = validationUp(user, email);
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
      let haveUser = validationIn(user);
      if (!haveUser) {
        let toast = alertToast("red", "El usuario no existe");
        res.status(400).render("AppSignin.ejs", { toast });
      } else {
        console.log(haveUser)
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

  static async getDashboard(req, res) {
    const userCheck = await users.find((e) => e.id === req.userId);
    if (userCheck) {
      const userName = userCheck.user;
      const nav = {
        profile: {
          id: userCheck.id,
          user: userCheck.user,
          email: userCheck.email,
          createdAt: userCheck.createdAt,
        },
        movies: userCheck.moviesPrivate,
        files: userCheck.filesPrivate,
      };
      res.render("dashboard.ejs", { nav });
    }
  }
  static async editUser(req, res) {
    const userCheck = await users.find((e) => e.id === req.userId);
    if (userCheck) {
      const user = {
        id: userCheck.id,
        user: userCheck.user,
        email: userCheck.email,
      };
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        dashboard: "/dashboard",
        user: "Login",
        alert: "Contraseña incorrecta",
        color: "red",
      };
      res.render("edit-user.ejs", { user, nav });
    }
  }
  static async reloadUser(req, res) {
    const userCheck = await users.find((e) => e.id === req.userId);

    const { user, email, password, id } = req.body;
    if (!user || !email || !password) {
      const user = {
        id: userCheck.id,
        user: userCheck.user,
        email: userCheck.email,
      };
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        user: "Login",
        alert: "Datos insuficientes",
        color: "red",
        dashboard: "/dashboard",
      };
      res.status(400).render("edit-user.ejs", { nav, user });
    } else {
      let counterUsername = 0;
      let counterEmail = 0;
      /*
      const findUser = await users.find((e) => e.user === user);
      const findEmail = await users.find((e) => e.email === email);*/

      const checkUser = users.forEach((e) => {
        if (e.user === user) {
          counterUsername++;
        }
      });

      const checkEmail = users.forEach((e) => {
        if (e.email === email) {
          counterEmail++;
        }
      });

      console.log(counterEmail);
      console.log(counterUsername);

      if (counterUsername > 0) {
        const user = {
          id: userCheck.id,
          user: userCheck.user,
          email: userCheck.email,
        };
        const nav = {
          add: "Inicia Sesion",
          link: "/signin",
          user: "Login",
          alert: "El usuario ya está registrado",
          color: "red",
          dashboard: "/dashboard",
        };
        res.status(400).render("edit-user.ejs", { nav, user });
      } else if (counterEmail > 0) {
        const user = {
          id: userCheck.id,
          user: userCheck.user,
          email: userCheck.email,
        };
        const nav = {
          add: "Inicia Sesion",
          link: "/signin",
          user: "Login",
          alert: "El email ya está registrado",
          color: "red",
          dashboard: "/dashboard",
        };
        res.status(400).render("edit-user.ejs", { nav, user });
      } else {
        let salt = await getSaltPassword(10);
        userCheck.id = id;
        userCheck.user = user;
        userCheck.email = email;
        userCheck.salt = salt;
        userCheck.hash = await getHashPassword(password, salt);

        fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
        res.setHeader(
          "Set-Cookie",
          getToken(userCheck.id, userCheck.user, userCheck.email)
        );
        res.redirect("/movies");
      }
    }
  }
  static publicItems(req, res) {
    let checkMovies = [];
    const filter = users.map((e) => e.moviesPrivate);
    for (let item in filter) {
      for (let subItem in filter[item]) {
        checkMovies.push(filter[item][subItem]);
      }
    }

    const movies = checkMovies.filter((e) => e.share === true);

    const nav = {
      add: "Inicia Sesión",
      link: "/signin",
      dashboard: "/",
      user: "Public",
    };

    res.render("public-movies.ejs", { movies, nav });
  }
  static async playMovie(req, res) {
    let checkMovies = [];
    const filter = users.map((e) => e.moviesPrivate);
    for (let item in filter) {
      for (let subItem in filter[item]) {
        checkMovies.push(filter[item][subItem]);
      }
    }
    const sendMovPlay = checkMovies.find((e) => e.id === req.params.id);

    res.render("public-play-mov.ejs", { sendMovPlay });
  }
  static downloadMovie(req, res) {
    let checkMovies = [];
    const filter = users.map((e) => e.moviesPrivate);
    for (let item in filter) {
      for (let subItem in filter[item]) {
        checkMovies.push(filter[item][subItem]);
      }
    }
    const sendMovie = checkMovies.find((e) => e.id === req.params.id);
    console.log(sendMovie);
    const path = `src/public/uploads/movies/${sendMovie.video}`;
    const head = {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename=${sendMovie.video}`,
      //"Content-Length": sendMovie.size,
      //TODO size is deprecated in my browser
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}

module.exports = LoginController;
