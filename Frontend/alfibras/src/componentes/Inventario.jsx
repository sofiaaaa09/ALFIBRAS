import { useState, useEffect } from "react";
import axios from "axios";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const verificarStock = (productos) => {
    const productosConStockBajo = productos.filter(
      (producto) => producto.cantidad_inicial < producto.stock_min || producto.cantidad_inicial < 10
    );
    setAlertas(productosConStockBajo);
  };

  const fetchProductos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:9001/api/productos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setProductos(response.data);
      verificarStock(response.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inventario de Productos</h2>

      {/* Alertas de stock bajo */}
      {alertas.length > 0 && (
        <div style={styles.alertContainer}>
          <h3 style={styles.alertTitle}>
            <i className="fas fa-exclamation-triangle" style={styles.alertIcon}></i> Productos con stock bajo
          </h3>
          <div style={styles.alertGrid}>
            {alertas.map((producto) => (
              <div key={producto._id} style={styles.alertItem}>
                <span style={styles.alertProduct}>{producto.nombre}</span>
                <span style={styles.alertStock}>
                  Stock: {producto.cantidad_inicial} (Mínimo: {producto.stock_min || 10})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <i className="fas fa-spinner fa-spin" style={styles.loadingIcon}></i>
          <p>Cargando inventario...</p>
        </div>
      ) : (
        <div style={styles.cardContainer}>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div 
                key={producto._id} 
                style={{
                  ...styles.card,
                  borderLeft: `5px solid ${producto.cantidad_inicial < (producto.stock_min || 10) ? '#e74c3c' : '#2C3E50'}`
                }}
              >
                <h3 style={styles.productName}>
                  <i className="fas fa-box" style={styles.productIcon}></i> {producto.nombre}
                </h3>
                <p style={styles.category}>
                  <i className="fas fa-tag" style={styles.categoryIcon}></i> {producto.categoria}
                </p>
                <div style={styles.stockContainer}>
                  <p style={styles.stock}>
                    <i className="fas fa-boxes" style={styles.stockIcon}></i> Stock: {producto.cantidad_inicial}
                  </p>
                  <p style={styles.price}>
                    <i className="fas fa-dollar-sign" style={styles.priceIcon}></i> {producto.precio?.toLocaleString('es-CO')}
                  </p>
                </div>
                {producto.cantidad_inicial < (producto.stock_min || 10) && (
                  <div style={styles.lowStockBadge}>
                    <i className="fas fa-exclamation-circle"></i> Stock bajo
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={styles.noProducts}>
              <i className="fas fa-box-open" style={styles.noProductsIcon}></i>
              <p>No hay productos en el inventario</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    paddingTop: "5rem",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "700",
    paddingBottom: "0.5rem"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    position: "relative",
    transition: "transform 0.2s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
    }
  },
  productName: {
    color: "#2C3E50",
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  productIcon: {
    color: "#3498db"
  },
  category: {
    color: "#7f8c8d",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  categoryIcon: {
    color: "#95a5a6"
  },
  stockContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem"
  },
  stock: {
    color: "#2C3E50",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  stockIcon: {
    color: "#2ecc71"
  },
  price: {
    color: "#2C3E50",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  priceIcon: {
    color: "#f39c12"
  },
  lowStockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem"
  },
  alertContainer: {
    backgroundColor: "#f8d7da",
    borderLeft: "4px solid #dc3545",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "2rem",
    maxWidth: "1200px",
    margin: "0 auto 2rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
  },
  alertTitle: {
    color: "#dc3545",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  alertIcon: {
    fontSize: "1.2rem"
  },
  alertGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "0.5rem"
  },
  alertItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f1aeb5"
  },
  alertProduct: {
    fontWeight: "500",
    color: "#212529"
  },
  alertStock: {
    color: "#dc3545",
    fontWeight: "500"
  },
  noProducts: {
    textAlign: "center",
    gridColumn: "1 / -1",
    color: "#7f8c8d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem"
  },
  noProductsIcon: {
    fontSize: "2rem",
    color: "#bdc3c7"
  },
  loadingContainer: {
    textAlign: "center",
    color: "#2C3E50",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem"
  },
  loadingIcon: {
    fontSize: "2rem",
    color: "#2C3E50"
  }
};

