// src/Chat.js
import { useState } from 'react';
import { fetchChatResponse } from '../api/deepSeekRequest';


const Chat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    try {
      const response = await fetchChatResponse(userMessage);
      setChatResponse(response.messages[0]?.content || 'Sin respuesta');
    } catch (error) {
      setChatResponse('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat con DeepSeek</h1>
      <textarea
        rows="4"
        cols="50"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
      />
      <br />
      <button onClick={handleSendMessage} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Respuesta:</h3>
        <p>{chatResponse}</p>
      </div>
    </div>
  );
};

export default Chat;
