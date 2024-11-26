import React from "react";
import { Link } from "react-router-dom";

function IniciarSesion() {
  return (
    <div className="container my-5">
      <h2 className="text-center" style={{ color: "#34495E" }}>
        Iniciar Sesión
      </h2>
      <form className="mx-auto mt-4" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Ingresa tu correo"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </form>

      {/* Enlace al formulario de registro */}
      <div className="text-center mt-3">
        <p>¿No tienes una cuenta? <Link to="/registrarse">Registrarse</Link></p>
      </div>
    </div>
  );
}

export default IniciarSesion;

