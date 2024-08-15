import React from "react";
import { Navigate } from "react-router-dom";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const PrivateRoute = ({ children }) => {
  const token = getCookie("jwt");
  const isAuthenticated = Boolean(token);

  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
