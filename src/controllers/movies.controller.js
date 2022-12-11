const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");
const {
  postMovie,
  deleteMovie,
  updateMovie,
  shareMovie,
} = require("./utils/writeUsers.js");
const { getSize } = require("./utils/getSize.js");

class MoviesController {
  static async appRenderMovies(req, res) {
    try {
      const { user, moviesPrivate } = await getUserActive(req.userId);
      res.render("AppMovies.ejs", { user, moviesPrivate });
    } catch (e) {
      console.log(e);
      res.redirect("/signin");
    }
  }
  static async appRenderFormMovies(req, res) {
    try {
      const { user } = await getUserActive(req.userId);
      res.render("AppFormNewMovie.ejs", { user });
    } catch (e) {
      console.log(e);
      res.redirect("/signin");
    }
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
    deleteMovie(res, req.userId, req.params.id);
  }

  static async appRenderEditMovie(req, res) {
    try {
      let { user, moviesPrivate } = await getUserActive(req.userId);
      const detectMovie = moviesPrivate.find((e) => e.id === req.params.id);
      const movie = {
        id: detectMovie.id,
        title: detectMovie.title,
        sinopsis: detectMovie.sinopsis,
        year: detectMovie.year,
        genero: detectMovie.genero,
      };
      res.render("AppFormEditMovie.ejs", { movie, user });
    } catch (e) {
      console.log(e);
      res.redirect("/signin");
    }
  }

  static async appUpdateMovie(req, res) {
    const { title, sinopsis, year, genero, id } = req.body;
    if (!title || !sinopsis || !year || !genero) {
      res.status(400).send("No ingresaste todos los datos requeridos");
    } else {
      updateMovie(
        res,
        req.userId,
        { title: title, sinopsis: sinopsis, year: year, genero: genero },
        id
      );
    }
  }

  static async appShareMovie(req, res) {
    shareMovie(res, req.userId, req.params.id);
  }
}

module.exports = MoviesController;
