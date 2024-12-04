import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificamos el token JWT
      isAuthenticated = !!decoded; // Si el token es válido, lo consideramos autenticado
      isAdmin = decoded.role === "admin"; // Verificamos si el usuario es administrador
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem("token"); // Eliminamos el token si es inválido
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminamos el token del localStorage
    navigate("/iniciar-sesion"); // Redirigimos al formulario de inicio de sesión
  };

  const handleNavigation = (route) => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirige al inicio de sesión
      navigate("/iniciar-sesion");
    } else {
      navigate(route); // Si está autenticado, navega a la ruta
    }
  };

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

        {/* Navegación */}
        <div className="collapse navbar-collapse justify-content-center" style={{ width: "100%" }}>
          <ul className="navbar-nav" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => handleNavigation("/productos")}
              >
                Productos
              </a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => handleNavigation("/categoria")}
                >
                  Categoría
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => handleNavigation("/ordenes")}
              >
                Órdenes
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => handleNavigation("/factura")}
              >
                Facturas
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => handleNavigation("/detalleorden")}
              >
                Detalles de Órdenes
              </a>
            </li>
          </ul>
        </div>

        {/* Botones de sesión */}
        <div className="d-flex">
          {isAuthenticated ? (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/iniciar-sesion">
                Iniciar sesión
              </Link>
              <Link className="btn btn-outline-light" to="/registrarse">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
