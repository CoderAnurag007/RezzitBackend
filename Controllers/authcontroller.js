import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Creating User

export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, salt);
  req.body.password = hashedPassword;
  const newUser = new UserModel(req.body);

  try {
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(400).json("Username Not available");
    }
    const user = await newUser.save();
    console.log(user);
    console.log(newUser, "New HAi bhai ");

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("usercreated successfully");
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user

export const Loginuser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json("Wrong Password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
