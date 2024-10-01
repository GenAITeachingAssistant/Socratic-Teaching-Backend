const Conversation = require("../models/conversationModel");

const getAllConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      userID: req.user._id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

const createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.create({
      userID: req.user._id,
      name: req.body.name,
      messages: req.body.messages,
    });

    return res.status(201).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

const addMessageUser = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!req.body.content)
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });

    conversation.messages.push({
      role: "user",
      content: req.body.content,
    });

    await conversation.save();

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllConversations,
  getConversation,
  createConversation,
  addMessageUser,
};
