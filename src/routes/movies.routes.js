const { Router } = require("express");
const router = Router();
const multer = require("multer");
const {
  render,
  renderForm,
  playMovie,
  uploadMovie,
  downloadMovie,
  deleteMovie,
  editMovie,
  reloadMovie,
} = require("../controllers/movies.controller");
const { verifyToken } = require("../controllers/utils/verifyToken.js");
//////
/*
const storageMovies = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/movies");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const movieMulter = multer({ storage: storageMovies });
*/
/////
const MulterUpload = require("../controllers/utils/multer.js")

router.get("/movies", verifyToken, render);

router.get("/movies/new-movie", verifyToken, renderForm);

router.get("/movies/play-mov/:id", verifyToken, playMovie);

const uploadContent = MulterUpload.movieMulter.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
//
router.post("/movies/new-movie", verifyToken, uploadContent, uploadMovie);

router.get("/movies/download/:id", verifyToken, downloadMovie);

router.get("/movies/delete/:id", verifyToken, deleteMovie);

router.get("/movies/edit/:id", verifyToken, editMovie);

router.post("/movies/edit/edit-movie", verifyToken, reloadMovie);

module.exports = router;
