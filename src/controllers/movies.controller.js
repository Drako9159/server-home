const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("./utils/readerJson.js");
const { getDateFormat } = require("./utils/getDateFormat.js");

async function render(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const userName = userCheck.user;
    const movies = userCheck.moviesPrivate;
    const nav = {
      add: "Añadir Película",
      link: "/movies/new-movie",
      user: userName,
    };
    res.render("movies.ejs", { movies, nav });
  }
}
async function renderForm(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const userName = userCheck.user;
    const nav = {
      add: "Añadir Película",
      link: "/movies/new-movie",
      user: userName,
    };
    res.render("new-movie.ejs", { nav });
  }
}

async function playMovie(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const movies = userCheck.moviesPrivate;
    const sendMovPlay = movies.find((e) => e.id === req.params.id);
    res.render("play-mov.ejs", { sendMovPlay });
  }
}
async function uploadMovie(req, res) {
  const { title, sinopsis, year, genero } = req.body;
  if (
    !title ||
    !sinopsis ||
    !year ||
    !genero ||
    !req.files.image ||
    !req.files.video
  ) {
    res.status(400).send("No ingresaste todos los datos requeridos");
    if (req.files.image) {
      let pathImage = `src/public/uploads/movies/${req.files.image[0].filename}`;
      eraseFiles(pathImage);
    } else if (req.files.video) {
      let pathVideo = `src/public/uploads/movies/${req.files.video[0].filename}`;
      eraseFiles(pathVideo);
    }
    return;
  }
  const nameImg = req.files.image[0].filename;
  const nameVideo = req.files.video[0].filename;
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
    title: title,
    sinopsis: sinopsis,
    year: year,
    image: nameImg,
    video: nameVideo,
    genero: genero,
    size: evaluateSize(),
    createdAt: getDateFormat(),
  };
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    let moviesUser = userCheck.moviesPrivate;
    moviesUser.push(newMovie);
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/movies");
  } /*
  movies.push(newMovie);
  fs.writeFileSync("src/movies.json", JSON.stringify(movies), "utf-8");
  res.redirect("/movies");*/
}
async function downloadMovie(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const movies = userCheck.moviesPrivate;
    const sendMovie = movies.find((e) => e.id === req.params.id);
    const path = `src/public/uploads/movies/${sendMovie.video}`;
    const head = {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename=${sendMovie.video}`,
      "Content-Length": sendMovie.size,
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}
async function deleteMovie(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const movies = userCheck.moviesPrivate;
    const sendMovie = movies.find((e) => e.id === req.params.id);
    const userMovies = movies.filter((e) => e.id !== req.params.id);

    function dropImage(img) {
      let path = `src/public/uploads/movies/${img.image}`;
      eraseFiles(path);
    }
    function dropVideo(video) {
      let path = `src/public/uploads/movies/${video.video}`;
      eraseFiles(path);
    }
    dropImage(sendMovie);
    dropVideo(sendMovie);
    userCheck.moviesPrivate = userMovies;
    fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
    res.redirect("/dashboard");
  }
}
async function editMovie(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  const detectMovie = userCheck.moviesPrivate.find(
    (e) => e.id === req.params.id
  );

  if (userCheck) {
    const userName = userCheck.user;
    const nav = {
      add: "Añadir Película",
      link: "/movies/new-movie",
      user: userName,
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

async function reloadMovie(req, res) {
  const { title, sinopsis, year, genero, id } = req.body;
  if (!title || !sinopsis || !year || !genero) {
    res.status(400).send("No ingresaste todos los datos requeridos");
  }
  const userCheck = await users.find((e) => e.id === req.userId);
  const detectMovie = userCheck.moviesPrivate.find((e) => e.id === id);
  detectMovie.title = title;
  detectMovie.sinopsis = sinopsis;
  detectMovie.year = year;
  detectMovie.genero = genero;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/movies");
}

module.exports = {
  render,
  renderForm,
  playMovie,
  uploadMovie,
  downloadMovie,
  deleteMovie,

  editMovie,
  reloadMovie,
};
