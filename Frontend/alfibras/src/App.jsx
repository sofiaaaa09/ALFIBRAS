import { Routes, Route, Link } from "react-router-dom"; 
import './App.css'; 
import Navbar from './componentes/Navbar';
import Nosotros from './componentes/Nosotros';
import Contacto from './componentes/Contacto';
import Footer from './componentes/Footer';
import Ubicacion from './componentes/Ubicacion';
import IniciarSesion from './componentes/IniciarSesion';
import Registrarse from './componentes/Registrarse';
import Home from "./componentes/Home";
import Productos from "./componentes/Productos"; 

function App() {
  return (
    <div>
      {/* Barra de navegación */}
      <Navbar />

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />}/>
        <Route path="/registrarse" element={<Registrarse />} /> {/* Ruta para la página de registro */}
        </Routes>
        <Nosotros/>
        <Productos/>
        <Contacto/>
        <Ubicacion/>
      <Footer />
    </div>
  );
}

export default App;

