
const { eraseFiles } = require("../utils/readerJson.js");
const { getToken } = require("../utils/getToken.js");
const { writerDatabase, readerDatabase } = require("../utils/getUserActive.js");


// FILES //
async function postFile(res, user, file) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  getUser.filesPrivate.push(file);
  await writerDatabase(database);
  if (getUser.filesPrivate.find((e) => e.filename === file.filename)) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.redirect("/files");
  }
}
async function deleteFile(res, user, file) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
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
  await writerDatabase(database);
  res.redirect("/dashboard");
}
async function updateFile(res, user, newTitle, id) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  const detectFile = getUser.filesPrivate.find((e) => e.id === id);
  detectFile.title = newTitle;
  await writerDatabase(database);
  res.redirect("/dashboard");
}
async function shareFile(res, user, file) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  const shareFile = getUser.filesPrivate.find((e) => e.id === file);
  if (shareFile.share) {
    shareFile.share = false;
  } else {
    shareFile.share = true;
  }
  await writerDatabase(database);
  res.redirect("/dashboard");
}
// FILES //
// MOVIES //
async function postMovie(res, user, movie) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  getUser.moviesPrivate.push(movie);
  await writerDatabase(database);
  res.redirect("/movies");
}
async function deleteMovie(res, user, movie) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  const deleteMovie = getUser.moviesPrivate.find((e) => e.id === movie);
  const userMovies = getUser.moviesPrivate.filter((e) => e.id !== movie);
  function deleteDroper() {
    eraseFiles(`src/public/uploads/movies/${deleteMovie.image}`);
    eraseFiles(`src/public/uploads/movies/${deleteMovie.video}`);
    eraseFiles(`src/public/uploads/movies/${deleteMovie.banner}`);
  }
  deleteDroper();
  getUser.moviesPrivate = userMovies;
  await writerDatabase(database);
  res.redirect("/dashboard");
}
async function shareMovie(res, user, movie) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  const shareMovie = getUser.moviesPrivate.find((e) => e.id === movie);
  if (shareMovie.share) {
    shareMovie.share = false;
  } else {
    shareMovie.share = true;
  }
  await writerDatabase(database);
  res.redirect("/dashboard");
}
async function updateMovie(res, user, newMovie, id) {
  let database = await readerDatabase();
  let getUser = database.find((e) => e.id === user);
  const detectMovie = getUser.moviesPrivate.find((e) => e.id === id);
  detectMovie.title = newMovie.title;
  detectMovie.sinopsis = newMovie.sinopsis;
  detectMovie.year = newMovie.year;
  detectMovie.genero = newMovie.genero;
  await writerDatabase(database);
  res.redirect("/dashboard");
}

// MOVIES //
// USER //
async function postUser(res, user) {
  let database = await readerDatabase();
  database.push(user);
  await writerDatabase(database);
  res.setHeader("Set-Cookie", getToken(user.id, user.user, user.email));
  res.redirect("/files");
}
async function validationUp(user, email) {
  let database = await readerDatabase();
  let checkUser = database.find((e) => e.user === user);
  let checkEmail = database.find((e) => e.email === email);
  if (checkUser) {
    return "haveUser";
  } else if (checkEmail) {
    return "haveEmail";
  } else {
    return "ok";
  }
}
async function validationIn(user) {
  let database = await readerDatabase();
  let checkUser = database.find((e) => e.user === user);
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
