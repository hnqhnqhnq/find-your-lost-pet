// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExpiredTokenModal from "./components/ExpiredTokenModal";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, isCheckingStatus, logout } = useAuth();

  if (isCheckingStatus) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <Navigate to='/home' />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />}
        />
        <Route
          path='/signup'
          element={isAuthenticated ? <Navigate to='/home' /> : <SignUpPage />}
        />
        <Route
          path='/home'
          element={
            isAuthenticated ? (
              <HomePage onSignOut={logout} />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route
          path='/profile'
          element={isAuthenticated ? <ProfilePage /> : <Navigate to='/login' />}
        />
        <Route
          path='*'
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
      </Routes>
    </>
  );
};

export default function WrappedApp() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
