import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import Firebase config to ensure Firebase initializes
import "./config/firebase";
console.log("Firebase initialized");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
