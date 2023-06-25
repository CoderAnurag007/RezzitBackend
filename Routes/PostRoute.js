import express from "express";
import {
  createNewPost,
  deletePost,
  getPost,
  gettimelinepost,
  likePost,
  updatePost,
} from "../Controllers/PostController.js";

const router = express.Router();

// create post
router.post("/createpost", createNewPost);

// get post
router.get("/:id/getpost", getPost);

// update post
router.put("/:id/updatepost", updatePost);

// delete post
router.delete("/:id/deletepost", deletePost);

// Like post
router.put("/:id/likepost", likePost);

// timeline post
router.get("/:id/timeline", gettimelinepost);

export default router;
