const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");



const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
  //logic
  try {
    const { name, email, password } = req.body;
    //environment variables always return string so we need to convert it to number
    bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
      async (err, hash) => {
        if (err) {
          res.json({ err });
        }
        const user = new UserModel({ name, email, password: hash });
        await user.save();
        res
          .status(201)
          .send({
            message: "You have been Successfully Registered!",
            user: user,
          });
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
});



userRouter.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); // ✅ Log request data

  const { email, password } = req.body;
  try {
    const matchingUser = await UserModel.findOne({ email });

    if (!matchingUser) {
      console.log("User not found!");  // ✅ Log this
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
    if (!isPasswordMatched) {
      console.log("Invalid email or password!");  // ✅ Log this
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    
    console.log("Generating Token...");
    const token = jwt.sign(
      { userId: matchingUser._id, user: matchingUser.name },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login successful! Token generated:", token);  // ✅ Log token
    return res.status(200).json({ message: "You have been Successfully Logged in!", token });

  } catch (err) {
    console.error("Error during login:", err);  // ✅ Log errors
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});



userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).json({ message: "The List of Users", users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await UserModel.find({ _id: id });
    res.status(200).json({ massage: "Details of a single user", users });
  } catch (error) {
    res.status(500).json({ massage: "Internal server error", error: error.message });
  }
});

userRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
      async (err, hash) => {
        if (err) {
          res.json({ err });
        }
        await UserModel.findByIdAndUpdate(
          { _id: id },
          { name, email, password: hash }
        );
        res.status(200).json({ message: "User has been updated" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



module.exports = userRouter;
