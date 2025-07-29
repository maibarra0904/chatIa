// src/api.js
import axios from 'axios';

const API_URL = '/api/v1'; // Usar el proxy configurado en Vite
const API_KEY = import.meta.env.VITE_API_ANTHROPIC_KEY;

export const fetchClaudeResponse = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/generate`, {
            prompt: prompt,
            // Otros parámetros que necesites
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Reemplaza con tu clave API
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching response from Claude:', error);
        throw error;
    }
};