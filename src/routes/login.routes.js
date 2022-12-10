const { Router } = require("express");
const router = Router();

const LoginController = require("../controllers/login.controller.js");
const { logOut } = require("../controllers/logout.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");

router.get("/", (req, res) => {
    res.redirect("/signin")
});
router.get("/signup", logOut, LoginController.appRenderSignup);
router.get("/signin", logOut, LoginController.appRenderSignin);
router.post("/signup", LoginController.appCreateUser);
router.post("/signin", LoginController.appSigninUser);

module.exports = router;
