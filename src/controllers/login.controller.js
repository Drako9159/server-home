function renderSignup(req, res) {
  const nav = {
    add: "Inicia Sesión",
    link: "/signup",
  };
  res.render("signup.ejs", { nav });
}

module.exports = {
  renderSignup,
};
