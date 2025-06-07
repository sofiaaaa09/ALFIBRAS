import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";
import Categoria from "./Categoria";
import DetalleOrden from "./DetalleOrden";
import Home from "./Home";
import IniciarSesion from "./IniciarSesion";
import Navbar from "./Navbar";
import Ordenes from "./Ordenes";
import Productos from "./Productos";
import Inventario from "./Inventario";
import Registrarse from "./Registrarse";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Componente ProtectedRoute integrado
  const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('rol');
    
    if (!token) {
      return <Navigate to="/iniciar-sesion" replace />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = location.pathname;
    const publicRoutes = ['/', '/iniciar-sesion', '/registrarse'];

    if (!token && !publicRoutes.includes(currentPath)) {
      navigate('/iniciar-sesion', { replace: true });
      return;
    }

    if (token && (currentPath === '/iniciar-sesion' || currentPath === '/registrarse')) {
      const userRole = localStorage.getItem('rol');
      navigate(userRole === 'admin' ? '/productos' : '/', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/registrarse" element={<Registrarse />} />
          
          {/* Rutas protegidas */}
          <Route path="/productos" element={
            <ProtectedRoute requiredRole="admin">
              <Productos />
            </ProtectedRoute>
          } />
          <Route path="/categoria" element={
            <ProtectedRoute requiredRole="admin">
              <Categoria />
            </ProtectedRoute>
          } />
          <Route path="/ordenes" element={
            <ProtectedRoute requiredRole="admin">
              <Ordenes />
            </ProtectedRoute>
          } />
          <Route path="/inventario" element={
            <ProtectedRoute requiredRole="admin">
              <Inventario />
            </ProtectedRoute>
          } />
          <Route path="/detalleorden" element={
            <ProtectedRoute requiredRole="usuario">
              <DetalleOrden />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
