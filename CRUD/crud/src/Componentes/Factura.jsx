import { useState } from "react";
import axios from "axios";

export default function FacturaForm() {
  const [ordenId, setOrdenId] = useState("");
  const [fecha, setFecha] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const agregarFactura = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/facturas", {
        orden_id: ordenId,
        fecha,
        total: Number(total), // Conversión explícita
      });
      alert("Factura registrada exitosamente.");
      setOrdenId("");
      setFecha("");
      setTotal(0);
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
        <div style={styles.cardHeader}>Registrar Factura</div>
        <div style={styles.cardBody}>
          <form onSubmit={agregarFactura} style={styles.form}>
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
              <label htmlFor="txtFecha" style={styles.label}>
                Fecha
              </label>
              <input
                type="date"
                id="txtFecha"
                style={styles.input}
                onChange={(e) => setFecha(e.target.value)}
                value={fecha}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtTotal" style={styles.label}>
                Total
              </label>
              <input
                type="number"
                id="txtTotal"
                style={styles.input}
                placeholder="Total de la factura"
                onChange={(e) => setTotal(Number(e.target.value))}
                value={total}
              />
            </div>
            {error && (
              <div style={styles.alert}>
                {error}
              </div>
            )}
            <button type="submit" style={styles.button}>
              Guardar Factura
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Estilos en línea mejorados
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "",
  },
  card: {
    width: "600px", // Más ancho
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#2C3E50",
    color: "white",
    fontSize: "1.8rem",
    padding: "15px",
  },
  cardBody: {
    padding: "40px",
  },
  form: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "1.1rem",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    transition: "border 0.3s ease",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 8px rgba(0, 123, 255, 0.5)",
  },
  alert: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#d9534f",
  },
  button: {
    backgroundColor: "#2C3E50",
    color: "white",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "1.2rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
};
