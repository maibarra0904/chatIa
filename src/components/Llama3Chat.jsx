
import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import './Llama3Chat.css';

import PropTypes from 'prop-types';


// Convierte expresiones tipo e^(...) a e^{...} y derivadas comunes a notación LaTeX
function autoLatexify(str) {
    if (!str || typeof str !== 'string') return str;
    let latex = str;
    // Derivadas de orden 2: d^2y/dt^2 => \frac{d^{2}y}{dt^{2}}
    latex = latex.replace(/d\^([0-9]+)([a-zA-Z])\/d([a-zA-Z])\^([0-9]+)/g, '\\frac{d^{$1}$2}{d$3^{$4}}');
    // Derivadas de primer orden: dy/dt => \frac{dy}{dt}
    latex = latex.replace(/d([a-zA-Z])\/d([a-zA-Z])/g, '\\frac{d$1}{d$2}');
    // Potencias tipo e^(...) => e^{...}
    latex = latex.replace(/e\^\(([^)]+)\)/g, 'e^{ $1 }');
    // Potencias tipo x^(...) => x^{...}
    latex = latex.replace(/([a-zA-Z0-9])\^\(([^)]+)\)/g, '$1^{ $2 }');
    // Potencias simples tipo x^2 => x^{2}
    latex = latex.replace(/([a-zA-Z0-9])\^([0-9]+)/g, '$1^{ $2 }');
    return latex;
}




// Renderizado mixto: solo las expresiones matemáticas se muestran como LaTeX, el texto normal es texto plano
function RenderMathContent({ content }) {
    if (!content || typeof content !== 'string') return null;

    // Patrón para detectar fragmentos matemáticos (derivadas, potencias, igualdades, fracciones, etc.)
    // Excluye palabras con tildes y caracteres especiales de español
    // Solo detecta paréntesis si contienen operadores matemáticos o números junto a variables
    const mathPattern = /((?:d\^\d+[a-zA-Z]\/d[a-zA-Z]\^\d+)|(?:d[a-zA-Z]\/d[a-zA-Z])|(?:[a-zA-Z0-9]\^\([^)]+\))|(?:[a-zA-Z0-9]\^\d+)|(?:e\^\([^)]+\))|(?:\\frac\{[^}]+\}\{[^}]+\})|(?:[=<>+\-*/^])|(?:\((?=[^)]*[=+\-*/^0-9])[a-zA-Z0-9=+\-*/^ .]+\))|(?:\d+\.?\d*))(?![áéíóúÁÉÍÓÚñÑüÜ])/g;

    let lastIndex = 0;
    const elements = [];
    let match;
    while ((match = mathPattern.exec(content)) !== null) {
        // Texto antes del fragmento matemático
        if (match.index > lastIndex) {
            const plain = content.slice(lastIndex, match.index);
            if (plain) {
                elements.push(<span key={lastIndex}>{plain}</span>);
            }
        }
        // Fragmento matemático convertido a LaTeX
        const latex = autoLatexify(match[0]);
        elements.push(<InlineMath key={match.index}>{latex}</InlineMath>);
        lastIndex = match.index + match[0].length;
    }
    // Texto restante después del último fragmento matemático
    if (lastIndex < content.length) {
        const plain = content.slice(lastIndex);
        if (plain) {
            elements.push(<span key={lastIndex}>{plain}</span>);
        }
    }
    return <>{elements}</>;
}

RenderMathContent.propTypes = {
    content: PropTypes.string
};

const Llama3Chat = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const chatContentRef = useRef(null);

    // Inicializa Groq con tu API Key del entorno
    // Asegúrate de que VITE_GROQ_API_KEY esté definida en tu archivo .env
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    const groq = apiKey ? new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Necesario para usarlo directamente en el navegador (solo para desarrollo/pruebas)
    }) : null;

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

        if (!apiKey || !groq) {
            const debugInfo = import.meta.env.DEV ? 
                `\nDebug Info:
                - API Key presente: ${apiKey ? 'Sí' : 'No'}
                - Valor: ${apiKey ? '✅ Configurada' : '❌ Vacía/Undefined'}
                - Entorno: ${import.meta.env.MODE}
                - Variables VITE disponibles: ${Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).join(', ') || 'Ninguna'}` 
                : '';
                
            setError(`🔑 API Key de Groq requerida
            
Para configurar:
📍 Desarrollo local: Crea archivo .env con VITE_GROQ_API_KEY=tu_key
📍 Producción: Configura el secreto VITE_GROQ_API_KEY en GitHub
📍 Obtén tu key en: https://console.groq.com/
${debugInfo}`);
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
                        {/* Debug info - solo visible en desarrollo */}
                        
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
                                    <RenderMathContent content={message.user} />
                                </div>
                            </div>
                            <div className="assistant-message">
                                <div className="message-header">
                                    <span className="message-sender">🤖 Asistente</span>
                                    <span className="message-time">{message.timestamp}</span>
                                </div>
                                <div className="message-content">
                                    <RenderMathContent content={message.showFullText ? message.fullAssistant : message.assistant} />
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