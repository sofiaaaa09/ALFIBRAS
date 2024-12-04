import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Admin from "./componentes/Admin";
import Carrito from "./componentes/Carrito";
import Categoria from "./componentes/Categoria";
import DetalleOrden from "./componentes/DetalleOrden";
import Factura from "./componentes/Factura";
import Footer from "./componentes/Footer";
import Home from "./componentes/Home";
import IniciarSesion from "./componentes/IniciarSesion";
import Navbar from "./componentes/Navbar";
import Ordenes from "./componentes/Ordenes";
import Productos from "./componentes/Productos";
import ProtectedRoute from "./componentes/ProtectedRoute"; 
import Registrarse from "./componentes/Registrarse";

function App() {
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
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detalleorden"
            element={
              <ProtectedRoute>
                <DetalleOrden />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factura"
            element={
              <ProtectedRoute>
                <Factura />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <Ordenes />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas solo para admin */}
          <Route
            path="/categoria"
            element={
              <ProtectedRoute role="admin">
                <Categoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
