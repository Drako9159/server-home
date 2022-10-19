const { Router } = require("express");
const router = Router();
const {
  renderSignup,
  createUser,
  renderSignin,
  signinUser,
  getDashboard,
  editUser,
  reloadUser
} = require("../controllers/login.controller.js");
const { logOut } = require("../controllers/logout.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");
router.get("/", (req, res) => {
  res.redirect("/signin");
});

router.get("/signup", logOut, renderSignup);


router.post("/signup", createUser);

router.get("/signin", logOut, renderSignin);

router.post("/signin", signinUser);

/* Dashboard  */
router.get("/dashboard", verifyToken, getDashboard)

router.get("/users/edit/:id", verifyToken, editUser)

router.post("/users/edit/edit-user", verifyToken, reloadUser)

module.exports = router;
