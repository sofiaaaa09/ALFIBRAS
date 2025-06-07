import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../componentes/api';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth', { email, password });
      const { token, usuario } = response.data;

      if (!token || !usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('rol', usuario.rol || 'usuario');
      localStorage.setItem('userData', JSON.stringify(usuario));

      // Redirigir según el rol
      if (usuario.rol === 'admin') {
        navigate('/productos');
      } else if (usuario.rol === 'usuario') {
        navigate('/detalleorden');
      } else {
        navigate('/');
      }

      // Forzar actualización del navbar
      window.location.reload();

    } catch (err) {
      setError(err.response?.data?.message || 'Error en las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Iniciar Sesión</h2>
          <div style={dividerStyle}></div>
        </div>
        
        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
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
                <span style={{marginLeft: '8px'}}>Cargando...</span>
              </div>
            ) : 'Iniciar sesión'}
          </button>

          <div style={footerStyle}>
            <p style={registerTextStyle}>¿No tienes cuenta?</p>
            <a href="/registrarse" style={linkStyle}>
              Crear una cuenta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};


const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f7fa',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  ':hover': {
    transform: 'translateY(-5px)'
  }
};

const headerStyle = {
  padding: '25px 30px 15px',
  textAlign: 'center',
};

const titleStyle = {
  color: '#2C3E50',
  margin: '0',
  fontSize: '24px',
  fontWeight: '600',
};

const dividerStyle = {
  height: '3px',
  width: '60px',
  backgroundColor: '#2C3E50',
  margin: '15px auto',
  borderRadius: '3px',
};

const formStyle = {
  padding: '0 30px 30px',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#2C3E50',
  fontWeight: '500',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '8px',
  border: '1px solid #e0e4e8',
  backgroundColor: '#f9fafb',
  fontSize: '15px',
  transition: 'all 0.3s',
  ':focus': {
    borderColor: '#2C3E50',
    boxShadow: '0 0 0 3px rgba(44, 62, 80, 0.1)',
    outline: 'none',
    backgroundColor: '#fff',
  }
};

const errorStyle = {
  color: '#e74c3c',
  fontSize: '14px',
  margin: '10px 0',
  padding: '10px',
  backgroundColor: '#fdedec',
  borderRadius: '6px',
  textAlign: 'center',
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#2C3E50',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'all 0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ':hover': {
    backgroundColor: '#1a252f',
    transform: 'translateY(-2px)'
  },
  ':disabled': {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
    transform: 'none'
  }
};

const spinnerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const spinnerInnerStyle = {
  width: '18px',
  height: '18px',
  border: '3px solid rgba(255,255,255,0.3)',
  borderRadius: '50%',
  borderTopColor: '#fff',
  animation: 'spin 1s ease-in-out infinite',
};

const footerStyle = {
  marginTop: '20px',
  textAlign: 'center',
  paddingTop: '15px',
  borderTop: '1px solid #eee',
};

const registerTextStyle = {
  margin: '0 0 8px 0',
  color: '#7f8c8d',
  fontSize: '14px',
};

const linkStyle = {
  color: '#2C3E50',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'all 0.3s',
  ':hover': {
    color: '#1a252f',
    textDecoration: 'underline',
  }
};

export default IniciarSesion;