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
} = require("../controllers/movies.controller");
//////
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
/////
router.get("/movies", render);

router.get("/movies/new-movie", renderForm);

router.get("/movies/play-mov/:id", playMovie);

const uploadContent = movieMulter.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
//
router.post("/movies/new-movie", uploadContent, uploadMovie);

router.get("/movies/download/:id", downloadMovie);

router.get("/movies/delete/:id", deleteMovie);

module.exports = router;
