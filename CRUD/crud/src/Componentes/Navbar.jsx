import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg"; // Ajusta la ruta según donde esté el logo

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        backgroundColor: "#2C3E50",
        fontFamily: "Optima, sans-serif",
        width: "100%", // Asegura que la navbar ocupe el 100% del ancho
        position: "fixed", // Fija la barra en la parte superior de la página
        top: "0",
        left: "0",
        zIndex: "1000", // Asegura que la navbar quede por encima del contenido
      }}
    >
      <div className="container-fluid" style={{ padding: 0, maxWidth: "100%" }}>
        {/* Logo de Alfibras */}
        <Link className="navbar-brand" to="/" style={{ paddingLeft: "10px" }}>
          <img
            src={logo}
            alt="Logo Alfibras"
            style={{
              height: "60px",
              width: "auto",
              marginLeft: "10px",
              maxWidth: "100%",
            }}
          />
        </Link>

        {/* Barra de navegación con enlaces centrados */}
        <div className="collapse navbar-collapse justify-content-center" style={{ width: "100%" }}>
          <ul className="navbar-nav" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <li className="nav-item">
              <Link className="nav-link" to="/productos" style={{ color: "white" }}>
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categoria" style={{ color: "white" }}>
                Categoria
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin" style={{ color: "white" }}>
                Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ordenes" style={{ color: "white" }}>
                Ordenes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Factura" style={{ color: "white" }}>
                Factura
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/DetalleOrden" style={{ color: "white" }}>
                Detalle Orden
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

