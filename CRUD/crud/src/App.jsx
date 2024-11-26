import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Componentes/Navbar';
import Productos from './Componentes/Productos';
import Inventario from './Componentes/Inventario';
import Ordenes from './Componentes/Ordenes';
import Categoria from './Componentes/Categoria';
import Clientes from './Componentes/Clientes';
import Carrito from './Componentes/Carrito';
import Admin from './Componentes/Admin';
import Factura from './Componentes/Factura';
import DetalleOrden from './Componentes/DetalleOrden';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/productos" element={<Productos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/Factura" element={<Factura />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/DetalleOrden" element={<DetalleOrden />} />
      </Routes>
    </Router>
  );
}

export default App;

