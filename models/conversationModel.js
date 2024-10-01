const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

const conversationSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Conversation", conversationSchema);
