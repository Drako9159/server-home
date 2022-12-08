const multer = require("multer");

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/files");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
//const fileMulter = multer({ storage: storageDrop });

const storageMovies = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/movies");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
//const movieMulter = multer({ storage: storageMovies });

const MulterUpload = {
    fileMulter: multer({ storage: storageFile }),
    movieMulter: multer({ storage: storageMovies }),
}

module.exports = MulterUpload;


