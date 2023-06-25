import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get user from Database
export const getUser = async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findById(id).select("-password");

  try {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("User not Found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update a user

export const updateUser = async (req, res) => {
  const Paramid = req.params.id;
  const { _id, password } = req.body;
  if (Paramid === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(Paramid, req.body, {
        new: true,
      });
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied! you can only update your own profile");
  }
};

// Delete User

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentAdminStatus } = req.body;
  if (id === currentUserId && currentAdminStatus) {
    try {
      const user = await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted Succesfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied ");
  }
};

// Follow A user
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    res.status(403).json("Access Forbidden You cant follow yourself");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User Followed");
      } else {
        res.status(403).json("User Already followed");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

//Un-Follow A user
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    res.status(403).json("Access Forbidden You cant Unfollow yourself");
  } else {
    try {
      const unfollowUser = await UserModel.findById(id);
      const unfollowingUser = await UserModel.findById(_id);
      if (unfollowUser.followers.includes(_id)) {
        await unfollowUser.updateOne({ $pull: { followers: _id } });
        await unfollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unFollowed");
      } else {
        res.status(403).json("User Not  followed");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

// get all user

export const getAllUsers = async (req, res) => {
  console.log("Route Hitted");
  try {
    let users = await UserModel.find().select("-password");
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(400).json("Users Not Found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
