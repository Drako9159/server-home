const { Router } = require("express");
const router = Router();
const {
  renderSignup,
  createUser,
  renderSignin,
  signinUser,
} = require("../controllers/login.controller.js");
const { logOut } = require("../controllers/logout.controller.js");

router.get("/", (req, res) => {
  res.redirect("/signin");
});

router.get("/signup", logOut, renderSignup);

router.post("/signup", createUser);

router.get("/signin", logOut, renderSignin);

router.post("/signin", signinUser);



module.exports = router;
