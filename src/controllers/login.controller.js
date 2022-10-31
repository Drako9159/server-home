const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  getSaltPassword,
  getHashPassword,
  decryptPassword,
} = require("./utils/hashPassword.js");
const { getToken } = require("./utils/getToken.js");
const { getDateFormat } = require("./utils/getDateFormat");
const { emitWarning } = require("process");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);

function renderSignup(req, res, next) {
  const nav = {
    add: "Inicia Sesión",
    link: "/signin",
    user: "Login",
    dashboard: "/signin",
  };
  res.render("signup.ejs", { nav });
}
function renderSignin(req, res) {
  const nav = {
    add: "Inicia Sesion",
    link: "/signin",
    user: "Login",
    dashboard: "/signin",
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
      color: "red",
      dashboard: "/signup",
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
        color: "red",
        dashboard: "/signup",
      };
      res.status(400).render("signup.ejs", { nav });
    } else if (findEmail) {
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        user: "Login",
        alert: "El email ya está registrado",
        color: "red",
      };
      res.status(400).render("signup.ejs", { nav });
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
      res.setHeader(
        "Set-Cookie",
        getToken(newUser.id, newUser.user, newUser.email)
      );
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
      color: "red",
      dashboard: "/signin",
    };
    res.status(400).render("signin.ejs", { nav });
  } else {
    const checkUser = await users.find((e) => e.user === user);
    if (!checkUser) {
      const nav = {
        add: "Inicia Sesion",
        link: "/signin",
        dashboard: "/signin",
        user: "Login",
        alert: "El usuario no existe",
        color: "red",
      };
      res.status(400).render("signin.ejs", { nav });
    } else {
      if (await decryptPassword(password, checkUser.hash)) {
        res.setHeader(
          "Set-Cookie",
          getToken(checkUser.id, checkUser.user, checkUser.email)
        );
        res.redirect("/movies");
      } else {
        const nav = {
          add: "Inicia Sesion",
          link: "/signin",
          user: "Login",
          dashboard: "/signup",
          alert: "Contraseña incorrecta",
          color: "red",
        };
        res.status(400).render("signin.ejs", { nav });
      }
    }
  }
}
async function getDashboard(req, res) {
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
async function editUser(req, res) {
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
async function reloadUser(req, res) {
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
function publicItems(req, res) {
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
async function playMovie(req, res) {
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

function downloadMovie(req, res) {
  let checkMovies = [];
  const filter = users.map((e) => e.moviesPrivate);
  for (let item in filter) {
    for (let subItem in filter[item]) {
      checkMovies.push(filter[item][subItem]);
    }
  }
  const sendMovie = checkMovies.find((e) => e.id === req.params.id);
  console.log(sendMovie)
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

module.exports = {
  renderSignup,
  renderSignin,
  createUser,
  signinUser,
  getDashboard,
  editUser,
  reloadUser,
  publicItems,
  playMovie,
  downloadMovie,
};
