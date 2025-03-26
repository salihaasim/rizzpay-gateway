
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with proper error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element. The page cannot be rendered.");
} else {
  const root = createRoot(rootElement);
  
  // Wrap in error boundary for better debugging
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error rendering the application:", error);
    rootElement.innerHTML = '<div style="color: red; padding: 20px;">Application failed to load. Please check the console for errors.</div>';
  }
}
