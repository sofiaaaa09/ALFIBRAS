import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DetalleOrden() {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // Cargar los productos disponibles
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/productos");
        setProductos(response.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos");
      }
    };

    fetchProductos();
  }, []);

  // Autocompletar campos de categoría y precio al seleccionar producto
  useEffect(() => {
    if (productoSeleccionado) {
      const producto = productos.find(
        (p) => p.numero_producto === parseInt(productoSeleccionado)
      );
      if (producto) {
        setCategoriaNombre(producto.categoria);
        setPrecioUnitario(producto.precio);
      }
    }
  }, [productoSeleccionado, productos]);

  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad < 1) {
      setError("Seleccione un producto y una cantidad válida.");
      return;
    }

    const producto = productos.find(
      (p) => p.numero_producto === parseInt(productoSeleccionado)
    );

    if (producto) {
      const nuevoDetalle = {
        numero_producto: producto.numero_producto,
        producto_nombre: producto.nombre,
        categoria_nombre: producto.categoria,
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precioUnitario),
        personalizacion,
        archivo: archivo || null,
      };

      setDetallesSeleccionados((prev) => [...prev, nuevoDetalle]);
      setTotal((prevTotal) => prevTotal + nuevoDetalle.cantidad * nuevoDetalle.precio_unitario);
      limpiarCampos();
    }
  };

  const eliminarDetalle = (index) => {
    const detalleEliminado = detallesSeleccionados[index];
    setDetallesSeleccionados((prev) =>
      prev.filter((_, i) => i !== index)
    );
    setTotal((prevTotal) => prevTotal - detalleEliminado.cantidad * detalleEliminado.precio_unitario);
  };

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();
    setError("");

    if (detallesSeleccionados.length === 0) {
      setError("Debe agregar al menos un detalle.");
      return;
    }

    const datosOrden = {
      productos: detallesSeleccionados.map((detalle) => ({
        numero_producto: detalle.numero_producto,
        producto_nombre: detalle.producto_nombre,
        categoria_nombre: detalle.categoria_nombre,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
      })),
      total,
    };

    try {
      const response = await axios.post("http://localhost:9001/api/detalle_ordenes", datosOrden);
      if (response.status === 201) {
        alert("Detalles registrados correctamente.");
        setDetallesSeleccionados([]);
        setTotal(0);
        limpiarCampos();
      }
    } catch (err) {
      console.error("Error al registrar detalles:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al registrar los detalles.");
    }
  };

  const limpiarCampos = () => {
    setProductoSeleccionado("");
    setCategoriaNombre("");
    setCantidad(1);
    setPrecioUnitario(0);
    setPersonalizacion("");
    setArchivo(null);
    setError("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Registrar Detalle de Orden</h2>
        <form onSubmit={manejarEnvioFormulario} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Seleccionar Producto:</label>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.numero_producto} value={producto.numero_producto}>
                  {producto.nombre} - ${producto.precio}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoría:</label>
            <input type="text" value={categoriaNombre} readOnly style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cantidad:</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Precio Unitario:</label>
            <input
              type="number"
              min="0"
              value={precioUnitario}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Personalización:</label>
            <input
              type="text"
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subir Archivo:</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="button" onClick={agregarDetalle} style={styles.button}>
            Agregar Producto
          </button>

          <button type="submit" style={styles.button}>
            Registrar Detalles
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Detalles Agregados</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detallesSeleccionados.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.producto_nombre}</td>
                <td>{detalle.categoria_nombre}</td>
                <td>{detalle.cantidad}</td>
                <td>${detalle.precio_unitario.toFixed(2)}</td>
                <td>${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                <td>
                  <button style={styles.removeButton} onClick={() => eliminarDetalle(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.totalContainer}>
          <h4>Total: ${total.toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "600px",
    width: "100%",
    marginBottom: "20px",
  },
  header: {
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "600px",
    width: "100%",
  },
  listHeader: {
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  totalContainer: {
    textAlign: "right",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "15px",
  },
};
