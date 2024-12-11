import { useState, useEffect } from "react";
import axios from "axios";

export default function OrdenForm() {
  const [clienteEmail, setClienteEmail] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [estado, setEstado] = useState("pendiente");
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const [detallesDisponibles, setDetallesDisponibles] = useState([]);
  const [total, setTotal] = useState(0);
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  // Cargar los datos de clientes, detalles y órdenes
  useEffect(() => {
    obtenerOrdenes();
    obtenerDetalles();
    obtenerClientes();
  }, []);

  // Obtener las órdenes filtradas para mostrar solo las no enviadas
  const obtenerOrdenes = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/ordenes");
      const ordenesFiltradas = response.data.filter(orden => orden.estado !== "enviado");
      setOrdenes(ordenesFiltradas);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
    }
  };

  // Obtener los detalles de productos disponibles
  const obtenerDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/detalle_ordenes");
      setDetallesDisponibles(response.data);
    } catch (err) {
      console.error("Error al obtener detalles de órdenes:", err);
    }
  };

  // Obtener los clientes
  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/clientes");
      setClientes(response.data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  // Agregar un detalle seleccionado a la orden
  const agregarDetalle = (detalle) => {
    if (detallesSeleccionados.some((d) => d._id === detalle._id)) return;
    setDetallesSeleccionados((prev) => [...prev, detalle]);
  };

  // Eliminar un detalle seleccionado
  const eliminarDetalle = (detalleId) => {
    setDetallesSeleccionados((prev) => prev.filter((d) => d._id !== detalleId));
  };

  // Calcular total de la orden
  const calcularTotal = () => {
    return detallesSeleccionados.reduce((total, detalle) => 
      total + (detalle.cantidad * detalle.precio_unitario), 0);
  };

  // Manejo de envío de formulario
  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();

    if (!clienteEmail || !fecha || !estado || detallesSeleccionados.length === 0) {
      setError("Complete todos los campos y seleccione al menos un detalle.");
      return;
    }

    const totalCalculado = calcularTotal();

    const datosOrden = {
      cliente_correo: clienteEmail,
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

  // Limpiar el formulario después de registrar o editar la orden
  const limpiarFormulario = () => {
    setClienteEmail("");
    setEstado("pendiente");
    setFecha(new Date().toISOString().slice(0, 10));
    setDetallesSeleccionados([]);
    setIsEditing(false);
    setOrdenId(null);
  };

  // Eliminar una orden
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>{isEditing ? "Modificar Orden" : "Registrar Orden"}</h2>
        <form onSubmit={manejarEnvioFormulario} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo del Cliente:</label>
            <select
              style={styles.input}
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.email} value={cliente.email}>
                  {cliente.email} - {cliente.nombre}
                </option>
              ))}
            </select>
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
                  <button 
                    type="button"
                    style={styles.addButton} 
                    onClick={() => agregarDetalle(detalle)}
                  >
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
                  <button 
                    type="button"
                    style={styles.removeButton} 
                    onClick={() => eliminarDetalle(detalle._id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.totalContainer}>
            <h4>Total: ${calcularTotal().toFixed(2)}</h4>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitButton}>
            {isEditing ? "Actualizar Orden" : "Guardar Orden"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.header}>Órdenes Registradas</h3>
        <div style={styles.tableContainer}>
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
                <tr key={orden._id} style={styles.tableRow}>
                  <td>{orden.numero_orden}</td>
                  <td>{orden.cliente_correo}</td>
                  <td>{orden.fecha.slice(0, 10)}</td>
                  <td>{orden.estado}</td>
                  <td>${orden.total.toFixed(2)}</td>
                  <td>
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
    marginTop: "80px", // Añade margen superior para evitar solapamiento con el navbar
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
    color: "#fff", // Letras blancas
    textAlign: "center",
    marginBottom: "20px",
    backgroundColor: "#2C3E50", // Fondo azul
    padding: "10px", // Espaciado interno
    borderRadius: "5px", // Bordes redondeados opcionales
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
  tableContainer: {
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
