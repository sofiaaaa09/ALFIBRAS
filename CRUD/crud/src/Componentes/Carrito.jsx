import { useState, useEffect } from "react";
import axios from "axios";

export default function CarritoForm({ carritoSelec }) {
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (carritoSelec) {
      setProducto(carritoSelec.producto);
      setCantidad(carritoSelec.cantidad);
      setPrecioUnitario(carritoSelec.precioUnitario);
      setPrecioTotal(carritoSelec.cantidad * carritoSelec.precioUnitario);
      setId(carritoSelec._id);
      setIsEditing(true);
    }
  }, [carritoSelec]);

  useEffect(() => {
    setPrecioTotal(cantidad * precioUnitario);
  }, [cantidad, precioUnitario]);

  const agregarCarrito = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/carritos", {
        producto,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        precioTotal: Number(precioTotal),
      });
      setError("");
      alert("Producto agregado al carrito exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarCarrito = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/carritos/${id}`, {
        producto,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        precioTotal: Number(precioTotal),
      });
      alert("Carrito actualizado correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Carrito" : "Agregar al Carrito"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Carrito" : "Agregar al Carrito"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtProducto" style={styles.label}>
                  Producto
                </label>
                <input
                  type="text"
                  id="txtProducto"
                  style={styles.input}
                  placeholder="Nombre del producto"
                  onChange={(event) => setProducto(event.target.value)}
                  value={producto}
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
                  onChange={(event) => setCantidad(event.target.value)}
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
                  placeholder="Precio por unidad"
                  onChange={(event) => setPrecioUnitario(event.target.value)}
                  value={precioUnitario}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtPrecioTotal" style={styles.label}>
                  Precio Total
                </label>
                <input
                  type="number"
                  id="txtPrecioTotal"
                  style={styles.input}
                  value={precioTotal}
                  readOnly
                />
              </div>
            </fieldset>
          </form>
          {error && (
            <div style={styles.alert} role="alert">
              {error}
            </div>
          )}
        </div>
        <div style={styles.cardFooter}>
          {isEditing ? (
            <button
              type="button"
              style={styles.button}
              onClick={actualizarCarrito}
            >
              Modificar
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarCarrito}
            >
              Agregar al Carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "20px",
    overflowY: "auto",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#2C3E50",
    color: "white",
    fontSize: "1.5rem",
    padding: "15px",
    textAlign: "center",
  },
  cardBody: {
    padding: "20px",
  },
  cardFooter: {
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  fieldset: {
    border: "none",
    margin: "0",
    padding: "0",
  },
  legend: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  alert: {
    color: "#d9534f",
    marginTop: "15px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#007bff",
  },
};
