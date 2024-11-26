import React from "react";

function Registrarse() {
  return (
    <div className="container my-5">
      <h2 className="text-center" style={{ color: "#34495E" }}>
        Registrarse
      </h2>
      <form className="mx-auto mt-4" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre completo
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
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
            placeholder="Crea una contraseña"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmarPassword" className="form-label">
            Confirmar contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmarPassword"
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registrarse;

