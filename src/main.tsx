
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root without any branding wrappers
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
