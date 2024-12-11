import { useState, useEffect } from "react";

export default function CategoriaForm() {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [estadoCategoria, setEstadoCategoria] = useState("activo");
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const registrarCategoria = async (event) => {
    event.preventDefault();
  
    // Validación de campos
    if (!nombreCategoria || !descripcionCategoria) {
      setError("Todos los campos son obligatorios.");
      return;
    }
  
    setError(""); // Limpiar errores anteriores
  
    // Realizar la solicitud POST
    try {
      const response = await fetch("http://localhost:9001/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especificamos que estamos enviando JSON
        },
        body: JSON.stringify({
          nombre_categoria: nombreCategoria.trim(),  // Asegúrate de enviar 'nombre_categoria'
          descripcion: descripcionCategoria.trim(),
          estado: estadoCategoria, // Verifica que sea 'activo' o 'inactivo'
        }),
      });
  
      // Si la respuesta no es exitosa
      if (!response.ok) {
        const errorData = await response.json(); // Lee la respuesta como JSON
        setError(errorData.message || "Ocurrió un error al registrar la categoría");
        return;
      }
  
      // Si la solicitud es exitosa
      alert("Categoría registrada exitosamente");
      setNombreCategoria(""); // Limpiar el campo
      setDescripcionCategoria(""); // Limpiar el campo
      setEstadoCategoria("activo"); // Restablecer el estado
      obtenerCategorias(); // Actualizar lista de categorías
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
      setError(error.message || "Ocurrió un error al registrar la categoría");
    }
  };
  
  
  

  const obtenerCategorias = async () => {
    try {
      const response = await fetch("http://localhost:9001/api/categorias");
      if (!response.ok) {
        throw new Error("Error al obtener categorías");
      }
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (categoriaId) => {
    try {
      const response = await fetch(`http://localhost:9001/api/categorias/${categoriaId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
      }
      alert("Categoría eliminada exitosamente");
      obtenerCategorias(); // Actualizar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  // Editar categoría (cargar los datos en los campos del formulario)
  const editarCategoria = (categoria) => {
    setNombreCategoria(categoria.nombre);
    setDescripcionCategoria(categoria.descripcion);
    setEstadoCategoria(categoria.estado);
  };

  return (
    <div style={styles.wrapper}>
    <h1 style={styles.title}>Formulario de Categorías</h1> {/* Aquí se agrega el título */}
    <div style={styles.card}>
      <div style={styles.cardHeader}>Crear Categoria</div>
      <div style={styles.cardBody}>
        <form>
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Información de la Nueva Categoría</legend>

              <div style={styles.formGroup}>
                <label htmlFor="txtNombreCategoria" style={styles.label}>
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  id="txtNombreCategoria"
                  style={styles.input}
                  placeholder="Nombre de la categoría"
                  onChange={(e) => setNombreCategoria(e.target.value)}
                  value={nombreCategoria}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="txtDescripcionCategoria" style={styles.label}>
                  Descripción
                </label>
                <textarea
                  id="txtDescripcionCategoria"
                  style={styles.input}
                  placeholder="Descripción de la categoría"
                  rows="3"
                  onChange={(e) => setDescripcionCategoria(e.target.value)}
                  value={descripcionCategoria}
                ></textarea>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="selectEstadoCategoria" style={styles.label}>
                  Estado
                </label>
                <select
                  id="selectEstadoCategoria"
                  style={styles.select}
                  value={estadoCategoria}
                  onChange={(e) => setEstadoCategoria(e.target.value)}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
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
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: "#28a745" }}
            onClick={registrarCategoria}
          >
            Guardar Categoría
          </button>
        </div>
      </div>

      
      <div style={styles.card}>
        <div style={styles.cardHeader}>Lista de Categorías</div>
        <div style={styles.cardBody}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria._id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion}</td>
                  <td>{categoria.estado}</td>
                  <td>
                    <button
                      style={styles.button}
                      onClick={() => editarCategoria(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ ...styles.button, backgroundColor: "#dc3545" }}
                      onClick={() => eliminarCategoria(categoria._id)}
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
    overflowY: "auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "40px",  // Espacio entre el título y el formulario
  },
  card: {
    width: "100%",
    maxWidth: "800px",
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
    backgroundColor: "white",
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
    marginRight: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
  },
  td: {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
};