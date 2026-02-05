const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


// ✅ Language Map
const langMap = {
  es: "Spanish",
  de: "German",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  zh: "Chinese",
  hi: "Hindi"
};


// ✅ OpenAI Translation Function
async function translateWithOpenAI(text, targetLanguage = "es") {
  try {
    const fullLanguage = langMap[targetLanguage] || targetLanguage;

    console.log("Calling OpenAI...");
    console.log("Target:", fullLanguage);

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Translate the text to ${fullLanguage}. Only return translation.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.error("Bad response:", data);
      return "Translation error";
    }

    return data.choices[0].message.content.trim();

  } catch (err) {
    console.error("OpenAI ERROR:", err);
    return "Translation failed";
  }
}


// ✅ Socket.io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("translate", async (data) => {
    try {
      const { text, targetLanguage = "es" } = data;

      if (!text) return;

      console.log(`Translating "${text}" → ${targetLanguage}`);

      const result = await translateWithOpenAI(
        text,
        targetLanguage
      );

      socket.emit("translation-result", {
        original: text,
        translated: result
      });

    } catch (err) {
      console.error(err);
      socket.emit("translation-error", {
        error: "Translation failed"
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
