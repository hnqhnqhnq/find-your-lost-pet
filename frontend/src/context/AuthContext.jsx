import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExpiredTokenModal from "./../components/ExpiredTokenModal";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [manualLogout, setManualLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/isLoggedIn",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.loggedIn) {
          if (!isAuthenticated) {
            setIsAuthenticated(true);
          }
        } else {
          if (isAuthenticated && !manualLogout) {
            setIsAuthenticated(false);
            setShowModal(true);
            navigate("/login");
          }
        }
      } else {
        if (isAuthenticated && !manualLogout) {
          setIsAuthenticated(false);
          setShowModal(true);
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      if (isAuthenticated && !manualLogout) {
        setIsAuthenticated(false);
        setShowModal(true);
        navigate("/login");
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        checkLoginStatus();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/signup") {
      checkLoginStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [location.pathname]);

  const logout = async () => {
    setManualLogout(true);
    await fetch("http://localhost:3000/api/v1/users/signoutUser", {
      method: "GET",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setShowModal(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingStatus,
        showModal,
        setShowModal,
        logout,
      }}
    >
      {children}
      {showModal && (
        <div>
          <ExpiredTokenModal onClose={() => setShowModal(false)} />
        </div>
      )}
    </AuthContext.Provider>
  );
};
