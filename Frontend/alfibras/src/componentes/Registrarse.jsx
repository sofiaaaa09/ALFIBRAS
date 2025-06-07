import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../componentes/api';

const Registrarse = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/clientes', {
        nombre,
        email,
        telefono: Number(telefono),
        direccion,
        password,
      });

      if (response.status === 201) {
        navigate('/iniciar-sesion', { state: { registrationSuccess: true } });
      } else {
        setError(response.data?.message || 'Hubo un error al registrar el usuario');
      }
    } catch (err) {
      console.error('Error al registrarse:', err);
      setError(err.response?.data?.message || 'Hubo un problema con el servidor. Inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Crear Cuenta</h2>
          <div style={dividerStyle}></div>
        </div>
        
        <form onSubmit={handleRegister} style={formStyle}>
          <div style={inputGroupStyle}>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={inputStyle}
              placeholder="Nombre completo"
            />
          </div>

          <div style={inputGroupStyle}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="Correo electrónico"
            />
          </div>

          <div style={inputGroupStyle}>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/, ''))}
              required
              style={inputStyle}
              placeholder="Teléfono"
            />
          </div>

          <div style={inputGroupStyle}>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              style={inputStyle}
              placeholder="Dirección"
            />
          </div>

          <div style={inputGroupStyle}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Contraseña"
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={spinnerStyle}>
                <div style={spinnerInnerStyle}></div>
              </div>
            ) : 'Registrarse'}
          </button>

          <div style={footerStyle}>
            <p style={loginTextStyle}>¿Ya tienes cuenta? <a href="/iniciar-sesion" style={linkStyle}>Iniciar sesión</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos más compactos
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f7fa',
  padding: '15px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '380px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const headerStyle = {
  padding: '20px 25px 10px',
  textAlign: 'center',
};

const titleStyle = {
  color: '#2C3E50',
  margin: '0',
  fontSize: '20px',
  fontWeight: '600',
};

const dividerStyle = {
  height: '2px',
  width: '50px',
  backgroundColor: '#2C3E50',
  margin: '10px auto',
  borderRadius: '2px',
};

const formStyle = {
  padding: '0 25px 25px',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e0e4e8',
  backgroundColor: '#f9fafb',
  fontSize: '14px',
  transition: 'all 0.2s',
  ':focus': {
    borderColor: '#2C3E50',
    boxShadow: '0 0 0 2px rgba(44, 62, 80, 0.1)',
    outline: 'none',
    backgroundColor: '#fff',
  }
};

const errorStyle = {
  color: '#e74c3c',
  fontSize: '13px',
  margin: '8px 0',
  padding: '8px',
  backgroundColor: '#fdedec',
  borderRadius: '4px',
  textAlign: 'center',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#2C3E50',
  color: 'white',
  fontSize: '14px',
  fontWeight: '600',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'all 0.2s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ':hover': {
    backgroundColor: '#1a252f',
  },
  ':disabled': {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  }
};

const spinnerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const spinnerInnerStyle = {
  width: '16px',
  height: '16px',
  border: '2px solid rgba(255,255,255,0.3)',
  borderRadius: '50%',
  borderTopColor: '#fff',
  animation: 'spin 1s ease-in-out infinite',
};

const footerStyle = {
  marginTop: '15px',
  textAlign: 'center',
  paddingTop: '12px',
  borderTop: '1px solid #eee',
  fontSize: '13px',
};

const loginTextStyle = {
  margin: '0',
  color: '#7f8c8d',
};

const linkStyle = {
  color: '#2C3E50',
  fontWeight: '600',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  }
};

export default Registrarse;