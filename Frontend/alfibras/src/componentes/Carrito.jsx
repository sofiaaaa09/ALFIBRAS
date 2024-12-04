import React from "react";

const Carrito = ({ productos, setProductos }) => {
  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const estilos = {
    contenedor: {
      padding: "20px",
      maxWidth: "400px",
      margin: "auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    titulo: {
      textAlign: "center",
      color: "#333",
    },
    lista: {
      listStyle: "none",
      padding: 0,
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #ddd",
    },
    botonEliminar: {
      backgroundColor: "#ff4d4f",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "5px 10px",
      cursor: "pointer",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Carrito de Compras</h2>
      {productos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>El carrito está vacío.</p>
      ) : (
        <ul style={estilos.lista}>
          {productos.map((producto) => (
            <li key={producto.id} style={estilos.item}>
              {producto.nombre} - ${producto.precio} x {producto.cantidad}
              <button
                style={estilos.botonEliminar}
                onClick={() => eliminarProducto(producto.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Carrito;
