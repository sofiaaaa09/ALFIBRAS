import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

export default function OrdenForm() {
  const [clienteEmail, setClienteEmail] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); 
  const [estado, setEstado] = useState("pendiente");
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [factura, setFactura] = useState(null);

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
        alert("Orden actualizada correctamente");
      } else {
        const response = await axios.post("http://localhost:9001/api/ordenes", datosOrden);
        alert("Orden creada correctamente");
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
    setFecha(orden.fecha.slice(0, 10));
    setId(orden._id);
    setIsEditing(true);
  };

  const limpiarFormulario = () => {
    setClienteEmail("");
    setTotal(0);
    setEstado("pendiente");
    setFecha(new Date().toISOString().slice(0, 10));
    setId("");
    setIsEditing(false);
    setFactura(null); 
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.header}>{isEditing ? "Modificar Orden" : "Registrar Orden"}</h2>
        <form onSubmit={manejarEnvioFormulario}>
          <div style={styles.formGroup}>
            <label>Correo del Cliente</label>
            <input
              type="email"
              style={styles.input}
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Total</label>
            <input
              type="number"
              style={styles.input}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Estado</label>
            <select
              style={styles.input}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="procesada">Procesada</option>
              <option value="completada">Completada</option>
              <option value="enviado">Enviado</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label>Fecha</label>
            <input
              type="date"
              style={styles.input}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>
            {isEditing ? "Actualizar" : "Guardar"}
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
        </form>
      </div>

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
              <th>Detalles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden._id}>
                <td>{orden.numero_orden}</td>
                <td>{orden.cliente_correo}</td>
                <td>{orden.fecha.slice(0, 10)}</td>
                <td>{orden.estado}</td>
                <td>${orden.total}</td>
                <td>
                  {orden.detalles.map((detalle) => (
                    <div key={detalle._id}>
                      <strong>Producto:</strong> {detalle.producto_nombre}<br />
                      <strong>Cantidad:</strong> {detalle.cantidad}<br />
                      <strong>Precio:</strong> ${detalle.precio_unitario}
                    </div>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => editarOrden(orden)}
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarOrden(orden._id)}
                    style={styles.deleteButton}
                  >
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
    padding: "20px",
  },
  header: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
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
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  error: {
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
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
  editButton: {
    backgroundColor: "#ffc107",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  lista: {
    width: "100%",
    maxWidth: "800px",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
  tableCellHeader: {
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "#fff",
  },
};