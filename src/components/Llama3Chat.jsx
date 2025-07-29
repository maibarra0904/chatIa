import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import './Llama3Chat.css';

const Llama3Chat = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const chatContentRef = useRef(null);

    // Inicializa Groq con tu API Key del entorno
    // Asegúrate de que VITE_GROQ_API_KEY esté definida en tu archivo .env
    const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true, // Necesario para usarlo directamente en el navegador (solo para desarrollo/pruebas)
    });

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const clearHistory = () => {
        setChatHistory([]);
        setOutput('');
        setError(null);
        setInput('');
    };

    const toggleFullText = (messageId) => {
        setChatHistory(prev => 
            prev.map(message => 
                message.id === messageId 
                    ? { ...message, showFullText: !message.showFullText }
                    : message
            )
        );
    };

    // Scroll automático al final del chat
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [chatHistory, output, error]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setOutput(''); // Clear previous output

        if (!input.trim()) {
            setError('Por favor, ingresa un mensaje.');
            setLoading(false);
            return;
        }

        if (!groq.apiKey) {
            setError('Error: API Key de Groq no encontrada. Asegúrate de configurarla en tu archivo .env');
            setLoading(false);
            return;
        }

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: input,
                    },
                ],
                model: 'llama3-8b-8192', // Modelo Llama 3 más pequeño y rápido
                // Otros modelos de Groq que puedes probar:
                // 'llama3-70b-8192' (más potente, pero un poco más lento)
                // 'mixtral-8x7b-32768' (excelente para muchas tareas)
            });

            const response = chatCompletion.choices[0]?.message?.content || 'No se pudo generar una respuesta.';
            // Determinar si la respuesta necesita ser cortada
            const isTruncated = response.length > 200;
            const truncatedResponse = isTruncated ? response.substring(0, 200) + '...' : response;
            
            // Agregar al historial
            const newMessage = {
                id: Date.now(),
                user: input,
                assistant: truncatedResponse,
                fullAssistant: response, // Guardar la respuesta completa
                isTruncated: isTruncated,
                showFullText: false, // Estado para mostrar/ocultar texto completo
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, newMessage]);
            setInput(''); // Limpiar el input después de enviar
        } catch (err) {
            console.error('Error al comunicarse con Llama 3:', err);
            setError(`Error: ${err.message}. Asegúrate de que tu API Key sea válida y de tener conexión.`);
            if (err.status === 401) {
                setError('Error de autenticación: Tu API Key podría ser inválida o haber expirado.');
            } else if (err.status === 429) {
                setError('Límite de solicitudes excedido. Intenta de nuevo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="header-content">
                    <div>
                        <h2>🤖 Chatea con IA</h2>
                        <p>Powered by Llama 3</p>
                    </div>
                    <button 
                        className="clear-button" 
                        onClick={clearHistory}
                        disabled={chatHistory.length === 0}
                    >
                        🗑️ Limpiar
                    </button>
                </div>
            </div>
            
            <div className="chat-content" ref={chatContentRef}>
                {/* Historial del chat */}
                <div className="chat-history">
                    {chatHistory.map((message) => (
                        <div key={message.id} className="message-pair">
                            <div className="user-message">
                                <div className="message-header">
                                    <span className="message-sender">👤 Tú</span>
                                    <span className="message-time">{message.timestamp}</span>
                                </div>
                                <div className="message-content">
                                    {message.user}
                                </div>
                            </div>
                            <div className="assistant-message">
                                <div className="message-header">
                                    <span className="message-sender">🤖 Asistente</span>
                                    <span className="message-time">{message.timestamp}</span>
                                </div>
                                <div className="message-content">
                                    {message.showFullText ? message.fullAssistant : message.assistant}
                                    {message.isTruncated && (
                                        <div className="expand-button-container">
                                            <button 
                                                className="expand-button"
                                                onClick={() => toggleFullText(message.id)}
                                            >
                                                {message.showFullText ? '📄 Ver menos' : '📖 Ver más'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicador de escritura */}
                {loading && (
                    <div className="typing-indicator">
                        <div className="typing-message">
                            <div className="message-header">
                                <span className="message-sender">🤖 Asistente</span>
                                <span className="message-time">Escribiendo...</span>
                            </div>
                            <div className="typing-content">
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}
            </div>
            
            <div className="input-section">
                <div className="input-container">
                    <textarea
                        className="chat-input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe tu mensaje aquí... (Enter para enviar, Shift+Enter para nueva línea)"
                        disabled={loading}
                        rows="3"
                    />
                    <button
                        className={`send-button ${loading ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? (
                            <span className="loading-spinner">⏳</span>
                        ) : (
                            <span className="send-icon">🚀</span>
                        )}
                        {loading ? 'Generando...' : 'Enviar'}
                    </button>
                </div>
                <div className="input-footer">
                    <small>Presiona Enter para enviar • Shift+Enter para nueva línea • Usa &quot;Ver más&quot; para respuestas largas</small>
                </div>
            </div>
        </div>
    );
};

export default Llama3Chat;