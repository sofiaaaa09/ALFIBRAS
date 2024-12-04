import React from "react";
import { Route, Navigate } from "react-router-dom";

function ProtectedRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem("token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificar token
      isAuthenticated = !!decoded; // Si el token es válido, lo consideramos autenticado
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem("token"); // Eliminar el token si no es válido
    }
  }

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/iniciar-sesion" replace />
  );
}

export default ProtectedRoute;


