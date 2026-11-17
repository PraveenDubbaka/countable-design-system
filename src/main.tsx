import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyDemoAssignmentsPatch } from "./lib/demoAssignmentsPatch";

// One-time demo data for the stored lists; before the first render, so every page reads the patched records
applyDemoAssignmentsPatch();

createRoot(document.getElementById("root")!).render(
 <React.StrictMode>
 <App />
 </React.StrictMode>
);
