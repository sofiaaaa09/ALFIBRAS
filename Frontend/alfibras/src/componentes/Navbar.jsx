import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg"; // Ajusta la ruta según donde esté el logo

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#2C3E50', fontFamily: 'Optima, sans-serif' }}>
      <div className="container-fluid">
        {/* Logo de Alfibras */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Logo Alfibras"
            style={{ height: "60px", width: "auto", marginLeft: "10px" }}
          />
        </Link>
        
        {/* Barra de navegación con enlaces centrados */}
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/productos" style={{ color: 'white' }}>
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros" style={{ color: 'white' }}>
                ¿Quiénes somos?
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donde-encontrarnos" style={{ color: 'white' }}>
                ¿Dónde encontrarnos?
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto" style={{ color: 'white' }}>
                Contáctenos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/CRUD" style={{ color: 'white' }}>
                CRUD
              </Link>
            </li>
          </ul>
        </div>

        {/* Icono del carrito como botón de navegación */}
        <div className="navbar-nav me-auto">
          <Link to="/carrito" className="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-cart3" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
          </Link>
        </div>

        {/* Botones de inicio de sesión y registro */}
        <div className="d-flex">
          <Link className="btn btn-outline-light me-2" to="/Iniciar-Sesion">
            Iniciar sesión
          </Link>
          <Link className="btn btn-outline-light" to="/Registrarse">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

