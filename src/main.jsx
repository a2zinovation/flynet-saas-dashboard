// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./AppProvider";
import App from "./App";
import "./styles.css"; // <-- important: Tailwind + global css
import 'leaflet/dist/leaflet.css';
import "react-quill/dist/quill.snow.css";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// src/main.jsx