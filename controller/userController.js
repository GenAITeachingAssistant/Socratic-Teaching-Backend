const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        avatarImage: user.avatarImage,
      },
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or Password",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or Password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        avatarImage: user.avatarImage,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const userData = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatarImage: avatar,
      },
      { new: true },
    ).select("-password");

    return res.status(200).json({ success: true, userData });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password",
    );

    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, setAvatar, getAllUsers };
