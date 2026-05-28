const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/uploadRoutes');
const askRoutes = require('./routes/askRoutes');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Create required directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(path.join(dataDir, 'vectorStore.json'))) {
  fs.writeFileSync(path.join(dataDir, 'vectorStore.json'), '[]');
}

// Routes
app.use('/api', uploadRoutes);
app.use('/api', askRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('RAG Document Assistant API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
