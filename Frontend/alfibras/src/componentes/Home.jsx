import React from "react";
import Nosotros from "./Nosotros";
import Productos from "./Productos";
import Contacto from "./Contacto";
import Ubicacion from "./Ubicacion";

function Home() {
  const sectionStyle = {
    backgroundImage: 'url("https://rejiglass.com.mx/wp-content/uploads/2022/02/Como-trabajar-la-fibra-de-vidrio.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "50% 20%", // Ajusta la posición de la imagen
    color: "white",
    display: "flex", // Usar flexbox
    justifyContent: "center", // Centrado horizontal
    alignItems: "center", // Centrado vertical
    textAlign: "center",
    height: "80vh", // Altura completa de la pantalla
    fontFamily: "Optima, sans-serif",
  };
  

  return (
    <div>
      <div id="bienvenida" style={sectionStyle}>
  <div>
    <h1 className="text-white" style={{ marginBottom: "10px" }}>
      ¡Bienvenido a Alfibras!
    </h1>
    <p className="lead text-white" style={{ marginTop: "0" }}>
      Encuentra los mejores productos personalizados y con la mejor calidad.
    </p>
  </div>
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
