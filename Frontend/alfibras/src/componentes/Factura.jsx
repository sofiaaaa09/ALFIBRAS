import { useState, useEffect } from "react";
import axios from "axios";

export default function FacturaForm() {
  const [numeroOrden, setNumeroOrden] = useState("");
  const [fecha, setFecha] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [detallesOrden, setDetallesOrden] = useState([]);
  const [correoCliente, setCorreoCliente] = useState(""); // Campo para el correo del cliente
  const [cargando, setCargando] = useState(false);

  // Función para obtener los detalles de la orden, número de orden y correo del cliente
  const obtenerDetallesOrden = async (numeroOrden) => {
    setCargando(true);
    try {
      const response = await axios.get(`http://localhost:9001/api/ordenes/${numeroOrden}`);
      const { detalles, numeroOrden, correoCliente } = response.data;

      setDetallesOrden(detalles);
      setNumeroOrden(numeroOrden);  // Establece el número de orden
      setCorreoCliente(correoCliente); // Establece el correo del cliente

      // Calcular el total basado en los detalles de la orden
      const totalFactura = detalles.reduce((acumulado, detalle) => acumulado + detalle.precio * detalle.cantidad, 0);
      setTotal(totalFactura);
    } catch (err) {
      setError("No se pudo obtener los detalles de la orden.");
      setDetallesOrden([]);
    }
    setCargando(false);
  };

  // Función para agregar la factura
  const agregarFactura = async (event) => {
    event.preventDefault();
    if (!numeroOrden || !fecha || !total) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    
    try {
      await axios.post("http://localhost:9001/api/facturas", {
        numeroOrden, // Enviar número de orden
        fecha,
        total: Number(total),
        correoCliente, // Enviar correo del cliente
      });
      alert("Factura registrada exitosamente.");
      setNumeroOrden("");
      setFecha("");
      setTotal(0);
      setDetallesOrden([]);
      setCorreoCliente("");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  // UseEffect para obtener los detalles de la orden cuando cambia el numeroOrden
  useEffect(() => {
    if (numeroOrden) {
      obtenerDetallesOrden(numeroOrden);
    }
  }, [numeroOrden]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Registrar Factura</div>
        <div style={styles.cardBody}>
          <form onSubmit={agregarFactura} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="txtNumeroOrden" style={styles.label}>
                Número de Orden
              </label>
              <input
                type="text"
                id="txtNumeroOrden"
                style={styles.input}
                placeholder="Número de la orden"
                onChange={(e) => setNumeroOrden(e.target.value)}
                value={numeroOrden}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtCorreoCliente" style={styles.label}>
                Correo del Cliente
              </label>
              <input
                type="email"
                id="txtCorreoCliente"
                style={styles.input}
                placeholder="Correo del cliente"
                value={correoCliente}
                readOnly
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
                value={total}
                readOnly
              />
            </div>
            {cargando && <div style={styles.alert}>Cargando detalles...</div>}
            {detallesOrden.length > 0 && (
              <div style={styles.detallesContainer}>
                <h3>Detalles de la Orden</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detallesOrden.map((detalle, index) => (
                      <tr key={index}>
                        <td>{detalle.producto}</td>
                        <td>{detalle.cantidad}</td>
                        <td>{detalle.precio}</td>
                        <td>{detalle.precio * detalle.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {error && <div style={styles.alert}>{error}</div>}
            <button type="submit" style={styles.button}>Guardar Factura</button>
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
    width: "600px",
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
  detallesContainer: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
};
