import mongoose from "mongoose";
import PostModel from "../Models/Postmodel.js";
import UserModel from "../Models/UserModel.js";

// Create new post

export const createNewPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// get post

export const getPost = async (req, res) => {
  const postid = req.params.id;
  try {
    const post = await PostModel.findById(postid);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Post not available");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// update post

export const updatePost = async (req, res) => {
  const postid = req.params.id;
  const { userId } = req.body;
  console.log("updating", userId);
  try {
    const post = await PostModel.findById(postid);
    if (post.userId == userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Access Denied you can update your post only");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  const postid = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postid);
    if (post.userId == userId) {
      await PostModel.findByIdAndDelete(postid);

      res.status(200).json("Posted deleted successfully");
    } else {
      res.status(403).json("Access Denied");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like dislike post

export const likePost = async (req, res) => {
  const postid = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postid);

    if (!post.likes.find((x) => x.userId == userId)) {
      await post.updateOne({ $push: { likes: { userId: userId } } });
      res.status(200).json("Liked post");
    } else {
      await post.updateOne({ $pull: { likes: { userId: userId } } });
      res.status(200).json("Post disliked");
    }
  } catch (error) {
    res.status(403).json(error.message);
  }
};

// Get timeline post
export const gettimelinepost = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const currentUserPost = await PostModel.find({ userId: userId });
    console.log(currentUserPost);
    // const followingPost = await UserModel.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(userId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "posts",
    //       localField: "following",
    //       foreignField: "userId",
    //       as: "followingPosts",
    //     },
    //   },
    //   {
    //     $project: {
    //       followingPosts: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);
    res.status(200).json(currentUserPost);
  } catch (error) {
    res.status(403).json(error.message);
  }
};
