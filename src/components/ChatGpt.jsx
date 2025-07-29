import { useState } from 'react';
import { getChatResponse } from '@maibarra0904/utils';



function ChatPgt() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await getChatResponse(input, import.meta.env.VITE_API_CHATGPT_KEY);
    setResponse(result);
  };

  return (
    <div>
      <h1>ChatGPT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta"
        />
        <button type="submit">Enviar</button>
      </form>
      <p>Respuesta: {response}</p>
    </div>
  );
}

export default ChatPgt;
