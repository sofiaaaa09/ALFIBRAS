import React from 'react';

function Ubicacion() {
  return (
    <div id="ubicacion" className="bg-light py-5">
      <div className="container">
        <h2 className="text-center" style={{ color: '#34495E' }}>Dónde encontrarnos</h2>
        <p className="text-center">Visítanos en nuestra ubicación o contáctanos directamente.</p>
        <div className="text-center">
          {/* El iframe de Google Maps para mostrar la ubicación */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.376463349006!2d-74.13516052628007!3d4.704491741627292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9cac4b852bdf%3A0x233b60857ba152a9!2sCl.%2065a%20%23111b73%2C%20Bogot%C3%A1!5e0!3m2!1ses-419!2sco!4v1732127747957!5m2!1ses-419!2sco" 
            width="100%" // Ocupa todo el ancho disponible
            height="450" // Establecemos una altura fija
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Ubicacion;
