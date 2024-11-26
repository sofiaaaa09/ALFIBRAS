import { useState, useEffect } from "react";
import axios from "axios";

export default function OrdenForm({ ordenSelec }) {
  const [clienteId, setClienteId] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (ordenSelec) {
      setClienteId(ordenSelec.cliente_id);
      setFecha(ordenSelec.fecha);
      setEstado(ordenSelec.estado);
      setTotal(ordenSelec.total);
      setId(ordenSelec._id);
      setIsEditing(true);
    }
  }, [ordenSelec]);

  const agregarOrden = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/ordenes", {
        cliente_id: clienteId,
        fecha,
        estado,
        total: Number(total),
      });
      setError("");
      alert("Orden registrada exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarOrden = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/ordenes/${id}`, {
        cliente_id: clienteId,
        fecha,
        estado,
        total: Number(total),
      });
      alert("Orden actualizada correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Orden" : "Registrar Orden"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Orden" : "Registrar Orden"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtClienteId" style={styles.label}>
                  Cliente ID
                </label>
                <input
                  type="text"
                  id="txtClienteId"
                  style={styles.input}
                  placeholder="ID del cliente"
                  onChange={(event) => setClienteId(event.target.value)}
                  value={clienteId}
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
                  onChange={(event) => setFecha(event.target.value)}
                  value={fecha}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="selectEstado" style={styles.label}>
                  Estado
                </label>
                <select
                  id="selectEstado"
                  style={styles.select}
                  value={estado}
                  onChange={(event) => setEstado(event.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="procesada">Procesada</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtTotal" style={styles.label}>
                  Total
                </label>
                <input
                  type="number"
                  id="txtTotal"
                  style={styles.input}
                  placeholder="Monto total"
                  onChange={(event) => setTotal(event.target.value)}
                  value={total}
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
              onClick={actualizarOrden}
            >
              Modificar
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarOrden}
            >
              Guardar Orden
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
  select: {
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
