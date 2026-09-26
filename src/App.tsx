import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import HomePage
  from "@/pages/HomePage";

import AuthPage
  from "@/pages/AuthPage";

import LibraryPage
  from "@/pages/LibraryPage";

import SavedMaterialsPage
  from "@/pages/SavedMaterialsPage";

import FrankyAIPage
  from "@/pages/FrankyAIPage";

import ProfilePage
  from "@/pages/ProfilePage";

import SettingsPage
  from "@/pages/SettingsPage";

import AdminPage
  from "@/pages/AdminPage";

import AboutPage
  from "@/pages/AboutPage";

import ContactPage
  from "@/pages/ContactPage";

import PrivacyPage
  from "@/pages/PrivacyPage";

import TermsPage
  from "@/pages/TermsPage";

import NotFoundPage
  from "@/pages/NotFoundPage";

import ProtectedRoute
  from "@/components/ProtectedRoute";

import AdminRoute
  from "@/components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/auth"
          element={
            <AuthPage />
          }
        />

        <Route
          path="/about"
          element={
            <AboutPage />
          }
        />

        <Route
          path="/contact"
          element={
            <ContactPage />
          }
        />

        <Route
          path="/privacy"
          element={
            <PrivacyPage />
          }
        />

        <Route
          path="/terms"
          element={
            <TermsPage />
          }
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
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedMaterialsPage />
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
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
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
          element={
            <NotFoundPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
