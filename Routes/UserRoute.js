import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from "../Controllers/Usercontroller.js";

const router = express.Router();
// getuser
router.get("/:id", getUser);

// update user
router.put("/:id", updateUser);

// delete user
router.delete("/:id", deleteUser);

//Follow user
router.put("/:id/follow", followUser);

// unfollow user
router.put("/:id/unfollow", unfollowUser);

//  get all users
router.get("/", getAllUsers);

export default router;
