const fs = require("fs");
fs.readFileSync("src/users.json", "utf-8");
const json_users = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(json_users);
const { eraseFiles } = require("../utils/readerJson.js");
const { getToken } = require("../utils/getToken.js");

// FILES //
function postFile(res, user, file) {
  let getUser = users.find((e) => e.id === user);
  getUser.filesPrivate.push(file);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  if (getUser.filesPrivate.find((e) => e.filename === file.filename)) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.redirect("/files");
  }
}
function deleteFile(res, user, file) {
  let getUser = users.find((e) => e.id === user);
  const deleteFile = getUser.filesPrivate.find((e) => e.id === file);
  const userFiles = getUser.filesPrivate.filter((e) => e.id !== file);
  function deleteDroper(drop) {
    if (drop) {
      let path = `src/public/uploads/files/${drop.namepath}`;
      eraseFiles(path);
    }
  }
  deleteDroper(deleteFile);
  getUser.filesPrivate = userFiles;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}
function updateFile(res, user, newTitle, id) {
  let getUser = users.find((e) => e.id === user);
  const detectFile = getUser.filesPrivate.find((e) => e.id === id);
  detectFile.title = newTitle;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}
function shareFile(res, user, file) {
  let getUser = users.find((e) => e.id === user);
  const shareFile = getUser.filesPrivate.find((e) => e.id === file);
  if (shareFile.share) {
    shareFile.share = false;
  } else {
    shareFile.share = true;
  }
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}
// FILES //
// MOVIES //
function postMovie(res, user, movie) {
  let getUser = users.find((e) => e.id === user);
  getUser.moviesPrivate.push(movie);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/movies");
}
function deleteMovie(res, user, movie) {
  let getUser = users.find((e) => e.id === user);
  const deleteMovie = getUser.moviesPrivate.find((e) => e.id === movie);
  const userMovies = getUser.moviesPrivate.filter((e) => e.id !== movie);
  function deleteDroper() {
    eraseFiles(`src/public/uploads/movies/${deleteMovie.image}`);
    eraseFiles(`src/public/uploads/movies/${deleteMovie.video}`);
    eraseFiles(`src/public/uploads/movies/${deleteMovie.banner}`);
  }
  deleteDroper();
  getUser.moviesPrivate = userMovies;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}
function shareMovie(res, user, movie) {
  let getUser = users.find((e) => e.id === user);
  const shareMovie = getUser.moviesPrivate.find((e) => e.id === movie);
  if (shareMovie.share) {
    shareMovie.share = false;
  } else {
    shareMovie.share = true;
  }
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}
function updateMovie(res, user, newMovie, id) {
  let getUser = users.find((e) => e.id === user);
  const detectMovie = getUser.moviesPrivate.find((e) => e.id === id);
  detectMovie.title = newMovie.title;
  detectMovie.sinopsis = newMovie.sinopsis;
  detectMovie.year = newMovie.year;
  detectMovie.genero = newMovie.genero;
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.redirect("/dashboard");
}

// MOVIES //
// USER //
function postUser(res, user) {
  users.push(user);
  fs.writeFileSync("src/users.json", JSON.stringify(users), "utf-8");
  res.setHeader("Set-Cookie", getToken(user.id, user.user, user.email));
  res.redirect("/files");
}
function validationUp(user, email) {
  let checkUser = users.find((e) => e.user === user);
  let checkEmail = users.find((e) => e.email === email);
  if (checkUser) {
    return "haveUser";
  } else if (checkEmail) {
    return "haveEmail";
  } else {
    return "ok";
  }
}
function validationIn(user) {
  let checkUser = users.find((e) => e.user === user);
  if (checkUser) {
    return checkUser;
  }
}
// USER //



module.exports = {
  postFile,
  deleteFile,
  updateFile,
  postUser,
  validationUp,
  validationIn,
  postMovie,
  deleteMovie,
  updateMovie,
  shareMovie,
  shareFile,
};
