const { getUserActive } = require("./utils/getUserActive.js");
class DashboardController {
  static async appRenderDashboard(req, res) {
    try {
      const { filesPrivate, moviesPrivate, user, email, createdAt, id } =
        await getUserActive(req.userId);
      res.render("dashboard/dashboard.ejs", {
        filesPrivate,
        moviesPrivate,
        user,
        email,
        createdAt,
        id,
      });
    } catch (e) {
      console.log(e);
      res.redirect("/signin");
    }
  }
}
module.exports = DashboardController;
