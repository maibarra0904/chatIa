import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import DownloadWord from "./Word";
import GenerarDocumento from "./Oficio";

const tableData = [
  ["Header 1", "Header 2", "Header 3"],
  ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
  ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
];

const Gemini = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null); // State to store any errors

  // Accessing environment variable for API key
  // Ensure your .env file in the project root has VITE_API_GEMINI_KEY="YOUR_API_KEY"
  const apiKey = import.meta.env.VITE_API_GEMINI_KEY;

  // Initialize Generative AI only if the API key is available
  // This prevents issues if the key isn't loaded yet
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  // Get the model, but only if genAI is initialized
  const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError(null);
    // Check if the model is initialized before making the API call
    if (!model) {
      setError("API Key not loaded or Gemini model not initialized.");
      return;
    }

    try {
      // The prompt you send to the Gemini model
      const prompt =
        "Muestra 3 ideas de temas de proyectos considerando qué se va a hacer y para qué se va a hacer, muestra solo el tema y no otros aspectos, excluye la palabra 'Respuesta' y presenta en negritas los numeros de cada propuesta: " +
        input;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Access the text content from the response
      setOutput(response.text());
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate content. Please try again. " + err.message);
    }
  };

  return (
    <>
      <h1>Gemini</h1>
      <div>
        <input
          type="text"
          value={input}
          placeholder="Enter your prompt here..."
          onChange={handleInputChange}
          aria-label="Enter your prompt for Gemini" // Added for accessibility
        />
        <button onClick={handleSubmit} disabled={!input}>
          {" "}
          {/* Disable button if input is empty */}
          Generate
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Display error message */}

      {output && (
        <>
          <p>
            **Respuesta:** {output}
          </p>
          {/* Your commented-out textarea was fine, uncomment if you prefer it */}
          {/* <textarea
                        className='h-10'
                        type='text'
                        value={output}
                        onChange={handleOutputChange} // If you uncomment, you'll need handleOutputChange back
                        readOnly // Make it readOnly if you don't want direct user editing
                    /> */}
          {output !== "" && (
            <DownloadWord
              title="Hello World"
              content={output}
              tableData={tableData}
            />
          )}
        </>
      )}

      {/* Other components */}
      <GenerarDocumento />
      {/* <MapComponent />
      <WazeMap lat={-2.145092669307672} lng={-79.57392191663357} /> */}
    </>
  );
};

export default Gemini;