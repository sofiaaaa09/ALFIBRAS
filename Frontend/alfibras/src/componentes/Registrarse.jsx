import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registrarse = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9001/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, telefono, direccion, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/iniciar-sesion'); // Redirigir al login
      } else {
        setError(data.message || 'Hubo un error al registrar el usuario');
      }
    } catch (err) {
      console.error("Error al registrarse:", err);
      setError("Hubo un problema con el servidor. Inténtalo más tarde.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form
        onSubmit={handleRegister}
        style={{
          width: '300px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Registrarse</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              margin: '5px 0',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              margin: '5px 0',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              margin: '5px 0',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              margin: '5px 0',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              margin: '5px 0',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: '10px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2C3E50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registrarse;
