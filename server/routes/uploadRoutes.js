const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parsePdf, parseTxt } = require('../utils/pdfParser');
const { chunkText } = require('../utils/chunker');
const { generateEmbeddings } = require('../utils/embedding');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload a PDF or TXT file.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const isPdf = req.file.mimetype === 'application/pdf';

    // 1. Extract text
    let text = '';
    if (isPdf) {
      text = await parsePdf(filePath);
    } else {
      text = await parseTxt(filePath);
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Could not extract text from document or document is empty.' });
    }

    // 2. Chunk text (approx 500 words with overlap)
    const chunks = chunkText(text, 500, 50);

    // 3. Generate embeddings for chunks
    const chunksWithEmbeddings = await generateEmbeddings(chunks, fileName);

    // 4. Store in local vectorStore
    const vectorStorePath = path.join(__dirname, '../data/vectorStore.json');
    
    // For this simple mini-project, we are replacing the old document's data with the new one
    // to keep it simple, but you could also append. Let's append to allow multiple docs.
    let existingData = [];
    try {
      if (fs.existsSync(vectorStorePath)) {
        const fileData = fs.readFileSync(vectorStorePath, 'utf-8');
        existingData = JSON.parse(fileData);
      }
    } catch (e) {
      existingData = [];
    }

    const newData = [...existingData, ...chunksWithEmbeddings];
    fs.writeFileSync(vectorStorePath, JSON.stringify(newData, null, 2));

    // Optional: Clean up the uploaded file to save space
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Document uploaded and processed successfully',
      chunksCreated: chunksWithEmbeddings.length,
      fileName
    });

  } catch (error) {
    console.error('Error in /upload:', error);
    res.status(500).json({ error: error.message || 'Failed to process document' });
  }
});

module.exports = router;
