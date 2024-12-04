import React, { useState, useEffect } from "react";
import axios from "axios";

export default function OrdenForm() {
  const [numeroOrden, setNumeroOrden] = useState("");
  const [productoId, setProductoId] = useState(""); // Producto seleccionado
  const [productoNumero, setProductoNumero] = useState(""); // Mostrar el número del producto
  const [cantidad, setCantidad] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [detallesOrden, setDetallesOrden] = useState([]); // Estado para almacenar los detalles de la orden

  useEffect(() => {
    // Cargar las categorías al montar el componente
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/categorias");
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
      }
    };

    // Cargar los productos al montar el componente
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/productos");
        setProductos(response.data);
      } catch (err) {
        console.error("Error al cargar los productos:", err);
      }
    };

    // Cargar las órdenes al montar el componente
    const fetchDetallesOrden = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/detalle_ordenes");
        setDetallesOrden(response.data);
      } catch (err) {
        console.error("Error al cargar los detalles de las órdenes:", err);
      }
    };

    fetchCategorias();
    fetchProductos();
    fetchDetallesOrden();
  }, []);

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();

    // Validar que los campos necesarios estén completos
    if (!numeroOrden || !productoId || !cantidad || !precioUnitario) {
      setError("Por favor, complete todos los campos correctamente.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("numero_orden", numeroOrden);
    formData.append("producto_id", productoId); // Enviar productoId
    formData.append("cantidad", cantidad);
    formData.append("precio_unitario", precioUnitario);
    formData.append("personalizacion", personalizacion);

    try {
      const response = await axios.post("http://localhost:9001/api/detalle_ordenes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualizar la lista de detalles con el nuevo registro
      setDetallesOrden([...detallesOrden, response.data]);
      limpiarFormulario();
      alert("Detalle de la orden registrado exitosamente.");
    } catch (err) {
      console.error("Error al enviar datos:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al registrar el detalle de la orden.");
    }
  };

  const limpiarFormulario = () => {
    setNumeroOrden("");
    setProductoId(""); // Limpiar el campo de productoId
    setProductoNumero(""); // Limpiar el número del producto
    setCantidad(0);
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
          {/* Campo Número de Orden */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Orden:</label>
            <input
              type="text"
              value={numeroOrden}
              onChange={(e) => setNumeroOrden(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Campo Producto con número del producto visible */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Producto:</label>
            <select
              value={productoId}
              onChange={(e) => {
                const selectedProduct = productos.find((producto) => producto._id === e.target.value);
                setProductoId(e.target.value);
                setProductoNumero(selectedProduct ? selectedProduct.numero_producto : "");
              }}
              required
              style={styles.input}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre_producto} (Número: {producto.numero_producto})
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar el número del producto seleccionado */}
          {productoNumero && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Número del Producto Seleccionado:</label>
              <p>{productoNumero}</p>
            </div>
          )}

          {/* Campo Cantidad */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Campo Precio Unitario */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Precio Unitario:</label>
            <input
              type="number"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Campo Personalización */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Personalización:</label>
            <input
              type="text"
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Campo Subir Archivo */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Subir Archivo:</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              style={styles.input}
            />
          </div>

          {/* Mostrar errores */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Botón para enviar el formulario */}
          <button type="submit" style={styles.button}>
            Registrar Detalle
          </button>
        </form>
      </div>

      {/* Lista de detalles de órdenes */}
      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Detalles Registrados</h3>
        <ul style={styles.list}>
          {detallesOrden.map((detalle) => (
            <li key={detalle._id} style={styles.listItem}>
              <strong>Orden {detalle.numero_orden}:</strong> {detalle.producto_nombre} -{" "}
              {detalle.categoria_nombre} - Cantidad: {detalle.cantidad} - Precio:{" "}
              {detalle.precio_unitario} - Personalización: {detalle.personalizacion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "20px",
  },
  card: {
    width: "600px",
    maxWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    marginBottom: "20px",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "1rem",
    marginTop: "10px",
  },
  listContainer: {
    width: "600px",
    maxWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
  },
  listHeader: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
  },
};
