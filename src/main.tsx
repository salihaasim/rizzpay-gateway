
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
  
  // Use production mode rendering without StrictMode in production
  // This prevents double-rendering which can slow down the application
  if (import.meta.env.DEV) {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    root.render(<App />);
  }
}
