const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const ejs = require("ejs");
///
app.set("port", 5000);
///
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// routes
app.use(require("./routes/files.routes"));
app.use(require("./routes/movies.routes"));
app.use(require("./routes/login.routes"));
app.use(require("./routes/dashboard.routes"));
///
app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});
module.exports = app;


/*
const cors = require("cors")

const whiteList = ["https://www.section.io"]

const corsOptions = {
  origin:(origin, callback) => {
    if(whiteList.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error)
    }
  }
}
app.use(cors({
  origin: ["https://www.section.io"],
  methods: ["GET", "POST", "DELETE", "PUT"]
}))

*/
