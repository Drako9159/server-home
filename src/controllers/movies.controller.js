const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const json_movies = fs.readFileSync("src/movies.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let movies = JSON.parse(json_movies);
let users = JSON.parse(json_users);

async function render(req, res) {
  const userCheck = await users.find((e) => e.id === req.userId);
  if (userCheck) {
    const userName = userCheck.user;
    const nav = {
      add: "Añadir Película",
      link: "/movies/new-movie",
      user: await userCheck.user,
    };
    res.render("movies.ejs", { movies, nav });
  }
}
function renderForm(req, res) {
  const nav = {
    add: "Añadir Película",
    link: "/movies/new-movie",
  };
  res.render("new-movie.ejs", { nav });
}
function playMovie(req, res) {
  const sendMovPlay = movies.find((e) => e.id === req.params.id);
  res.render("play-mov.ejs", { sendMovPlay });
}
function uploadMovie(req, res) {
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
      fs.unlink(
        `src/public/uploads/movies/${req.files.image[0].filename}`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        }
      );
    } else if (req.files.video) {
      fs.unlink(
        `src/public/uploads/movies/${req.files.video[0].filename}`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        }
      );
    }
    return;
  }
  const nameImg = req.files.image[0].filename;
  const nameVideo = req.files.video[0].filename;
  const sizeVideo = req.files.video[0].size;
  let newMovie = {
    id: uuidv4(),
    title: title,
    sinopsis: sinopsis,
    year: year,
    image: nameImg,
    video: nameVideo,
    genero: genero,
    size: sizeVideo,
  };
  movies.push(newMovie);
  fs.writeFileSync("src/movies.json", JSON.stringify(movies), "utf-8");
  res.redirect("/movies");
}
function downloadMovie(req, res) {
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
function deleteMovie(req, res) {
  const sendMovie = movies.find((e) => e.id === req.params.id);
  movies = movies.filter((e) => e.id !== req.params.id);
  function dropImage(img) {
    const path = `src/public/uploads/movies/${img.image}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }
  function dropVideo(video) {
    const path = `src/public/uploads/movies/${video.video}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }
  dropImage(sendMovie);
  dropVideo(sendMovie);

  fs.writeFileSync("src/movies.json", JSON.stringify(movies), "utf-8");
  res.redirect("/movies");
}

module.exports = {
  render,
  renderForm,
  playMovie,
  uploadMovie,
  downloadMovie,
  deleteMovie,
};
