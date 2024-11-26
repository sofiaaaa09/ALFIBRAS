import React from 'react';

function Nosotros() {
  
  const sectionStyle = {
    backgroundColor: '', 
    color: '#2C3E50',  
    paddingTop: '50px',  // Espaciado superior
    paddingBottom: '50px',  // Espaciado inferior
    textAlign: 'center',
  };

  const headerStyle = {
    fontSize: '2.5rem',  // Tamaño grande para el encabezado
    marginBottom: '30px',  // Espaciado inferior
  };

  const textStyle = {
    fontSize: '1.2rem',  // Tamaño de fuente
    lineHeight: '1.8',  // Espaciado entre líneas
    maxWidth: '1300px',  // Aumentamos el ancho máximo para llegar a la longitud deseada
    margin: '0 auto',  // Centrado del texto
    paddingLeft: '20px',
    paddingRight: '20px',
    textAlign: 'center', 
    justifyContent: 'center',  // Centrar contenido horizontalmente
    alignItems: 'center',
  };

  const boxStyle = {
    backgroundColor: '#34495E',  // Fondo gris oscuro para los cuadros
    padding: '30px',  // Espaciado interno
    marginBottom: '20px',  // Espaciado inferior
    borderRadius: '8px',  // Bordes redondeados
    color: 'white',  // Texto blanco
  };

  const twoBoxContainer = {
    display: 'flex',  // Flexbox para alinear los dos cuadros
    justifyContent: 'space-between',  // Espacio entre los cuadros
    gap: '20px',  // Espacio entre los cuadros
  };

  return (
    <div id="nosotros" style={sectionStyle}>
      <div className="container">
        {/* Sección principal con texto */}
        <h2 style={headerStyle}>¿QUÍENES SOMOS?</h2>
        <p style={textStyle}>
          Alfibras es una empresa con una sólida trayectoria en la fabricación y comercialización de productos de fibra de vidrio, destacándose en diversos sectores como el industrial, automotriz y de construcción.
          En el sector industrial, ofrecemos soluciones robustas que cumplen con los más altos estándares de durabilidad y rendimiento. Para el sector automotriz, nuestros componentes mejoran el rendimiento y la estética de los vehículos, incluyendo parachoques, capós y alerones.
          En el ámbito de campamento y obras civiles, proporcionamos productos versátiles y duraderos para aplicaciones temporales y permanentes, como estructuras de soporte y recubrimientos.
          Comprometidos con la innovación y la calidad, en Alfibras nos esforzamos por ofrecer soluciones personalizadas que satisfagan las necesidades específicas de nuestros clientes, asegurando la máxima satisfacción y un rendimiento óptimo en cada producto.
        </p><br></br>
        

        <div style={twoBoxContainer}>
          {/* Cuadro de Misión */}
          <div style={{ ...boxStyle, width: '48%' }}>
            <h2>Misión</h2>
            <p>ALFIBRAS es una microempresa, que busca proporcionar productos en fibra de vidrio, acorde con las exigencias del mercado satisfaciendo los gustos y expectativas de los consumidores, permitiendo el crecimiento institucional e integrarnos en la búsqueda de un desarrollo nacional.</p>
          </div>
          
          {/* Cuadro de Visión */}
          <div style={{ ...boxStyle, width: '48%' }}>
            <h2>Visión</h2>
            <p>Ser reconocidos como grandes productores de artículos en fibra de vidrio, implementando procesos de perfeccionamiento e innovación en el mercado y así en un futuro convertirnos en lideres y gestores de procesos manufactureros.​</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;

