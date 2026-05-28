const chunkText = (text, maxWords = 500, overlapWords = 50) => {
  if (!text) return [];

  // Basic word splitting
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += (maxWords - overlapWords)) {
    const chunkWords = words.slice(i, i + maxWords);
    const chunkText = chunkWords.join(' ');
    chunks.push(chunkText);
    
    // Break if we've reached the end
    if (i + maxWords >= words.length) {
      break;
    }
  }

  return chunks;
};

module.exports = {
  chunkText
};
