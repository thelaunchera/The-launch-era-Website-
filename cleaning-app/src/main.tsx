import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { finishAuthRedirect } from "./lib/supabase";

async function start() {
  try {
    await finishAuthRedirect();
  } catch (error) {
    console.error("Auth redirect failed", error);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

void start();
