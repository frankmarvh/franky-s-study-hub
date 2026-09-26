import React from "react";
import ReactDOM from "react-dom/client";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";

import {
  AuthProvider,
} from "@/hooks/useAuth";

import {
  ThemeProvider,
} from "@/context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById(
    "root",
  )!,
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />

        <Toaster
          position="top-right"
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
