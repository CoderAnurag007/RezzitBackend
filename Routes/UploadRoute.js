import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });

// router.post("/", (req, res) => {
//   // upload.single("file", (req, res) => {
//   //   try {
//   //     return res.status(200).json("Uploaded");
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // });
// });

router.post("/", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json(" Please Upload File ");
    console.log("File Uploaded");
  } else {
    res.status(200).json(file);
  }
});

export default router;
