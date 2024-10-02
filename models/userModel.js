const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 20,
    },

    lastName: {
      type: String,
      required: true,
      max: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },

    password: {
      type: String,
      required: true,
      min: 8,
    },

    avatarImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
