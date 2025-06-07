import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const userData = JSON.parse(localStorage.getItem('userData'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/iniciar-sesion');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </Link>

        {/* Menú central  */}
        <div style={styles.menu}>
          {rol === 'admin' && (
            <>
              <Link to="/categoria" style={styles.navLink}>Categorías</Link>
              <Link to="/productos" style={styles.navLink}>Productos</Link>
              <Link to="/inventario" style={styles.navLink}>Inventario</Link>
              <Link to="/ordenes" style={styles.navLink}>Órdenes</Link>
              <Link to="/detalleOrden" style={styles.navLink}>Detalle Orden</Link>
            </>
          )}
          {rol === 'usuario' && (
            <Link to="/detalleorden" style={styles.navLink}>Mis Pedidos</Link>
          )}
          
        </div>

        {/* Sección de usuario */}
        <div style={styles.authSection}>
          {userData ? (
            <>
              <span style={styles.userWelcome}>Hola, {userData.nombre}</span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/Iniciar-Sesion" style={styles.authLink}>
                Iniciar sesión
              </Link>
              <Link to="/registrarse" style={styles.authLink}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#2C3E50',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    padding: '0.5rem 0'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  menu: {
    display: 'flex',
    gap: '1.5rem'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s',
    ':hover': {
      color: '#3498db'
    }
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userWelcome: {
    color: 'white',
    marginRight: '1rem'
  },
  logoutButton: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  authLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  }
};

export default Navbar;