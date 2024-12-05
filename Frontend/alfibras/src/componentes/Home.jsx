import React from "react";
import Nosotros from "./Nosotros";
import Productos from "./Productos";
import Contacto from "./Contacto";
import Ubicacion from "./Ubicacion";

function Home() {
  const sectionStyle = {
    backgroundImage: 'url("https://www.a-alvarez.com/img/ybc_blog/post/repararbarco-e1666702460178.jpg")', // Reemplaza con tu imagen de fondo
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    textAlign: "center",
    paddingTop: "100px",
    paddingBottom: "100px",
    fontFamily: "Optima, sans-serif",
  };

  return (
    <div>
      {/* Bienvenida */}
      <div id="bienvenida" style={sectionStyle}>
        <h1 className="text-white">¡Bienvenido a Alfibras!</h1>
        <p className="lead text-white">Encuentra los mejores productos personalizados y con la mejor calidad.</p>
      </div>


      <section id="nosotros" style={{ padding: "50px 20px", textAlign: "center", backgroundColor: "#f8f9fa" }}>
        <Nosotros />
      </section>

      <section id="productos" style={{ padding: "50px 20px", textAlign: "center" }}>

        <Productos />
      </section>

      <section id="contacto" style={{ padding: "50px 20px", textAlign: "center", backgroundColor: "#f8f9fa" }}>

        <Contacto />
      </section>

      <section id="ubicacion" style={{ padding: "50px 20px", textAlign: "center" }}>
        <Ubicacion />
      </section>
    </div>
  );
}

export default Home;
