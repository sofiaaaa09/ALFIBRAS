import { useState } from "react";
import axios from "axios";

export default function DetalleOrdenForm() {
  const [ordenId, setOrdenId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");

  const agregarDetalleOrden = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("orden_id", ordenId);
    formData.append("producto_id", productoId);
    formData.append("categoria_id", categoriaId);
    formData.append("cantidad", cantidad);
    formData.append("precio_unitario", precioUnitario);
    formData.append("personalizacion", personalizacion);
    if (archivo) {
      formData.append("archivo", archivo);
    }

    try {
      await axios.post("http://localhost:9001/api/detalle_ordenes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Detalle de la orden registrado exitosamente.");
      setOrdenId("");
      setProductoId("");
      setCategoriaId("");
      setCantidad(1);
      setPrecioUnitario(0);
      setPersonalizacion("");
      setArchivo(null);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>Registrar Detalle de Orden</div>
        <div style={styles.body}>
          <form onSubmit={agregarDetalleOrden} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="txtOrdenId" style={styles.label}>
                Orden ID
              </label>
              <input
                type="text"
                id="txtOrdenId"
                style={styles.input}
                placeholder="ID de la orden"
                onChange={(e) => setOrdenId(e.target.value)}
                value={ordenId}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtProductoId" style={styles.label}>
                Producto ID
              </label>
              <input
                type="text"
                id="txtProductoId"
                style={styles.input}
                placeholder="ID del producto"
                onChange={(e) => setProductoId(e.target.value)}
                value={productoId}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtCategoriaId" style={styles.label}>
                Categoría ID
              </label>
              <input
                type="text"
                id="txtCategoriaId"
                style={styles.input}
                placeholder="ID de la categoría"
                onChange={(e) => setCategoriaId(e.target.value)}
                value={categoriaId}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtCantidad" style={styles.label}>
                Cantidad
              </label>
              <input
                type="number"
                id="txtCantidad"
                style={styles.input}
                placeholder="Cantidad"
                onChange={(e) => setCantidad(e.target.value)}
                value={cantidad}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtPrecioUnitario" style={styles.label}>
                Precio Unitario
              </label>
              <input
                type="number"
                id="txtPrecioUnitario"
                style={styles.input}
                placeholder="Precio unitario"
                onChange={(e) => setPrecioUnitario(e.target.value)}
                value={precioUnitario}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtPersonalizacion" style={styles.label}>
                Personalización
              </label>
              <textarea
                id="txtPersonalizacion"
                style={styles.textarea}
                placeholder="Detalles de personalización"
                rows="3"
                onChange={(e) => setPersonalizacion(e.target.value)}
                value={personalizacion}
              ></textarea>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="filePersonalizacion" style={styles.label}>
                Subir Imagen
              </label>
              <input
                type="file"
                id="filePersonalizacion"
                style={styles.input}
                onChange={(e) => setArchivo(e.target.files[0])}
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.button}>
              Guardar Detalle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Estilos actualizados
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", 
    backgroundColor: "#f4f6f8",
    overflowY: "auto", 
  },
  card: {
    width: "600px",
    maxWidth: "90%", 
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2C3E50",
    color: "#fff",
    textAlign: "center",
    fontSize: "1.5rem",
    padding: "15px",
  },
  body: {
    padding: "30px",
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
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

