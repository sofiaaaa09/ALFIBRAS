import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:9001/api/clientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
  
        const decoded = JSON.parse(atob(data.token.split('.')[1])); // Decodifica el token
  
        if (decoded.role === 'admin') {
          navigate('/admin'); // Redirige al panel de admin
        } else {
          navigate('/productos'); // Redirige a productos para usuarios normales
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema con el servidor. Inténtalo más tarde.");
    }
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form
        onSubmit={handleLogin}
        style={{
          width: '300px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>
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
          <label>Contraseña</label>
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
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default IniciarSesion;
