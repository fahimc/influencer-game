import React from "react";
import { createRoot } from "react-dom/client";
import StarSparkGame from "../app/StarSparkGame";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StarSparkGame />
  </React.StrictMode>,
);
