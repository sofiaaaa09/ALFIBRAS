import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminForm({ adminSelec }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("usuario");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (adminSelec) {
      setNombre(adminSelec.nombre);
      setEmail(adminSelec.email);
      setTelefono(adminSelec.telefono);
      setRol(adminSelec.rol);
      setId(adminSelec._id);
      setIsEditing(true);
    }
  }, [adminSelec]);

  const agregarAdmin = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:9001/api/admins", {
        nombre,
        email,
        telefono,
        rol,
      });
      setError("");
      alert("Administrador registrado exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarAdmin = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/admins/${id}`, {
        nombre,
        email,
        telefono,
        rol,
      });
      alert("Administrador actualizado correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Administrador" : "Registrar Administrador"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Administrador" : "Registrar Administrador"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtNombre" style={styles.label}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="txtNombre"
                  style={styles.input}
                  placeholder="Nombre del administrador"
                  onChange={(event) => setNombre(event.target.value)}
                  value={nombre}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtEmail" style={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="txtEmail"
                  style={styles.input}
                  placeholder="Email del administrador"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtTelefono" style={styles.label}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="txtTelefono"
                  style={styles.input}
                  placeholder="Teléfono del administrador"
                  onChange={(event) => setTelefono(event.target.value)}
                  value={telefono}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="selectRol" style={styles.label}>
                  Rol
                </label>
                <select
                  id="selectRol"
                  style={styles.select}
                  value={rol}
                  onChange={(event) => setRol(event.target.value)}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
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
              onClick={actualizarAdmin}
            >
              Modificar
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarAdmin}
            >
              Guardar Administrador
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
