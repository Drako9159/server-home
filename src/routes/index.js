const { Router } = require("express");
const router = Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const json_paquets = fs.readFileSync("src/paquets.json", "utf-8");
//const json_drop = fs.readFileSync("src/drops.json", "utf-8");
let paquets = JSON.parse(json_paquets);
//let drops = JSON.parse(json_drop);
const app = require("../app");
//////
const multer = require("multer");
const { route } = require("../app");
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/movies");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const uploadImage = multer({ storage: storageImage });
/////
const storageDrop = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/drops");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const uploadDrop = multer({ storage: storageDrop });
////
router.get("/", (req, res) => {
  const nav = {
    add: "Añadir Película",
    link: "/new-entry",
  };

  res.render("index.ejs", { paquets, nav });
});
router.get("/new-entry", (req, res) => {
  const nav = {
    add: "Añadir Película",
    link: "/new-entry",
  };
  res.render("new-entry.ejs", { nav });
});

router.get("/play-mov/:id", (req, res) => {
  const movies = paquets.find((e) => e.id === req.params.id);

  //res.sendFile(__dirname + "/../views/play-mov.ejs");
  res.render("play-mov.ejs", { movies });
});

const uploadContent = uploadImage.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
//
router.post("/new-entry", uploadContent, (req, res) => {
  const { title, sinopsis, year, genero } = req.body;

  if (
    !title ||
    !sinopsis ||
    !year ||
    !genero ||
    !req.files.image ||
    !req.files.video
  ) {
    res.status(400).send("No ingresaste todos los datos requeridos");
    if (req.files.image) {
      fs.unlink(
        `src/public/uploads/movies/${req.files.image[0].filename}`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        }
      );
    } else if (req.files.video) {
      fs.unlink(
        `src/public/uploads/movies/${req.files.video[0].filename}`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        }
      );
    }
    return;
  }
  const nameImg = req.files.image[0].filename;
  const nameVideo = req.files.video[0].filename;
  const sizeVideo = req.files.video[0].size;

  let newPost = {
    id: uuidv4(),
    title: title,
    sinopsis: sinopsis,
    year: year,
    image: nameImg,
    video: nameVideo,
    genero: genero,
    size: sizeVideo,
  };
  paquets.push(newPost);
  fs.writeFileSync("src/paquets.json", JSON.stringify(paquets), "utf-8");
  res.redirect("/");
});
router.get("/download/:id", (req, res) => {
  const movies = paquets.find((e) => e.id === req.params.id);
  const path = `src/public/uploads/movies/${movies.video}`;
  //res.download(path, movies.video);
  const head = {
    "Content-Type": "video/mp4",
    "Content-Disposition": `attachment; filename=${movies.video}`,
    "Content-Length": movies.size,
  };
  console.log(movies);
  res.writeHead(200, head);
  fs.createReadStream(path).pipe(res);
});

//res.redirect("/");

router.get("/delete/:id", (req, res) => {
  const dropDrive = paquets.find((e) => e.id === req.params.id);

  paquets = paquets.filter((e) => e.id !== req.params.id);

  function dropImage(img) {
    const path = `src/public/uploads/movies/${img.image}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }
  function dropVideo(video) {
    const path = `src/public/uploads/movies/${video.video}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }
  dropImage(dropDrive);
  dropVideo(dropDrive);

  fs.writeFileSync("src/paquets.json", JSON.stringify(paquets), "utf-8");
  res.redirect("/");
});

module.exports = router;
