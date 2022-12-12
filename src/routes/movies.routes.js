const { Router } = require("express");
const router = Router();
const MoviesController = require("../controllers/movies.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");

const MulterUpload = require("../controllers/utils/multer.js");

router.get("/movies", verifyToken, MoviesController.appRenderMovies);
router.get(
  "/movies/new-movie",
  verifyToken,
  MoviesController.appRenderFormMovies
);
router.get("/movies/play-mov/:id", verifyToken, MoviesController.appPlayMovie);

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
  MoviesController.appUploadMovie
);

router.get("/movies/download/:id", verifyToken, MoviesController.appDownloadMovie);
router.get("/movies/delete/:id", verifyToken, MoviesController.appDeleteMovie);
router.get("/movies/edit/:id", verifyToken, MoviesController.appRenderEditMovie);
router.post(
  "/movies/edit/edit-movie",
  verifyToken,
  MoviesController.appUpdateMovie
);
router.get("/movies/share/:id", verifyToken, MoviesController.appShareMovie);


module.exports = router;
