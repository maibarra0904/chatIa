// src/deepseekService.js
import axios from 'axios';

const API_URL = 'https://deepseek-v3.p.rapidapi.com/chat';
const API_KEY = import.meta.env.VITE_API_DEEPSEEK_KEY; // Reemplaza con tu clave real

export const fetchChatResponse = async (message) => {
  const data = {
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  };

  const headers = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'deepseek-v3.p.rapidapi.com',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(API_URL, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener respuesta:', error);
    throw error;
  }
};
