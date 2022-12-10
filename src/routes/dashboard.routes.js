const { Router } = require("express");
const router = Router();
const DashboardController = require("../controllers/dashboard.controller.js");
const { verifyToken } = require("../controllers/utils/verifyToken.js");


router.get("/dashboard", verifyToken, DashboardController.appRenderDashboard);



module.exports = router;
