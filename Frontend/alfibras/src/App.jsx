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
import Productos from "./componentes/Productos2";
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
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/productos2" element={<Productos />} />
          <Route path="/detalleorden" element={<DetalleOrden />} />
          <Route path="/factura" element={<Factura />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
