// Cosine similarity formula: (A . B) / (||A|| * ||B||)
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const findTopSimilarChunks = (queryEmbedding, storedChunks, topK = 3) => {
  const chunksWithSimilarity = storedChunks.map(chunk => {
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    return {
      ...chunk,
      similarity
    };
  });

  // Sort by similarity descending
  chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);

  return chunksWithSimilarity.slice(0, topK);
};

module.exports = {
  cosineSimilarity,
  findTopSimilarChunks
};
