const { Router } = require("express");
const router = Router();
const { renderSignup } = require("../controllers/login.controller.js");

router.get("/signup", renderSignup);

module.exports = router;
