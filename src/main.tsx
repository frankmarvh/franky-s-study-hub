import React from "react";
import ReactDOM from "react-dom/client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";
import "./index.css";

import {
  AuthProvider,
} from "@/hooks/useAuth";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

const root =
  document.getElementById("root");

if (!root) {
  throw new Error(
    'Root element "#root" was not found.',
  );
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider
      client={queryClient}
    >
      <AuthProvider>
        <App />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,

            style: {
              background: "#0f172a",
              color: "#ffffff",
              border:
                "1px solid #334155",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
