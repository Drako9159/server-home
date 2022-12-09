const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");
const { postMovie, deleteMovie,  } = require("./utils/writeUsers.js");
const { getSize } = require("./utils/getSize.js");
class MoviesController {
  static async appRenderMovies(req, res) {
    const { user, moviesPrivate } = await getUserActive(req.userId);
    res.render("AppMovies.ejs", { user, moviesPrivate });
  }
  static async appRenderFormMovies(req, res) {
    const { user } = await getUserActive(req.userId);
    res.render("AppFormNewMovie.ejs", { user });
  }
  static async playMovie(req, res) {
    const userCheck = await getUserActive(req.userId);
    if (userCheck) {
      const movies = userCheck.moviesPrivate;
      const sendMovPlay = movies.find((e) => e.id === req.params.id);
      res.render("play-mov.ejs", { sendMovPlay });
    }
  }
  static async appUploadMovie(req, res) {
    const { title, sinopsis, year, genero } = req.body;
    if (
      !title ||
      !sinopsis ||
      !year ||
      !genero ||
      !req.files.image ||
      !req.files.video ||
      !req.files.banner
    ) {
      res.status(400).send("No ingresaste todos los datos requeridos");
      if (req.files.image[0].filename) {
        eraseFiles(`src/public/uploads/movies/${req.files.image[0].filename}`);
      } else if (req.files.video[0].filename) {
        eraseFiles(`src/public/uploads/movies/${req.files.video[0].filename}`);
      } else if (req.files.banner[0].filename) {
        eraseFiles(`src/public/uploads/movies/${req.files.banner[0].filename}`);
      }
      return;
    }
    postMovie(res, req.userId, {
      id: uuidv4(),
      title: title.replace(/"/g, " "),
      sinopsis: sinopsis.replace(/"/g, " "),
      year: year,
      image: req.files.image[0].filename,
      video: req.files.video[0].filename,
      banner: req.files.banner[0].filename,
      genero: genero.replace(/"/g, " "),
      size: getSize(req.files.video[0].size),
      createdAt: getDateFormat(),
      share: false,
    });
  }

  static async appDownloadMovie(req, res) {
    let { moviesPrivate } = await getUserActive(req.userId);
    const sendMovie = moviesPrivate.find((e) => e.id === req.params.id);
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

  static async appDeleteMovie(req, res) {
    deleteMovie(res, req.userId, req.params.id) 
  }

  static async editMovie(req, res) {
    const userCheck = await getUserActive(req.userId);
    const detectMovie = userCheck.moviesPrivate.find(
      (e) => e.id === req.params.id
    );

    if (userCheck) {
      const userName = userCheck.user;
      const nav = {
        add: "Añadir Película",
        link: "/movies/new-movie",
        user: userName,
        dashboard: "/dashboard",
      };
      const movie = {
        id: detectMovie.id,
        title: detectMovie.title,
        sinopsis: detectMovie.sinopsis,
        year: detectMovie.year,
        genero: detectMovie.genero,
      };
      res.render("edit-movie.ejs", { nav, movie });
    }
  }
  static async reloadMovie(req, res) {
    const { title, sinopsis, year, genero, id } = req.body;
    if (!title || !sinopsis || !year || !genero) {
      res.status(400).send("No ingresaste todos los datos requeridos");
    }
    const userCheck = users.find((e) => e.id === req.userId);
    const detectMovie = userCheck.moviesPrivate.find((e) => e.id === id);
    detectMovie.title = title;
    detectMovie.sinopsis = sinopsis;
    detectMovie.year = year;
    detectMovie.genero = genero;
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/movies");
  }
  static async shareMovie(req, res) {
    const userCheck = await getUserActive(req.userId);
    if (userCheck) {
      const movies = userCheck.moviesPrivate;
      const moviesShare = movies.find((e) => e.id === req.params.id);
      //const moviesShare = movies.filter((e) => e.share === false);
      if (moviesShare.share) {
        moviesShare.share = false;
      } else {
        moviesShare.share = true;
      }
    }
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/dashboard");
  }
}

module.exports = MoviesController;
//Await for implement module in class, nothing use methods
