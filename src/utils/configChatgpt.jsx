import axios from 'axios';

export async function getChatResponse(prompt) {
  const apiKey = import.meta.env.VITE_API_CHATGPT_KEY; // Reemplaza con tu API Key
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post(url, {
      model: 'gpt-3.5-turbo', // Puedes cambiar el modelo si lo deseas
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data.choices[0].message.content;

  } catch (error) {
    console.log(error)
    console.log('Ocurrió un error al procesar tu solicitud.');
    
  }
}