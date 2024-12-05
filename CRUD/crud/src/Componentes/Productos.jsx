import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ productoSelec }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState(""); // El nombre de la categoría
  const [cantidadInicial, setCantidadInicial] = useState(0);
  const [stockMin, setStockMin] = useState(0);
  const [stockMax, setStockMax] = useState(0);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías disponibles
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos registrados
  const [isEditing, setIsEditing] = useState(false);

  // Obtener categorías y productos al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/categorias");
        console.log(response.data);
        setCategorias(response.data); // Establecer las categorías en el estado
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setError("No se pudieron cargar las categorías.");
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/productos");
        setProductos(response.data); // Establecer los productos en el estado
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("No se pudieron cargar los productos.");
      }
    };

    fetchCategorias();
    fetchProductos();

    if (productoSelec) {
      setNombre(productoSelec.nombre);
      setDescripcion(productoSelec.descripcion);
      setPrecio(productoSelec.precio);
      setCategoria(productoSelec.categoria); // Setea la categoría seleccionada
      setCantidadInicial(productoSelec.cantidadInicial);
      setStockMin(productoSelec.stockMin);
      setStockMax(productoSelec.stockMax);
      setId(productoSelec._id);
      setIsEditing(true);
    }
  }, [productoSelec]); // Asegura que se recargue cuando el producto seleccionado cambie

  // Crear un nuevo producto
  const agregarProducto = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:9001/api/productos", {
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
      // Vuelve a cargar los productos
      const response = await axios.get("http://localhost:9001/api/productos");
      console.log(response.data);
      setProductos(response.data);
    } catch (err) {
      console.error("Error al enviar el formulario:", err.response?.data);
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  // Actualizar producto existente
  const actualizarProducto = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:9001/api/productos/${id}`, {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        cantidad_inicial: cantidadInicial,
        stock_min: stockMin,
        stock_max: stockMax,
      });
      alert("Producto modificado correctamente.");
      // Vuelve a cargar los productos
      const response = await axios.get("http://localhost:9001/api/productos");
      setProductos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  // Eliminar un producto
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:9001/api/productos/${id}`);
        alert("Producto eliminado correctamente.");
        // Vuelve a cargar los productos
        const response = await axios.get("http://localhost:9001/api/productos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {isEditing ? "Modificar Producto" : "Registrar Producto"}
        </div>
        <div style={styles.cardBody}>
          <form>
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>
                {isEditing ? "Modificar Producto" : "Registrar Producto"}
              </legend>
              <div style={styles.formGroup}>
                <label htmlFor="txtNombre" style={styles.label}>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  id="txtNombre"
                  style={styles.input}
                  placeholder="Nombre del producto"
                  onChange={(e) => setNombre(e.target.value)}
                  value={nombre}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtDescripcion" style={styles.label}>
                  Descripción del Producto
                </label>
                <textarea
                  id="txtDescripcion"
                  style={styles.input}
                  placeholder="Descripción del producto"
                  rows="3"
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                ></textarea>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtPrecio" style={styles.label}>
                  Precio del Producto
                </label>
                <input
                  type="number"
                  id="txtPrecio"
                  style={styles.input}
                  placeholder="Precio del producto"
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="categoria" style={styles.label}>
                  Categoría
                </label>
                <select
                  id="categoria"
                  style={styles.input}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat._id} value={cat.nombre_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtCantidadInicial" style={styles.label}>
                  Cantidad Inicial
                </label>
                <input
                  type="number"
                  id="txtCantidadInicial"
                  style={styles.input}
                  placeholder="Cantidad inicial"
                  onChange={(e) => setCantidadInicial(e.target.value)}
                  value={cantidadInicial}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtStockMin" style={styles.label}>
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  id="txtStockMin"
                  style={styles.input}
                  placeholder="Stock mínimo"
                  onChange={(e) => setStockMin(e.target.value)}
                  value={stockMin}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="txtStockMax" style={styles.label}>
                  Stock Máximo
                </label>
                <input
                  type="number"
                  id="txtStockMax"
                  style={styles.input}
                  placeholder="Stock máximo"
                  onChange={(e) => setStockMax(e.target.value)}
                  value={stockMax}
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
              onClick={actualizarProducto}
            >
              Modificar
            </button>
          ) : (
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: "#28a745" }}
              onClick={agregarProducto}
            >
              Guardar Producto
            </button>
          )}
        </div>
      </div>

      {/* Lista de productos registrados */}
      <div style={styles.productList}>
        <h3>Productos Registrados</h3>
        <ul style={styles.productListUl}>
          {productos.map((producto) => (
            <li key={producto._id} style={styles.productListItem}>
              <strong>{producto.nombre}</strong> - {producto.categoria} - ${producto.precio}
              <div>
                <button
                  style={styles.buttonEdit}
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
                  }}
                >
                  Editar
                </button>
                <button
                  style={styles.buttonDelete}
                  onClick={() => eliminarProducto(producto._id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "20px",
    overflowY: "auto",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    marginBottom: "20px",
    padding: "20px",
  },
  cardHeader: {
    backgroundColor: "#2C3E50",
    color: "white",
    fontSize: "1.5rem",
    padding: "15px",
    textAlign: "center",
    borderRadius: "8px 8px 0 0",
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
    backgroundColor: "#2C3E50",
  },
  buttonDelete: {
    padding: "5px 10px",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "5px",
  },
  buttonEdit: {
    padding: "5px 10px",
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "5px",
  },
  productList: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  productListUl: {
    listStyleType: "none",
    padding: "0",
  },
  productListItem: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
  },
};