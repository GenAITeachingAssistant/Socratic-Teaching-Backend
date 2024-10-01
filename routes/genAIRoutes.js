const express = require("express");

const { protect } = require("../middleware/protect");
const { getGenAIResponse } = require("../controllers/genAIController");

const router = express.Router();

router.route("/:id").post(protect, getGenAIResponse);

module.exports = router;
