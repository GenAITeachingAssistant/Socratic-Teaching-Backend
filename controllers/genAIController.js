const { GoogleGenerativeAI } = require("@google/generative-ai");

const Conversation = require("../models/conversationModel");

async function socraticDialogue(conversationContext) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a Socratic teaching assistant specialized in Data Structures and Algorithms. You must ask questions instead of giving answers directly. Guide students by asking probing questions, and help them understand the problem-solving process better.",
            },
          ],
        },

        ...conversationContext.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(
      conversationContext[conversationContext.length - 1].content,
    );

    return result.response.text();
  } catch (error) {
    console.error("Error with Google Generative AI:", error);
    throw new Error("Google Generative AI request failed.");
  }
}

const getGenAIResponse = async (req, res, next) => {
  try {
    const { studentResponse } = req.body;

    if (!studentResponse)
      return res.status(400).json({
        success: false,
        message: "Please provide a student response",
      });

    const conversationContext = await Conversation.findById(req.params.id);

    if (!conversationContext)
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });

    conversationContext.messages.push({
      role: "user",
      content: studentResponse,
    });

    conversationContext.save();

    const response = await socraticDialogue(conversationContext.messages);

    conversationContext.messages.push({ role: "model", content: response });

    conversationContext.save();

    return res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGenAIResponse };
