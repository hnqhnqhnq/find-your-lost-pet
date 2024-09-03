import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import ChangeData from "./pages/ChangeDataPage";
import ChangePassword from "./pages/ChangePasswordPage";
import ExpiredTokenModal from "./components/ExpiredTokenModal";
import ClipLoader from "react-spinners/ClipLoader";
import PostsPage from "./pages/PostsPage";
import MessagesPage from "./pages/MessagesPage";
import CreatePostPage from "./pages/CreatePostPage";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isManualSignOut, setIsManualSignOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/users/isLoggedIn",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          if (
            !isManualSignOut &&
            location.pathname !== "/login" &&
            location.pathname !== "/signup"
          ) {
            setShowModal(true);
            setIsAuthenticated(false);
            navigate("/login");
          }
        } else if (response.ok) {
          const data = await response.json();

          if (data.status === "success" && data.loggedIn) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    const intervalId = setInterval(checkLoginStatus, 1000 * 60 * 60 * 24);

    return () => clearInterval(intervalId);
  }, [location.pathname, navigate, isManualSignOut]);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsManualSignOut(false);
  };

  const handleSignOut = async () => {
    setIsManualSignOut(true);
    await fetch("http://localhost:5000/api/v1/users/signoutUser", {
      method: "GET",
      credentials: "include",
    });
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color='#09f' loading={isLoading} size={50} />
      </div>
    );
  }

  return (
    <>
      {showModal && <ExpiredTokenModal onClose={handleCloseModal} />}
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
          element={
            isAuthenticated ? (
              <HomePage onSignOut={handleSignOut} />
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
          path='/profile/changedata'
          element={isAuthenticated ? <ChangeData /> : <Navigate to='/login' />}
        />
        <Route
          path='/profile/changepassword'
          element={
            isAuthenticated ? <ChangePassword /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/profile/:id'
          element={
            isAuthenticated ? <UserProfilePage /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/posts'
          element={isAuthenticated ? <PostsPage /> : <Navigate to='/login' />}
        />
        <Route
          path='/createPost'
          element={
            isAuthenticated ? <CreatePostPage /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/messages'
          element={
            isAuthenticated ? <MessagesPage /> : <Navigate to='/login' />
          }
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
      <App />
    </Router>
  );
}
