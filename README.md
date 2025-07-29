# 🤖 TextIA - Chat Inteligente

Una aplicación de chat moderna que utiliza Llama 3 a través de Groq para generar respuestas inteligentes.

## ✨ Características

- 💬 Chat en tiempo real con IA
- 📱 Diseño responsive y moderno
- 🎨 Interfaz elegante con glassmorphism
- 📖 Funcionalidad "Ver más" para respuestas largas
- 🗑️ Limpieza de historial
- ⌨️ Envío con Enter (Shift+Enter para nueva línea)

## 🚀 Configuración

### Desarrollo Local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/maibarra0904/chatIa.git
   cd chatIa
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` y agrega tu API key de Groq:
   ```
   VITE_GROQ_API_KEY=tu_groq_api_key_aqui
   ```

4. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```

### 🌐 Deploy a GitHub Pages

1. **Configura el secreto en GitHub**
   - Ve a Settings > Secrets and variables > Actions
   - Agrega un nuevo secreto: `VITE_GROQ_API_KEY`
   - Valor: tu API key de Groq

2. **Deploy automático**
   - Cada push a `main` ejecuta el deploy automáticamente
   - La app estará disponible en: `https://tuusuario.github.io/chatIa/`

## 🔧 Solución de problemas

### Error: "API Key de Groq no encontrada"

**En desarrollo local:**
- Verifica que existe el archivo `.env`
- Asegúrate de que la variable se llama exactamente `VITE_GROQ_API_KEY`
- Reinicia el servidor de desarrollo (`npm run dev`)

**En producción (GitHub Pages):**
- Verifica que el secreto `VITE_GROQ_API_KEY` está configurado en GitHub
- Asegúrate de que el valor no tiene espacios al inicio/final
- Vuelve a hacer deploy con un nuevo commit

### Verificar configuración
```bash
# Ejecuta el script de verificación (Linux/Mac)
chmod +x scripts/check-env.sh
./scripts/check-env.sh
```

## 🛠️ Tecnologías

- ⚛️ React 18
- ⚡ Vite
- 🎨 CSS moderno con gradientes
- 🤖 Groq SDK para Llama 3
- 🚀 GitHub Actions para deploy

## 📝 Obtener API Key de Groq

1. Ve a [Groq Console](https://console.groq.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el dashboard
4. Crea una nueva API key
5. Copia la key y úsala en tu configuración

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para detalles.
