import axios from "axios";
import React, { useEffect, useState } from "react";

export default function OrdenForm() {
  const [numeroOrden, setNumeroOrden] = useState("");
  const [productoNombre, setProductoNombre] = useState("");
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [detallesOrden, setDetallesOrden] = useState([]); 

  useEffect(() => {

    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/categorias");
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
      }
    };


    const fetchDetallesOrden = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/detalle_ordenes");
        setDetallesOrden(response.data);
      } catch (err) {
        console.error("Error al cargar los detalles de las órdenes:", err);
      }
    };

    fetchCategorias();
    fetchDetallesOrden();
  }, []);

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();

    if (!numeroOrden || !productoNombre || !categoriaNombre || !cantidad || !precioUnitario) {
      setError("Por favor, complete todos los campos correctamente.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("numero_orden", numeroOrden);
    formData.append("producto_nombre", productoNombre);
    formData.append("categoria_nombre", categoriaNombre);
    formData.append("cantidad", cantidad);
    formData.append("precio_unitario", precioUnitario);
    formData.append("personalizacion", personalizacion);

    try {
      const response = await axios.post("http://localhost:9001/api/detalle_ordenes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


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
    setProductoNombre("");
    setCategoriaNombre("");
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Producto Nombre:</label>
            <input
              type="text"
              value={productoNombre}
              onChange={(e) => setProductoNombre(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoría:</label>
            <select
              value={categoriaNombre}
              onChange={(e) => setCategoriaNombre(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria.nombre_categoria}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </select>
          </div>

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

          <button type="submit" style={styles.button}>
            Registrar Detalle
          </button>
        </form>
      </div>


      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Detalles Registrados</h3>
        <ul style={styles.list}>
          {detallesOrden.map((detalle, index) => (
            <li key={index} style={styles.listItem}>
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
  buttonHover: {
    backgroundColor: "#0056b3",
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
