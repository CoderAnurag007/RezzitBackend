import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Authroutes from "../Routes/Authroute.js";
import Userroutes from "../Routes/UserRoute.js";
import PostRoute from "../Routes/PostRoute.js";
import UploadRoute from "../Routes/UploadRoute.js";
// Route

const app = express();

// To server images public
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// Database Connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening at ${process.env.PORT} Port`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//   usage of route

app.use("/auth", Authroutes);
app.use("/user", Userroutes);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
