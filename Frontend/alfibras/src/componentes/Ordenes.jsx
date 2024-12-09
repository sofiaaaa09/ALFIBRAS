import React, { useState, useEffect } from "react";
import axios from "axios";

export default function OrdenForm() {
  const [clienteEmail, setClienteEmail] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [estado, setEstado] = useState("pendiente");
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const [detallesDisponibles, setDetallesDisponibles] = useState([]);
  const [total, setTotal] = useState(0);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  useEffect(() => {
    obtenerOrdenes();
    obtenerDetalles();
  }, []);

  const obtenerOrdenes = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/ordenes");
      setOrdenes(response.data);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
    }
  };

  const obtenerDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/detalle_ordenes");
      setDetallesDisponibles(response.data);
    } catch (err) {
      console.error("Error al obtener detalles de órdenes:", err);
    }
  };

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();

    if (!clienteEmail || !fecha || !estado || detallesSeleccionados.length === 0) {
      setError("Complete todos los campos y seleccione al menos un detalle.");
      return;
    }

    const datosOrden = {
      cliente_correo: clienteEmail,
      total,
      estado,
      fecha,
      detalles: detallesSeleccionados.map((detalle) => detalle._id),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:9001/api/ordenes/${ordenId}`, datosOrden);
        alert("Orden actualizada correctamente");
      } else {
        await axios.post("http://localhost:9001/api/ordenes", datosOrden);
        alert("Orden creada correctamente");
      }
      limpiarFormulario();
      obtenerOrdenes();
    } catch (err) {
      console.error("Error al enviar datos:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al registrar la orden.");
    }
  };

  const agregarDetalle = (detalle) => {
    if (detallesSeleccionados.some((d) => d._id === detalle._id)) return;
    setDetallesSeleccionados((prev) => [...prev, detalle]);
    setTotal((prevTotal) => prevTotal + detalle.cantidad * detalle.precio_unitario);
  };

  const eliminarDetalle = (detalleId) => {
    const detalleEliminado = detallesSeleccionados.find((d) => d._id === detalleId);
    setDetallesSeleccionados((prev) => prev.filter((d) => d._id !== detalleId));
    setTotal((prevTotal) => prevTotal - detalleEliminado.cantidad * detalleEliminado.precio_unitario);
  };

  const limpiarFormulario = () => {
    setClienteEmail("");
    setTotal(0);
    setEstado("pendiente");
    setFecha(new Date().toISOString().slice(0, 10));
    setDetallesSeleccionados([]);
    setIsEditing(false);
    setOrdenId(null);
  };

  const eliminarOrden = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta orden?")) {
      try {
        await axios.delete(`http://localhost:9001/api/ordenes/${id}`);
        alert("Orden eliminada correctamente");
        obtenerOrdenes();
      } catch (err) {
        console.error("Error al eliminar la orden:", err);
        alert("Error al eliminar la orden");
      }
    }
  };

  const editarOrden = (orden) => {
    setClienteEmail(orden.cliente_correo);
    setFecha(orden.fecha.slice(0, 10));
    setEstado(orden.estado);
    setDetallesSeleccionados(orden.detalles);
    setTotal(orden.total);
    setIsEditing(true);
    setOrdenId(orden._id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>{isEditing ? "Modificar Orden" : "Registrar Orden"}</h2>
        <form onSubmit={manejarEnvioFormulario} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo del Cliente:</label>
            <input
              type="email"
              style={styles.input}
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Estado:</label>
            <select
              style={styles.select}
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
            <label style={styles.label}>Fecha:</label>
            <input
              type="date"
              style={styles.input}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div style={styles.detailsContainer}>
            <h3>Detalles Disponibles</h3>
            <ul style={styles.detailsList}>
              {detallesDisponibles.map((detalle) => (
                <li key={detalle._id} style={styles.detailsItem}>
                  {detalle.producto_nombre} - {detalle.cantidad} unidades - ${detalle.precio_unitario}
                  <button style={styles.addButton} onClick={() => agregarDetalle(detalle)}>
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.detailsContainer}>
            <h3>Detalles Seleccionados</h3>
            <ul style={styles.detailsList}>
              {detallesSeleccionados.map((detalle) => (
                <li key={detalle._id} style={styles.detailsItem}>
                  {detalle.producto_nombre} - {detalle.cantidad} unidades - ${detalle.precio_unitario}
                  <button style={styles.removeButton} onClick={() => eliminarDetalle(detalle._id)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.totalContainer}>
            <h4>Total: ${total}</h4>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitButton}>
            {isEditing ? "Actualizar Orden" : "Guardar Orden"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.header}>Órdenes Registradas</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th># Orden</th>
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
                <td>{orden.fecha.slice(0, 10)}</td>
                <td>{orden.estado}</td>
                <td>${orden.total}</td>
                <td>
                  <button style={styles.editButton} onClick={() => editarOrden(orden)}>
                    Editar
                  </button>
                  <button style={styles.deleteButton} onClick={() => eliminarOrden(orden._id)}>
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    padding: "20px",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
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
    fontWeight: "bold",
    color: "#555",
    marginBottom: "8px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  detailsContainer: {
    marginTop: "20px",
  },
  detailsList: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  detailsItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  totalContainer: {
    textAlign: "right",
    marginTop: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  error: {
    color: "#dc3545",
    fontWeight: "bold",
    marginTop: "10px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
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
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
