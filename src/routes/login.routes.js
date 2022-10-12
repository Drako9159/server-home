const { Router } = require("express");
const router = Router();
const {
  renderSignup,
  createUser,
  renderSignin,
  signinUser,
} = require("../controllers/login.controller.js");

router.get("/", (req, res) => {
  res.redirect("/signin");
});

router.get("/signup", renderSignup);

router.post("/signup", createUser);

router.get("/signin", renderSignin);

router.post("/signin", signinUser);

module.exports = router;
