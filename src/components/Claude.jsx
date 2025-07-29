// src/App.jsx
import { useState } from 'react';
import { fetchClaudeResponse } from '../utils/configAnthropic';


const App = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await fetchClaudeResponse(prompt);
            setResponse(result.output); // Ajusta según la estructura de la respuesta
        } catch (error) {
            setResponse('Error al obtener la respuesta.');
        }
    };

    return (
        <div>
            <h1>Interactúa con Claude</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Escribe tu prompt aquí"
                />
                <button type="submit">Enviar</button>
            </form>
            <div>
                <h2>Respuesta:</h2>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default App;