import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Ionicons as web components (one-time, global)
import { defineCustomElements } from "ionicons/loader";
defineCustomElements(window);

createRoot(document.getElementById("root")!).render(<App />);
