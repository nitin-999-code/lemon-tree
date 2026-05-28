import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const askQuestion = async (question) => {
  const response = await axios.post(`${API_URL}/ask`, { question });
  return response.data;
};
