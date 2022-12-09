const { Router } = require("express");
const router = Router();

const LoginController = require("../controllers/login.controller.js");
const { logOut } = require("../controllers/logout.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");

router.get("/", LoginController.publicItems);




router.get("/public-play-mov/:id", LoginController.playMovie);
router.get("/download-movie/:id", LoginController.downloadMovie);

router.get("/signup", logOut, LoginController.appRenderSignup);
router.get("/signin", logOut, LoginController.appRenderSignin);
router.post("/signup", LoginController.appCreateUser);
router.post("/signin", LoginController.appSigninUser);

/* Dashboard  */
router.get("/dashboard", verifyToken, LoginController.getDashboard)
router.get("/users/edit/:id", verifyToken, LoginController.editUser)
router.post("/users/edit/edit-user", verifyToken, LoginController.reloadUser)

module.exports = router;
