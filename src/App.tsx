import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import LibraryPage from "@/pages/LibraryPage";
import FrankyAIPage from "@/pages/FrankyAIPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/franky-ai"
          element={
            <ProtectedRoute>
              <FrankyAIPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
