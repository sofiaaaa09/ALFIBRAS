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
        width: "100%",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "1000",
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
        <div
          className="collapse navbar-collapse justify-content-center"
          style={{ width: "100%" }}
        >
          <ul
            className="navbar-nav"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <li className="nav-item">
              <Link className="nav-link" to="/categoria" style={{ color: "white" }}>
                Categoría
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos2" style={{ color: "white" }}>
                Productos
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/admin" style={{ color: "white" }}>
                Admin
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/ordenes" style={{ color: "white" }}>
                Órdenes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/detalleorden" style={{ color: "white" }}>
                Detalles de Órdenes
              </Link>
            </li>
          </ul>
        </div>

        {/* Botones de sesión */}
        <div className="d-flex">
          <Link className="btn btn-outline-light me-2" to="/iniciar-sesion">
            Iniciar sesión
          </Link>
          <Link className="btn btn-outline-light" to="/registrarse">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
