import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

export default function OrdenForm({ ordenSelec }) {
  const [clienteEmail, setClienteEmail] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Formato de fecha: YYYY-MM-DD
  const [estado, setEstado] = useState("pendiente");
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [factura, setFactura] = useState(null); // Estado para la factura

  useEffect(() => {
    obtenerOrdenes();
  }, []);

  const obtenerOrdenes = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/ordenes");
      setOrdenes(response.data);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
    }
  };

  const obtenerFactura = async (ordenId) => {
    try {
      const response = await axios.get(`http://localhost:9001/api/ordenes/${ordenId}/factura`);
      setFactura(response.data);
    } catch (err) {
      console.error("Error al obtener la factura:", err);
    }
  };

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();
  
    const datosOrden = {
      cliente_correo: clienteEmail,
      total: Number(total),
      estado,
      fecha,
    };
  
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:9001/api/ordenes/${id}`, datosOrden);
        alert(`Orden y factura actualizadas correctamente. Número de factura: ${response.data.factura.numero_factura}`);
      } else {
        const response = await axios.post("http://localhost:9001/api/ordenes", datosOrden);
        alert(`Orden y factura creadas correctamente. Número de factura: ${response.data.factura.numero_factura}`);
      }
  
      limpiarFormulario();
      obtenerOrdenes();
    } catch (err) {
      console.error("Error al enviar datos:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Error al registrar la orden.");
    }
  };
  

  const eliminarOrden = async (ordenId) => {
    const confirmarEliminacion = window.confirm("¿Estás seguro de que quieres eliminar esta orden?");
    if (confirmarEliminacion) {
      try {
        await axios.delete(`http://localhost:9001/api/ordenes/${ordenId}`);
        alert("Orden eliminada correctamente.");
        obtenerOrdenes();
      } catch (err) {
        console.error("Error al eliminar la orden:", err);
        alert("Hubo un problema al eliminar la orden.");
      }
    }
  };

  const editarOrden = (orden) => {
    setClienteEmail(orden.cliente_correo);
    setTotal(orden.total);
    setEstado(orden.estado);
    setFecha(orden.fecha);
    setId(orden._id);
    setIsEditing(true);
    obtenerFactura(orden._id);  // Cargar la factura de la orden
  };

  const limpiarFormulario = () => {
    setClienteEmail("");
    setTotal(0);
    setEstado("pendiente");
    setFecha(new Date().toISOString().slice(0, 10));
    setId("");
    setIsEditing(false);
    setFactura(null); // Limpiar la factura
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Orden" : "Registrar Orden"}
        </div>
        <div style={styles.cardBody}>
          <form onSubmit={manejarEnvioFormulario}>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Orden" : "Registrar Orden"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtClienteEmail" style={styles.label}>
                  Correo del Cliente
                </label>
                <input
                  type="email"
                  id="txtClienteEmail"
                  style={styles.input}
                  placeholder="Correo del cliente"
                  onChange={(event) => setClienteEmail(event.target.value)}
                  value={clienteEmail}
                  required
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
                  placeholder="Monto total"
                  onChange={(event) => setTotal(event.target.value)}
                  value={total}
                  required
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
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="procesada">Procesada</option>
                  <option value="completada">Completada</option>
                  <option value="enviado">Enviado</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="fecha" style={styles.label}>
                  Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  style={styles.input}
                  value={fecha}
                  onChange={(event) => setFecha(event.target.value)}
                />
              </div>
            </fieldset>
            {error && <div style={styles.alert} role="alert">{error}</div>}
            <div style={styles.cardFooter}>
              <button type="submit" style={styles.button}>
                {isEditing ? "Actualizar Orden" : "Guardar Orden"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  style={{ ...styles.button, backgroundColor: "#dc3545" }}
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {factura && (
        <div style={styles.factura}>
          <h3>Detalles de la Factura</h3>
          <pre>{JSON.stringify(factura, null, 2)}</pre> {/* Muestra los detalles de la factura en formato JSON */}
        </div>
      )}

      <div style={styles.lista}>
        <h3>Lista de Órdenes</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Número de Orden</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden._id}>
                <td>{orden.numero_orden}</td>
                <td>{orden.cliente_correo}</td>
                <td>{orden.fecha}</td>
                <td>{orden.estado}</td>
                <td>{orden.total}</td>
                <td>
                  <button onClick={() => editarOrden(orden)} style={styles.button}>Editar</button>
                  <button onClick={() => eliminarOrden(orden._id)} style={{ ...styles.button, backgroundColor: "#dc3545" }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  factura: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
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
    marginBottom: "20px",
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
    color: "#dc3545",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  lista: {
    width: "100%",
    maxWidth: "800px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
};
