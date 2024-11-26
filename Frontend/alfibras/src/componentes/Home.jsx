import React from 'react';

function Home() {
  const sectionStyle = {
    backgroundImage: 'url("https://www.a-alvarez.com/img/ybc_blog/post/repararbarco-e1666702460178.jpg")',  // Reemplaza con tu imagen de fondo
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    textAlign: 'center',
    paddingTop: '100px',  // Ajuste para dar espacio arriba
    paddingBottom: '100px',  // Ajuste para dar espacio abajo
    position: 'relative',
    fontFamily: 'Optima, sans-serif',  // Aplicando la fuente Verdana
  };

  return (
    <div id="home" style={sectionStyle}>
      <div className="container">
        <h1 className="text-white">¡Bienvenido a Alfibras!</h1>
        <p className="lead text-white">Encuentra los mejores productos personalizados y con la mejor calidad.</p>
      </div>
    </div>
  );
}

export default Home;


