const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

const tryGenerateContent = async (genAI, modelName, prompt) => {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

const generateAnswer = async (context, question) => {
  const genAI = getGenAI();
  const prompt = `
Answer the question only using the provided context. If answer is not available in the context, say exactly: "The document does not contain enough information to answer this question."

Context:
${context}

Question:
${question}

Answer:
`;

  try {
    // 1. Try primary model: gemini-2.0-flash
    return await tryGenerateContent(genAI, 'gemini-2.0-flash', prompt);
  } catch (error) {
    console.error('Error with gemini-2.0-flash:', error.message || error);
    
    // If it's a rate limit error, throw it immediately with a friendly message
    if (error.message && error.message.includes('429')) {
      throw new Error('Rate limit exceeded (429 Too Many Requests). Please wait a moment and try again.');
    }
    
    // If 404 or unsupported, fallback to gemini-1.5-flash
    if (error.message && (error.message.includes('404') || error.message.includes('not found') || error.message.includes('not supported'))) {
      console.log('Falling back to gemini-1.5-flash...');
      try {
        // 2. Try fallback model: gemini-1.5-flash
        return await tryGenerateContent(genAI, 'gemini-1.5-flash', prompt);
      } catch (fallbackError) {
        console.error('Error with gemini-1.5-flash:', fallbackError.message || fallbackError);
        
        if (fallbackError.message && fallbackError.message.includes('429')) {
           throw new Error('Rate limit exceeded (429 Too Many Requests). Please wait a moment and try again.');
        }
        throw new Error(`Fallback failed. Details: ${fallbackError.message}`);
      }
    }
    
    // Otherwise throw original error
    throw new Error(`LLM generation failed. Details: ${error.message}`);
  }
};

module.exports = {
  generateAnswer
};
