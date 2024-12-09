import React, { useEffect, useState } from "react";

export default function OrdenForm() {
  const [numeroOrden, setNumeroOrden] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [detallesOrdenes, setDetallesOrdenes] = useState([]);

  const limpiarFormulario = () => {
    setProductoSeleccionado("");
    setCantidad(1);
    setPrecioUnitario(0);
    setPersonalizacion("");
  };


  // Cargar datos iniciales
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [
          responseCateg, 
          responseProd, 
          responseOrd,
          responseDetOrd
        ] = await Promise.all([
          fetch("http://localhost:9001/api/categorias"),
          fetch("http://localhost:9001/api/productos"),
          fetch("http://localhost:9001/api/ordenes"),
          fetch("http://localhost:9001/api/detalle_ordenes")
        ]);

        const categorias = await responseCateg.json();
        const productos = await responseProd.json();
        const ordenes = await responseOrd.json();
        const detallesOrdenes = await responseDetOrd.json();

        setCategorias(categorias);
        setProductos(productos);
        setOrdenes(ordenes);
        setDetallesOrdenes(detallesOrdenes);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos iniciales");
      }
    };

    fetchDatos();
  }, []);

  // Autocompletar campos al seleccionar producto
  useEffect(() => {
    if (productoSeleccionado) {
      const producto = productos.find(
        (p) => p.numero_producto === parseInt(productoSeleccionado)
      );
      if (producto) {
        setPrecioUnitario(producto.precio);
        setCategoriaNombre(producto.categoria);
      }
    }
  }, [productoSeleccionado, productos]);

  const manejarEnvioFormulario = async (event) => {
    event.preventDefault();
    setError("");
  
    // Validaciones
    if (!productoSeleccionado) {
      setError("Debe seleccionar un producto");
      return;
    }
    if (cantidad < 1) {
      setError("La cantidad debe ser al menos 1");
      return;
    }
    if (precioUnitario < 0) {
      setError("El precio unitario no puede ser negativo");
      return;
    }
  
    // Obtener información adicional del producto
    try {
      const respuestaProducto = await fetch(`http://localhost:9001/api/productos/`);
      const producto = await respuestaProducto.json();
  
      // Preparar datos para envío
      const datosDetalleOrden = {
        numero_producto: productoSeleccionado.toString(), // Convertir a string
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precioUnitario),
        personalizacion: personalizacion || "",
        producto_nombre: producto.nombre, // Añadir nombre del producto
        categoria_nombre: producto.categoria, // Añadir categoría del producto
      };
  
      const response = await fetch("http://localhost:9001/api/detalle_ordenes", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosDetalleOrden),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el detalle de la orden");
      }
  
      const detalleOrdenCreado = await response.json();
      
      setDetallesOrdenes(prevDetalles => [...prevDetalles, detalleOrdenCreado]);
      limpiarFormulario();
      alert("Detalle de orden registrado exitosamente");
    } catch (err) {
      console.error("Error al enviar datos:", err);
      setError(err.message || "Error al registrar el detalle de la orden");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Registrar Detalle de Orden</h2>
        <form onSubmit={manejarEnvioFormulario} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Seleccionar Producto:</label>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option 
                  key={producto.numero_producto} 
                  value={producto.numero_producto}
                >
                  {producto.nombre} (Número: {producto.numero_producto})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoría:</label>
            <input
              type="text"
              value={categoriaNombre}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cantidad:</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Precio Unitario:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Personalización:</label>
            <input
              type="text"
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subir Archivo:</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Registrar Detalle
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Detalles de Órdenes Registrados</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Número Orden</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {detallesOrdenes.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.numero_orden}</td>
                <td>{detalle.producto_nombre}</td>
                <td>{detalle.categoria_nombre}</td>
                <td>{detalle.cantidad}</td>
                <td>${detalle.precio_unitario.toFixed(2)}</td>
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "30px",
    padding: "0 10px", // Añadir padding para evitar que el contenido toque los bordes
  },
  card: {
    width: "100%", // Cambiar a 100% para que ocupe todo el ancho disponible
    maxWidth: "600px", // Mantener el ancho máximo
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  listContainer: {
    width: "100%", // Cambiar a 100% para que ocupe todo el ancho disponible
    maxWidth: "600px", // Mantener el ancho máximo
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginTop: "20px", // Añadir margen superior para separar del formulario
  },
  listHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%", // Asegurarse de que la tabla ocupe todo el ancho
    borderCollapse: "collapse", // Para que las celdas se vean bien
  },
  th: {
    padding: "10px",
    borderBottom: "2px solid #ddd",
    textAlign: "left", // Alinear texto a la izquierda
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

// Asegúrate de aplicar los estilos de la tabla en el componente