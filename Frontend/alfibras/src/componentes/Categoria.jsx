import { useState, useEffect } from "react";
import api from "../componentes/api";
import localforage from "localforage";

export default function CategoriaForm() {
  const [formData, setFormData] = useState({
    nombreCategoria: "",
    descripcionCategoria: "",
    estadoCategoria: "activo"
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const almacenarCategorias = async (categorias) => {
    try {
      await localforage.setItem("categorias", categorias);
    } catch (error) {
      console.error("Error al guardar las categorías:", error);
    }
  };

  const obtenerCategorias = async (forzarServidor = false) => {
    setIsLoading(true);
    try {
      if (!forzarServidor) {
        const categoriasGuardadas = await localforage.getItem("categorias");
        if (categoriasGuardadas) {
          setCategorias(Array.isArray(categoriasGuardadas) ? categoriasGuardadas : []);
          setIsLoading(false);
          return;
        }
      }

      const response = await api.get("/categorias");
      if (response.status !== 200) {
        throw new Error("Error al obtener categorías");
      }

      const data = response.data;
      const categoriasArray = Array.isArray(data) ? data : [];
      setCategorias(categoriasArray);
      await almacenarCategorias(categoriasArray);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setError("Error al obtener categorías");
      setCategorias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const registrarCategoria = async (event) => {
    event.preventDefault();

    if (!formData.nombreCategoria || !formData.descripcionCategoria) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (isEditing && categoriaSeleccionada) {
        const response = await api.put(`/categorias/${categoriaSeleccionada._id}`, {
          nombre_categoria: formData.nombreCategoria.trim(),
          descripcion: formData.descripcionCategoria.trim(),
          estado: formData.estadoCategoria,
        });

        if (response.status !== 200) {
          throw new Error("Error al actualizar la categoría");
        }
      } else {
        const response = await api.post("/categorias", {
          nombre_categoria: formData.nombreCategoria.trim(),
          descripcion: formData.descripcionCategoria.trim(),
          estado: formData.estadoCategoria,
        });

        if (response.status !== 201) {
          throw new Error("Error al registrar la categoría");
        }
      }

      resetForm();
      await obtenerCategorias(true);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setError(error.response?.data?.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCategoria = async (categoriaId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    
    try {
      const response = await api.delete(`/categorias/${categoriaId}`);
      if (response.status !== 200) {
        throw new Error("Error al eliminar la categoría");
      }
      await obtenerCategorias(true);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setError("No se pudo eliminar la categoría");
    }
  };

  const editarCategoria = (categoria) => {
    setFormData({
      nombreCategoria: categoria.nombre_categoria,
      descripcionCategoria: categoria.descripcion,
      estadoCategoria: categoria.estado
    });
    setIsEditing(true);
    setCategoriaSeleccionada(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      nombreCategoria: "",
      descripcionCategoria: "",
      estadoCategoria: "activo"
    });
    setIsEditing(false);
    setCategoriaSeleccionada(null);
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Categorías</h1>

      <div style={styles.gridContainer}>
        {/* Formulario */}
        <div style={styles.formCard}>
          <h2 style={styles.cardHeader}>
            {isEditing ? (
              <>
                <i className="fas fa-edit" style={styles.icon}></i> Editar Categoría
              </>
            ) : (
              <>
                <i className="fas fa-plus" style={styles.icon}></i> Nueva Categoría
              </>
            )}
          </h2>
          <form onSubmit={registrarCategoria} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <i className="fas fa-tag" style={styles.inputIcon}></i> Nombre de la categoría
              </label>
              <input
                type="text"
                name="nombreCategoria"
                style={styles.input}
                placeholder="Ej: Sillas, Puertas, etc."
                onChange={handleInputChange}
                value={formData.nombreCategoria}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <i className="fas fa-align-left" style={styles.inputIcon}></i> Descripción
              </label>
              <textarea
                name="descripcionCategoria"
                style={{ ...styles.input, minHeight: "100px" }}
                placeholder="Describe las características de esta categoría"
                onChange={handleInputChange}
                value={formData.descripcionCategoria}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <i className="fas fa-power-off" style={styles.inputIcon}></i> Estado
              </label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="estadoCategoria"
                    value="activo"
                    checked={formData.estadoCategoria === "activo"}
                    onChange={handleInputChange}
                    style={styles.radioInput}
                  />
                  <span style={formData.estadoCategoria === "activo" ? styles.radioActive : styles.radioInactive}>
                    Activo
                  </span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="estadoCategoria"
                    value="inactivo"
                    checked={formData.estadoCategoria === "inactivo"}
                    onChange={handleInputChange}
                    style={styles.radioInput}
                  />
                  <span style={formData.estadoCategoria === "inactivo" ? styles.radioActive : styles.radioInactive}>
                    Inactivo
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div style={styles.error}>
                <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
                {error}
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button 
                type="submit" 
                style={isEditing ? styles.updateButton : styles.saveButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={styles.buttonIcon}></i> Procesando...
                  </>
                ) : isEditing ? (
                  <>
                    <i className="fas fa-save" style={styles.buttonIcon}></i> Actualizar
                  </>
                ) : (
                  <>
                    <i className="fas fa-save" style={styles.buttonIcon}></i> Guardar
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  <i className="fas fa-times" style={styles.buttonIcon}></i> Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de categorías */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <h2 style={styles.cardHeader}>
              <i className="fas fa-list" style={styles.icon}></i> Categorías Registradas
            </h2>
            <div style={styles.searchContainer}>
              <i className="fas fa-search" style={styles.searchIcon}></i>
              <input
                type="text"
                placeholder="Buscar categorías..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.tableContainer}>
            {isLoading && !categorias.length ? (
              <div style={styles.loading}>
                <i className="fas fa-spinner fa-spin" style={styles.loadingIcon}></i> Cargando categorías...
              </div>
            ) : filteredCategorias.length === 0 ? (
              <div style={styles.noData}>
                <i className="fas fa-box-open" style={styles.noDataIcon}></i>
                {searchTerm ? "No se encontraron categorías" : "No hay categorías registradas"}
              </div>
            ) : (
              <div style={styles.responsiveTable}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>Nombre</th>
                      <th style={styles.tableHeader}>Descripción</th>
                      <th style={styles.tableHeader}>Estado</th>
                      <th style={{ ...styles.tableHeader, width: '150px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategorias.map((categoria) => (
                      <tr key={categoria._id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <div style={styles.cellContent}>
                            <i className="fas fa-tag" style={styles.cellIcon}></i>
                            {categoria.nombre_categoria}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.cellContent}>
                            <i className="fas fa-align-left" style={styles.cellIcon}></i>
                            {categoria.descripcion}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={getStatusStyle(categoria.estado)}>
                            {categoria.estado === "activo" ? (
                              <i className="fas fa-check-circle" style={styles.statusIcon}></i>
                            ) : (
                              <i className="fas fa-times-circle" style={styles.statusIcon}></i>
                            )}
                            {categoria.estado}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button
                              style={styles.editButton}
                              onClick={() => editarCategoria(categoria)}
                              disabled={isLoading}
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => eliminarCategoria(categoria._id)}
                              disabled={isLoading}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  };

  switch (status) {
    case "activo":
      return { 
        ...baseStyle, 
        backgroundColor: "#D4EDDA",
        color: "#155724",
        border: "1px solid #155724"
      };
    case "inactivo":
      return { 
        ...baseStyle, 
        backgroundColor: "#F8D7DA",
        color: "#721C24",
        border: "1px solid #721C24"
      };
    default:
      return baseStyle;
  }
};

const styles = {
  container: {
    padding: "2rem",
    paddingTop: "5rem",
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2.25rem",
    fontWeight: "700",
    paddingBottom: "0.6rem"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    alignItems: "start"
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    marginBottom: "2rem",
    overflow: "hidden",
    position: "sticky",
    top: "20px"
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    overflow: "hidden"
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    paddingRight: "1rem"
  },
  cardHeader: {
    backgroundColor: "#2C3E50",
    color: "white",
    padding: "1.25rem",
    fontSize: "1.25rem",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  icon: {
    fontSize: "1.1rem"
  },
  form: {
    padding: "1.5rem 1.75rem"
  },
  formGroup: {
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    marginBottom: "0.75rem",
    color: "#495057",
    fontWeight: "600",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  inputIcon: {
    color: "#6c757d",
    width: "20px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "0.875rem",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
    ":focus": {
      borderColor: "#2C3E50",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(44, 62, 80, 0.1)",
      backgroundColor: "white"
    }
  },
  radioGroup: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "0.5rem"
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  radioInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0
  },
  radioActive: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    backgroundColor: "#2C3E50",
    color: "white",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  radioInactive: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    backgroundColor: "#f1f5f9",
    color: "#495057",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#e2e8f0"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.75rem"
  },
  saveButton: {
    backgroundColor: "#2C3E50",
    color: "white",
    padding: "0.875rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#1a252f",
      transform: "translateY(-1px)"
    },
    ":disabled": {
      backgroundColor: "#95a5a6",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  updateButton: {
    backgroundColor: "#2C3E50",
    color: "white",
    padding: "0.875rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#1a252f",
      transform: "translateY(-1px)"
    },
    ":disabled": {
      backgroundColor: "#95a5a6",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.875rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#5a6268",
      transform: "translateY(-1px)"
    },
    ":disabled": {
      backgroundColor: "#bdc3c7",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  buttonIcon: {
    fontSize: "0.9rem"
  },
  error: {
    color: "#dc3545",
    backgroundColor: "#f8d7da",
    padding: "0.875rem",
    borderRadius: "6px",
    marginTop: "1.5rem",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  errorIcon: {
    fontSize: "1rem"
  },
  loading: {
    padding: "2.5rem",
    textAlign: "center",
    color: "#2C3E50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    fontSize: "1rem",
    fontWeight: "500"
  },
  loadingIcon: {
    fontSize: "1.25rem"
  },
  noData: {
    padding: "2.5rem",
    textAlign: "center",
    color: "#6c757d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    fontSize: "1rem"
  },
  noDataIcon: {
    fontSize: "2rem",
    color: "#ced4da",
    marginBottom: "0.5rem"
  },
  searchContainer: {
    position: "relative",
    minWidth: "250px"
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#adb5bd",
    fontSize: "0.9rem"
  },
  searchInput: {
    width: "100%",
    padding: "0.625rem 1rem 0.625rem 2.25rem",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
    ":focus": {
      borderColor: "#2C3E50",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(44, 62, 80, 0.1)",
      backgroundColor: "white"
    }
  },
  tableContainer: {
    overflowX: "auto",
    padding: "0"
  },
  responsiveTable: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    fontSize: "0.9rem"
  },
  tableHeaderRow: {
    backgroundColor: "#2C3E50",
    color: "white"
  },
  tableHeader: {
    padding: "1rem 1.25rem",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tableRow: {
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f8f9fa"
    },
    ":nth-child(even)": {
      backgroundColor: "#f8f9fa"
    }
  },
  tableCell: {
    padding: "1rem 1.25rem",
    verticalAlign: "middle",
    borderBottom: "1px solid #dee2e6"
  },
  cellContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  cellIcon: {
    color: "#6c757d",
    fontSize: "0.9rem",
    minWidth: "18px"
  },
  statusIcon: {
    fontSize: "0.8rem"
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem"
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "0.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-1px)"
    },
    ":disabled": {
      backgroundColor: "#bdc3c7",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "0.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      backgroundColor: "#c0392b",
      transform: "translateY(-1px)"
    },
    ":disabled": {
      backgroundColor: "#e0e0e0",
      cursor: "not-allowed",
      transform: "none"
    }
  }
};