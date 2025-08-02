const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Player = require("../../models/player"); // Assuming you're using the correct path

dotenv.config(); // Ensure the .env file is loaded

const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(question) {
  try {
    const players = await Player.find(); // Get all players from the database

    if (!players || players.length === 0) {
      return "I don’t have enough knowledge to answer that question.";
    }

    const context = JSON.stringify(players, null, 2); // Corrected JSON formatting

    const prompt = `Given the following player statistics, answer the user's query concisely. If the data isn't available, respond with: 'I don’t have enough knowledge to answer that question.'\n\nPlayer Data:\n${context}\n\nUser Query:\n${question}\nAnswer:`;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error during API request:", error);
    return "An error occurred while processing your request.";
  }
}

// Route to answer queries
router.post("/answer", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question parameter is required" });
  }

  const answer = await run(question);
  res.status(200).json({ answer });
});

module.exports = router;
