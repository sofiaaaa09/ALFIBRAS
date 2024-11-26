import { useState, useEffect } from "react";
import axios from "axios";

export default function ClienteForm({ clienteSelec }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [edad, setEdad] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (clienteSelec) {
      setNombre(clienteSelec.nombre);
      setCorreo(clienteSelec.correo);
      setTelefono(clienteSelec.telefono);
      setDireccion(clienteSelec.direccion);
      setEdad(clienteSelec.edad);
      setId(clienteSelec._id);
      setIsEditing(true);
    }
  }, [clienteSelec]);

  const agregarCliente = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/clientes", {
        nombre,
        correo,
        telefono,
        direccion,
        edad: Number(edad),
      });
      setError("");
      alert("Cliente registrado exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarCliente = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/clientes/${id}`, {
        nombre,
        correo,
        telefono,
        direccion,
        edad: Number(edad),
      });
      alert("Cliente actualizado correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Cliente" : "Registrar Cliente"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Cliente" : "Registrar Cliente"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtNombre" style={styles.label}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="txtNombre"
                  style={styles.input}
                  placeholder="Nombre completo"
                  onChange={(event) => setNombre(event.target.value)}
                  value={nombre}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtCorreo" style={styles.label}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="txtCorreo"
                  style={styles.input}
                  placeholder="Correo electrónico"
                  onChange={(event) => setCorreo(event.target.value)}
                  value={correo}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtTelefono" style={styles.label}>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="txtTelefono"
                  style={styles.input}
                  placeholder="Número de teléfono"
                  onChange={(event) => setTelefono(event.target.value)}
                  value={telefono}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtDireccion" style={styles.label}>
                  Dirección
                </label>
                <textarea
                  id="txtDireccion"
                  style={styles.textarea}
                  placeholder="Dirección completa"
                  rows="3"
                  onChange={(event) => setDireccion(event.target.value)}
                  value={direccion}
                ></textarea>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtEdad" style={styles.label}>
                  Edad
                </label>
                <input
                  type="number"
                  id="txtEdad"
                  style={styles.input}
                  placeholder="Edad del cliente"
                  onChange={(event) => setEdad(event.target.value)}
                  value={edad}
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
              onClick={actualizarCliente}
            >
              Modificar
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarCliente}
            >
              Guardar Cliente
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
  textarea: {
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
