const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.io
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Mock translation function
// In a real scenario, this would call OpenAI or another AI API
async function translateText(text, targetLanguage = 'es') {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock translations (in real app, this would be an API call)
  const mockTranslations = {
    'hello': 'hola',
    'how are you': 'cómo estás',
    'good morning': 'buenos días',
    'thank you': 'gracias',
    'goodbye': 'adiós'
  };
  
  const lowerText = text.toLowerCase().trim();
  
  // Simple mock logic: if we have a translation, return it
  // Otherwise, return a simulated translation
  if (mockTranslations[lowerText]) {
    return mockTranslations[lowerText];
  }
  
  // For demonstration, we'll reverse the string and add [Translated] prefix
  return `[Translated] ${text.split('').reverse().join('')}`;
}

// Uncomment and use this for real OpenAI integration
/*
async function translateWithOpenAI(text, targetLanguage = 'Spanish') {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a translator. Translate the following text to ${targetLanguage}. Return only the translation, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}
*/

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Handle translation requests
  socket.on('translate', async (data) => {
    try {
      const { text, targetLanguage } = data;
      
      console.log(`Translating: "${text}" to ${targetLanguage || 'Spanish'}`);
      
      // Validate input
      if (!text || text.trim().length === 0) {
        socket.emit('translation-error', { 
          error: 'Text cannot be empty' 
        });
        return;
      }
      
      // Perform translation
      const translatedText = await translateText(text, targetLanguage);
      
      // Send back the translation
      socket.emit('translation-result', {
        original: text,
        translated: translatedText,
        targetLanguage: targetLanguage || 'es',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Translation error:', error);
      socket.emit('translation-error', { 
        error: error.message || 'Translation failed' 
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});