import './Layout.css';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <div className="header-container">
                    <div className="logo-section">
                        <h1>🚀 TextIA</h1>
                        <span className="subtitle">Chat Inteligente</span>
                    </div>
                    {/* <nav className="navigation">
                        <button className="nav-item active">💬 Chat</button>
                        <button className="nav-item">📊 Estadísticas</button>
                        <button className="nav-item">⚙️ Configuración</button>
                    </nav> */}
                </div>
            </header>
            
            <main className="layout-main">
                <div className="main-container">
                    {children}
                </div>
            </main>
            
            <footer className="layout-footer">
                <div className="footer-container">
                    <p>&copy; 2025 TextIA - Potenciado por Inteligencia Artificial</p>
                    {/* <div className="footer-links">
                        <span>🔒 Privacidad</span>
                        <span>📋 Términos</span>
                        <span>❓ Ayuda</span>
                    </div> */}
                </div>
            </footer>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
