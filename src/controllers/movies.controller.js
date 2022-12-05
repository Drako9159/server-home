const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");
const { getUserActive } = require("./utils/getUserActive.js");

class MoviesController {
  static appRenderMovies(req, res) {
    const { user, moviesPrivate } = getUserActive(req);
    const nav = {
      add: "Añadir Película",
      link: "/movies/new-movie",
      dashboard: "/dashboard",
    };
    res.render("AppMovies.ejs", { nav, user, moviesPrivate });
    
  }

  static appRender(req, res) {
    res.render("App.ejs");
  }
  /*
  static render(req, res) {
    //const userCheck = await users.find((e) => e.id === req.userId);
    const userCheck = getUserActive(req);
    if (userCheck) {
      const userName = userCheck.user;
      const movies = userCheck.moviesPrivate;
      const nav = {
        add: "Añadir Película",
        link: "/movies/new-movie",
        dashboard: "/dashboard",
        user: userName,
      };
      res.render("movies.ejs", { movies, nav });
    }
  }*/
  static async renderForm(req, res) {
    const userCheck = getUserActive(req);
    if (userCheck) {
      const userName = userCheck.user;
      const nav = {
        add: "Añadir Película",
        link: "/movies/new-movie",
        user: userName,
        dashboard: "/dashboard",
      };
      res.render("new-movie.ejs", { nav });
    }
  }
  static async playMovie(req, res) {
    const userCheck = getUserActive(req);
    if (userCheck) {
      const movies = userCheck.moviesPrivate;
      const sendMovPlay = movies.find((e) => e.id === req.params.id);
      res.render("play-mov.ejs", { sendMovPlay });
    }
  }
  static async uploadMovie(req, res) {
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
      if (req.files.image) {
        let pathImage = `src/public/uploads/movies/${req.files.image[0].filename}`;
        eraseFiles(pathImage);
      } else if (req.files.video) {
        let pathVideo = `src/public/uploads/movies/${req.files.video[0].filename}`;
        eraseFiles(pathVideo);
      } else if (req.files.banner) {
        let pathBanner = `src/public/uploads/movies/${req.files.banner[0].filename}`;
        eraseFiles(pathBanner);
      }
      return;
    }
    const nameImg = req.files.image[0].filename;
    const nameVideo = req.files.video[0].filename;
    const nameBanner = req.files.banner[0].filename;
    const sizeVideo = req.files.video[0].size;
    function evaluateSize() {
      let sizerMath = Math.floor(sizeVideo / 1000);
      if (sizerMath > 1024) {
        return (sizerMath = `${sizerMath / 1000} MB`);
      } else {
        return (sizerMath = `${sizerMath} KB`);
      }
    }
    let newMovie = {
      id: uuidv4(),
      title: title.replace(/"/g, " "),
      sinopsis: sinopsis.replace(/"/g, " "),
      year: year,
      image: nameImg,
      video: nameVideo,
      banner: nameBanner,
      genero: genero.replace(/"/g, " "),
      size: evaluateSize(),
      createdAt: getDateFormat(),
      share: false,
    };
    const userCheck = getUserActive(req, users);
    if (userCheck) {
      let moviesUser = userCheck.moviesPrivate;
      moviesUser.push(newMovie);
      fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
      res.redirect("/movies");
    }
  }
  static async downloadMovie(req, res) {
    const userCheck = getUserActive(req);
    if (userCheck) {
      const movies = userCheck.moviesPrivate;
      const sendMovie = movies.find((e) => e.id === req.params.id);
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

  static async deleteMovie(req, res) {
    const userCheck = getUserActive(req);
    if (userCheck) {
      const movies = userCheck.moviesPrivate;
      const sendMovie = movies.find((e) => e.id === req.params.id);
      const userMovies = movies.filter((e) => e.id !== req.params.id);

      function dropImage(img) {
        if (img) {
          let path = `src/public/uploads/movies/${img.image}`;
          eraseFiles(path);
        }
      }
      function dropVideo(video) {
        if (video) {
          let path = `src/public/uploads/movies/${video.video}`;
          eraseFiles(path);
        }
      }
      function dropBanner(video) {
        if (video) {
          let path = `src/public/uploads/movies/${video.banner}`;
          eraseFiles(path);
        }
      }
      dropImage(sendMovie);
      dropVideo(sendMovie);
      dropBanner(sendMovie);
      userCheck.moviesPrivate = userMovies;
      fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
      res.redirect("/dashboard");
    }
  }

  static async editMovie(req, res) {
    const userCheck = getUserActive(req);
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
    const userCheck = getUserActive(req);
    const detectMovie = userCheck.moviesPrivate.find((e) => e.id === id);
    detectMovie.title = title;
    detectMovie.sinopsis = sinopsis;
    detectMovie.year = year;
    detectMovie.genero = genero;
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/movies");
  }
  static async shareMovie(req, res) {
    const userCheck = getUserActive(req);
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
