const { Router } = require("express");
const router = Router();
const multer = require("multer");
const MoviesController = require("../controllers/movies.controller.js");
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


const MulterUpload = require("../controllers/utils/multer.js");

router.get("/movies", verifyToken, MoviesController.render);

router.get("/movies/new-movie", verifyToken, MoviesController.renderForm);

router.get("/movies/play-mov/:id", verifyToken, MoviesController.playMovie);

const uploadContent = MulterUpload.movieMulter.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
//
router.post(
  "/movies/new-movie",
  verifyToken,
  uploadContent,
  MoviesController.uploadMovie
);

router.get("/movies/download/:id", verifyToken, MoviesController.downloadMovie);

router.get("/movies/delete/:id", verifyToken, MoviesController.deleteMovie);

router.get("/movies/edit/:id", verifyToken, MoviesController.editMovie);

router.post(
  "/movies/edit/edit-movie",
  verifyToken,
  MoviesController.reloadMovie
);

router.get("/movies/share/:id", verifyToken, MoviesController.shareMovie);

module.exports = router;
