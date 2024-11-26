import { useState, useEffect } from "react";
import axios from "axios";

export default function InventarioForm({ inventarioSelec }) {
  const [productoId, setProductoId] = useState("");
  const [stock, setStock] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(0);
  const [stockMaximo, setStockMaximo] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (inventarioSelec) {
      setProductoId(inventarioSelec.producto_id);
      setStock(inventarioSelec.stock);
      setStockMinimo(inventarioSelec.stock_minimo);
      setStockMaximo(inventarioSelec.stock_maximo);
      setId(inventarioSelec._id);
      setIsEditing(true);
    }
  }, [inventarioSelec]);

  const agregarInventario = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/Inventario", {
        producto_id: productoId,
        stock: Number(stock),
        stock_minimo: Number(stockMinimo),
        stock_maximo: Number(stockMaximo),
      });
      setError("");
      alert("Inventario registrado exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarInventario = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/Inventario/${id}`, {
        producto_id: productoId,
        stock: Number(stock),
        stock_minimo: Number(stockMinimo),
        stock_maximo: Number(stockMaximo),
      });
      alert("Inventario actualizado correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Inventario" : "Registrar Inventario"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Inventario" : "Registrar Inventario"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtProductoId" style={styles.label}>
                  Producto ID
                </label>
                <input
                  type="text"
                  id="txtProductoId"
                  style={styles.input}
                  placeholder="ID del producto"
                  onChange={(event) => setProductoId(event.target.value)}
                  value={productoId}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtStock" style={styles.label}>
                  Stock
                </label>
                <input
                  type="number"
                  id="txtStock"
                  style={styles.input}
                  placeholder="Cantidad en stock"
                  onChange={(event) => setStock(event.target.value)}
                  value={stock}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtStockMinimo" style={styles.label}>
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  id="txtStockMinimo"
                  style={styles.input}
                  placeholder="Cantidad mínima en stock"
                  onChange={(event) => setStockMinimo(event.target.value)}
                  value={stockMinimo}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtStockMaximo" style={styles.label}>
                  Stock Máximo
                </label>
                <input
                  type="number"
                  id="txtStockMaximo"
                  style={styles.input}
                  placeholder="Cantidad máxima en stock"
                  onChange={(event) => setStockMaximo(event.target.value)}
                  value={stockMaximo}
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
              onClick={actualizarInventario}
            >
              Modificar
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarInventario}
            >
              Guardar Inventario
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
