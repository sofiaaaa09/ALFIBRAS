import { useState, useEffect } from "react";
import api from "../componentes/api";
import localforage from "localforage";

export default function ProductForm({ productoSelec }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState(""); 
  const [cantidadInicial, setCantidadInicial] = useState(0);
  const [stockMin, setStockMin] = useState(0);
  const [stockMax, setStockMax] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (error) {
        setError("No se pudieron cargar las categorías.");
      }
    };
    
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos");
        setProductos(response.data);
        localforage.setItem("productos", response.data);
      } catch (error) {
        setError("No se pudieron cargar los productos.");
      }
    };

    fetchCategorias();
    fetchProductos();

    if (productoSelec) {
      setNombre(productoSelec.nombre);
      setDescripcion(productoSelec.descripcion);
      setPrecio(productoSelec.precio);
      setCategoria(productoSelec.categoria);
      setCantidadInicial(productoSelec.cantidadInicial);
      setStockMin(productoSelec.stockMin);
      setStockMax(productoSelec.stockMax);
      setId(productoSelec._id);
      setIsEditing(true);
    }
  }, [productoSelec]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Función para manejar cambios en el campo de precio
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setPrecio(rawValue === '' ? 0 : parseInt(rawValue));
  };

  const agregarProducto = async (event) => {
    event.preventDefault();
    try {
      await api.post("/productos", {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        cantidad_inicial: cantidadInicial,
        stock_min: stockMin,
        stock_max: stockMax,
      });
      setError("");
      alert("Producto registrado exitosamente.");
      const response = await api.get("/productos");
      setProductos(response.data);
      localforage.setItem("productos", response.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const actualizarProducto = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/productos/${id}`, {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        cantidad_inicial: cantidadInicial,
        stock_min: stockMin,
        stock_max: stockMax,
      });
      alert("Producto modificado correctamente.");
      const response = await api.get("/productos");
      setProductos(response.data);
      localforage.setItem("productos", response.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        alert("Producto eliminado correctamente.");
        const response = await api.get("/productos");
        setProductos(response.data);
        localforage.setItem("productos", response.data);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setCategoria("");
    setCantidadInicial(0);
    setStockMin(0);
    setStockMax(0);
    setId("");
    setIsEditing(false);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categorias.find(c => c._id === producto.categoria)?.nombre_categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h1>
      
      <div style={styles.twoColumnsLayout}>
        {/* Columna Izquierda - Formulario */}
        <div style={styles.formColumn}>
          <div style={styles.formCard}>
            <h2 style={styles.cardHeader}>
              <i className="fas fa-box" style={styles.icon}></i>
              {isEditing ? "Editar Producto" : "Registrar Producto"}
            </h2>
            <form onSubmit={isEditing ? actualizarProducto : agregarProducto} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <i className="fas fa-tag" style={styles.inputIcon}></i> Nombre del Producto
                  </label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder='Ej: Producto Nuevo'
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                   <i className="fas fa-dollar-sign" style={styles.inputIcon}></i> Precio
                  </label>
                 <div style={styles.inputWithSymbol}>
                 <span style={styles.currencySymbol}>$</span>
                <input
                 type="text"
                  style={{...styles.input, paddingLeft: "30px"}}
                  placeholder="0"
                 value={formatPrice(precio)}
                 onChange={handlePriceChange}
                  required
                  />
                 </div>
                 </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <i className="fas fa-align-left" style={styles.inputIcon}></i> Descripción
                </label>
                <textarea
                  style={{...styles.input, minHeight: "100px"}}
                  placeholder="Describe las características del producto..."
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                  required
                />
              </div>

              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <i className="fas fa-list" style={styles.inputIcon}></i> Categoría
                  </label>
                  <select
                    style={styles.select}
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <i className="fas fa-boxes" style={styles.inputIcon}></i> Cantidad Inicial
                  </label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="0"
                    onChange={(e) => setCantidadInicial(e.target.value)}
                    value={cantidadInicial}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <i className="fas fa-exclamation-triangle" style={styles.inputIcon}></i> Stock Mínimo
                  </label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="0"
                    onChange={(e) => setStockMin(e.target.value)}
                    value={stockMin}
                    required
                    min="0"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <i className="fas fa-check-circle" style={styles.inputIcon}></i> Stock Máximo
                  </label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="0"
                    onChange={(e) => setStockMax(e.target.value)}
                    value={stockMax}
                    required
                    min="0"
                  />
                </div>
              </div>

              {error && (
                <div style={styles.error}>
                  <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
                  {error}
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button type="submit" style={isEditing ? styles.updateButton : styles.saveButton}>
                  {isEditing ? (
                    <>
                      <i className="fas fa-save" style={styles.buttonIcon}></i> Actualizar Producto
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus-circle" style={styles.buttonIcon}></i> Guardar Producto
                    </>
                  )}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    style={styles.cancelButton}
                    onClick={resetForm}
                  >
                    <i className="fas fa-times" style={styles.buttonIcon}></i> Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Columna Derecha - Lista de Productos */}
        <div style={styles.listColumn}>
          <div style={styles.listCard}>
            <div style={styles.listHeader}>
              <h2 style={styles.cardHeader}>
                <i className="fas fa-list-ul" style={styles.icon}></i> Productos Registrados
              </h2>
              <div style={styles.searchContainer}>
                <i className="fas fa-search" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.tableContainer}>
              {productos.length === 0 ? (
                <div style={styles.noData}>
                  <i className="fas fa-box-open" style={styles.noDataIcon}></i>
                  No hay productos registrados
                </div>
              ) : (
                <div style={styles.responsiveTable}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Nombre</th>
                        <th style={styles.tableHeader}>Descripción</th>
                        <th style={styles.tableHeader}>Precio</th>
                        <th style={styles.tableHeader}>Categoría</th>
                        <th style={styles.tableHeader}>Stock</th>
                        <th style={styles.tableHeader}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.map((producto) => (
                        <tr key={producto._id} style={styles.tableRow}>
                          <td style={styles.tableCell}>
                            <div style={styles.cellContent}>
                              <i className="fas fa-box" style={styles.cellIcon}></i>
                              {producto.nombre}
                            </div>
                          </td>
                          <td style={{...styles.tableCell, maxWidth: "300px"}}>
                            <div style={styles.cellContent}>
                              <i className="fas fa-align-left" style={styles.cellIcon}></i>
                              <span style={styles.truncateText}>{producto.descripcion}</span>
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                         <div style={styles.cellContent}>
                            <i className="fas fa-dollar-sign" style={styles.cellIcon}></i>
                             {formatPrice(producto.precio)}
                         </div>
                           </td>
                          <td style={styles.tableCell}>
                            <div style={styles.cellContent}>
                              <i className="fas fa-tag" style={styles.cellIcon}></i>
                              {categorias.find(c => c._id === producto.categoria)?.nombre_categoria || producto.categoria}
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                            <div style={styles.stockIndicator}>
                              <span style={styles.stockValue}>{producto.cantidad_inicial}</span>
                              {producto.stock_min > 0 && producto.cantidad_inicial <= producto.stock_min && (
                                <span style={styles.lowStock}>Bajo stock</span>
                              )}
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                            <div style={styles.actionButtons}>
                              <button
                                style={styles.editButton}
                                onClick={() => {
                                  setNombre(producto.nombre);
                                  setDescripcion(producto.descripcion);
                                  setPrecio(producto.precio);
                                  setCategoria(producto.categoria);
                                  setCantidadInicial(producto.cantidad_inicial);
                                  setStockMin(producto.stock_min);
                                  setStockMax(producto.stock_max);
                                  setId(producto._id);
                                  setIsEditing(true);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                style={styles.deleteButton}
                                onClick={() => eliminarProducto(producto._id)}
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
    </div>
  );
}

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
    paddingBottom: "0.5rem"
  },
  twoColumnsLayout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    '@media (max-width: 768px)': {
      flexDirection: 'column'
    }
  },
  formColumn: {
    flex: '1',
    minWidth: '400px',
    position: 'sticky',
    top: '20px'
  },
  listColumn: {
    flex: '2',
    minWidth: '0'
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    marginBottom: "2rem"
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    height: '100%'
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "1rem",
    '@media (max-width: 500px)': {
      gridTemplateColumns: "1fr"
    }
  },
  formGroup: {
    marginBottom: "1.25rem"
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
  inputWithSymbol: {
    position: "relative"
  },
  currencySymbol: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#495057",
    fontWeight: "500"
  },
  select: {
    width: "100%",
    padding: "0.875rem",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "0.95rem",
    backgroundColor: "#f8fafc",
    appearance: "none",
    ":focus": {
      borderColor: "#2C3E50",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(44, 62, 80, 0.1)"
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
    flex: "1",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#1a252f",
      transform: "translateY(-1px)"
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
    flex: "1",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#1a252f",
      transform: "translateY(-1px)"
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
    flex: "1",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#5a6268",
      transform: "translateY(-1px)"
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
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    paddingRight: "1rem"
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
  truncateText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "250px",
    display: "inline-block"
  },
  stockIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  stockValue: {
    fontWeight: "500"
  },
  lowStock: {
    fontSize: "0.75rem",
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "2px 6px",
    borderRadius: "4px"
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem"
  },
  editButton: {
    backgroundColor: "#2C3E50",
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
      backgroundColor: "#1a252f",
      transform: "translateY(-1px)"
    }
  },
  deleteButton: {
    backgroundColor: "#dc3545",
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
      backgroundColor: "#bd2130",
      transform: "translateY(-1px)"
    }
  }
};