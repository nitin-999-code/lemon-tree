const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateEmbeddingForText } = require('../utils/embedding');
const { findTopSimilarChunks } = require('../utils/similarity');
const { generateAnswer } = require('../utils/llm');

const router = express.Router();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    // 1. Read the vector store
    const vectorStorePath = path.join(__dirname, '../data/vectorStore.json');
    if (!fs.existsSync(vectorStorePath)) {
      return res.status(400).json({ error: 'No documents uploaded yet. Please upload a document first.' });
    }

    let storedData = [];
    try {
      const fileData = fs.readFileSync(vectorStorePath, 'utf-8');
      storedData = JSON.parse(fileData);
    } catch (error) {
      console.error('Failed to read vector store:', error.message || error);
      return res.status(500).json({ error: 'Failed to read document data' });
    }

    if (storedData.length === 0) {
      return res.status(400).json({ error: 'No documents uploaded yet. Please upload a document first.' });
    }

    // 2. Generate embedding for the question
    let questionEmbedding;
    try {
      questionEmbedding = await generateEmbeddingForText(question);
    } catch (error) {
      console.error('Error generating question embedding:', error.message || error);
      return res.status(error.message?.includes('429') ? 429 : 500).json({ 
        error: error.message || 'Failed to embed question' 
      });
    }

    // 3. Find top 3 most similar chunks
    const topChunks = findTopSimilarChunks(questionEmbedding, storedData, 3);

    // 4. Generate Answer using LLM
    const context = topChunks.map(chunk => chunk.chunkText).join('\n\n---\n\n');
    let answer;
    try {
      answer = await generateAnswer(context, question);
    } catch (error) {
      console.error('Error generating LLM answer:', error.message || error);
      return res.status(error.message?.includes('429') ? 429 : 500).json({ 
        error: error.message || 'Failed to generate answer' 
      });
    }

    res.status(200).json({
      answer,
      sources: topChunks.map(c => ({
        id: c.id,
        fileName: c.fileName,
        chunkText: c.chunkText,
        similarity: c.similarity
      }))
    });

  } catch (error) {
    console.error('Unhandled error in /ask:', error.message || error);
    res.status(500).json({ error: 'Internal server error. Details: ' + (error.message || '') });
  }
});

module.exports = router;
