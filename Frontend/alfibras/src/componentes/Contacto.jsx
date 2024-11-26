import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';  // Importamos el ícono de WhatsApp
import React from 'react';

const Contacto = () => {
  const sectionStyle = {
    padding: '40px 20px',
    textAlign: 'center',
  };

  const headerStyle = {
    color: '#004080',
  };

  const socialIconsStyle = {
    marginTop: '20px',
  };

  const iconStyle = {
    color: '#004080',
    margin: '0 10px',
    fontSize: '2rem',
  };

  return (
    <section style={sectionStyle} id="contacto">
      <h2 style={headerStyle}>Contáctenos</h2>
      <div style={socialIconsStyle}>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook style={iconStyle} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram style={iconStyle} />
        </a>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"> {/* Cambia el número por el tuyo */}
          <FaWhatsapp style={iconStyle} />
        </a>
      </div>
    </section>
  );
};

export default Contacto;



