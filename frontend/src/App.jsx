import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This ensures useNavigate is used inside a Router context
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/users/isLoggedIn",
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }
        );

        const data = await response.json();

        if (data.status === "success" && data.loggedIn) {
          setIsAuthenticated(true);
          navigate("/home"); // Redirect to home if logged in
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path='/'
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
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
        element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />}
      />
      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
      />
    </Routes>
  );
};

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
