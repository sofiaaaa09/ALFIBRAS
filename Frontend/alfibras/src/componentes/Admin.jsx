import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminForm({ adminSelec }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState(""); // Nuevo campo para la contraseña
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (adminSelec) {
      setNombre(adminSelec.nombre);
      setEmail(adminSelec.email);
      setTelefono(adminSelec.telefono);
      setId(adminSelec._id);
      setPassword(""); // No cargamos la contraseña para seguridad
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
        password,
        rol: "admin", // Rol definido por defecto
      });
      setError("");
      alert("Administrador registrado exitosamente.");
      limpiarFormulario();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarAdmin = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/admins`, {
        nombre,
        email,
        telefono,
        password, // Actualizamos la contraseña si es necesario
        rol: "admin", // Rol definido por defecto
      });
      alert("Administrador actualizado correctamente.");
      limpiarFormulario();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setPassword("");
    setId("");
    setError("");
    setIsEditing(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isEditing ? "Modificar Administrador" : "Registrar Administrador"}
        </h1>
        <form onSubmit={isEditing ? actualizarAdmin : agregarAdmin}>
          <fieldset style={styles.fieldset}>
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
                required
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
                required
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
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="txtPassword" style={styles.label}>
                Contraseña
              </label>
              <input
                type="password"
                id="txtPassword"
                style={styles.input}
                placeholder="Contraseña del administrador"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required={!isEditing} // Solo requerido al registrar
              />
            </div>
          </fieldset>
          {error && (
            <div style={styles.alert} role="alert">
              {error}
            </div>
          )}
          <div style={styles.cardFooter}>
            <button type="submit" style={styles.button}>
              {isEditing ? "Modificar" : "Guardar"}
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
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  fieldset: {
    border: "none",
    padding: "0",
  },
  formGroup: {
    marginBottom: "15px",
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
    color: "#dc3545",
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
    margin: "5px",
  },
};
