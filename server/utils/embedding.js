const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

const generateEmbeddingForText = async (text) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error.message || error);
    if (error.message && error.message.includes('429')) {
      throw new Error('Rate limit exceeded (429 Too Many Requests). Please wait a moment before trying again.');
    }
    throw error;
  }
};

// Helper for rate limit friendly behavior
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const generateEmbeddings = async (chunks, fileName) => {
  const chunksWithEmbeddings = [];
  
  // Process chunks sequentially to respect rate limits
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      console.log(`Generating embedding for chunk ${i + 1}/${chunks.length}...`);
      const embedding = await generateEmbeddingForText(chunk);
      chunksWithEmbeddings.push({
        id: crypto.randomUUID(),
        fileName,
        chunkText: chunk,
        embedding
      });
      
      // Small delay between requests to prevent 429 Too Many Requests
      if (i < chunks.length - 1) {
        await delay(1200); // 1.2 second delay
      }
    } catch (error) {
      console.error(`Failed to embed chunk ${i + 1}:`, error.message || error);
      throw new Error(error.message || `Failed to generate embedding for chunk ${i + 1}`);
    }
  }

  return chunksWithEmbeddings;
};

module.exports = {
  generateEmbeddingForText,
  generateEmbeddings
};
