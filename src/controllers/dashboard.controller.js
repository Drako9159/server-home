const { getUserActive } = require("./utils/getUserActive.js");
class DashboardController {
  static async appRenderDashboard(req, res) {
    const { user, filesPrivate, moviesPrivate } = await getUserActive(req.userId);
    res.render("dashboard/dashboard.ejs", { user, filesPrivate, moviesPrivate } )
  }
}
module.exports = DashboardController;
