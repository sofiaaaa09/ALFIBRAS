import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function DetalleOrden() {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [productoInfo, setProductoInfo] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [personalizacion, setPersonalizacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9001/api/productos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(response.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos");
        showErrorAlert("Error al cargar productos", err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    if (productoSeleccionado) {
      const producto = productos.find(p => p._id === productoSeleccionado);
      setProductoInfo(producto);
    } else {
      setProductoInfo(null);
    }
  }, [productoSeleccionado, productos]);

  const showErrorAlert = (title, message) => {
    MySwal.fire({
      title: <strong>{title}</strong>,
      html: <p>{message}</p>,
      icon: 'error',
      confirmButtonColor: '#2C3E50'
    });
  };

  const showSuccessAlert = (title, message) => {
    MySwal.fire({
      title: <strong>{title}</strong>,
      html: <p>{message}</p>,
      icon: 'success',
      confirmButtonColor: '#2C3E50'
    });
  };

  const agregarProducto = () => {
    if (!productoInfo) {
      setError("Seleccione un producto válido");
      showErrorAlert("Error", "Debe seleccionar un producto válido");
      return;
    }

    if (cantidad < 1 || isNaN(cantidad)) {
      setError("Ingrese una cantidad válida (mínimo 1)");
      showErrorAlert("Error", "La cantidad debe ser al menos 1");
      return;
    }

    const nuevoDetalle = {
      producto_id: productoInfo._id,
      numero_producto: productoInfo.numero_producto,
      producto_nombre: productoInfo.nombre,
      categoria_nombre: productoInfo.categoria,
      cantidad: Number(cantidad),
      precio_unitario: productoInfo.precio,
      personalizacion: personalizacion.trim(),
      archivo: archivo ? archivo.name : null,
      archivoBase64: archivo ? null : null
    };

    setDetalles([...detalles, nuevoDetalle]);
    setTotal(total + (nuevoDetalle.cantidad * nuevoDetalle.precio_unitario));
    resetCampos();
  };

  const eliminarProducto = (index) => {
    const detalleEliminado = detalles[index];
    setDetalles(detalles.filter((_, i) => i !== index));
    setTotal(total - (detalleEliminado.cantidad * detalleEliminado.precio_unitario));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const enviarOrden = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    if (detalles.length === 0) {
      setError("Agregue al menos un producto");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      
      const datosParaEnviar = {
        productos: detalles.map(detalle => ({
          numero_producto: detalle.numero_producto,
          producto_nombre: detalle.producto_nombre,
          categoria_nombre: detalle.categoria_nombre,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario
        })),
        total: total
      };
  
      const response = await axios.post(
        "http://localhost:9001/api/detalle_ordenes",
        datosParaEnviar,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (response.status === 201) {
        showSuccessAlert("Éxito", "Orden creada exitosamente!");
        resetTodo();
        navigate("/ordenes");
      }
    } catch (err) {
      console.error("Error al crear orden:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al crear la orden");
      showErrorAlert("Error", err.response?.data?.message || "Error al crear la orden");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCampos = () => {
    setProductoSeleccionado("");
    setProductoInfo(null);
    setCantidad(1);
    setPersonalizacion("");
    setArchivo(null);
    setError("");
  };

  const resetTodo = () => {
    resetCampos();
    setDetalles([]);
    setTotal(0);
  };

  return (
    <div className="orden-container">
      <h1 className="orden-title" style={{ marginTop: '3rem', marginBottom: '2.5rem' }}>Nuevo Detalle Orden</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="orden-grid">
        <div className="form-container">
          <h2 className="form-title">Agregar Productos</h2>
          
          <div className="form-group">
            <label className="form-label">Producto</label>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              className="form-select"
              disabled={isLoading || isSubmitting}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre} - ${producto.precio.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {productoInfo && (
            <>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  value={productoInfo.categoria}
                  readOnly
                  className="form-input-readonly"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Precio Unitario</label>
                <input
                  type="text"
                  value={`$${productoInfo.precio.toFixed(2)}`}
                  readOnly
                  className="form-input-readonly"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="form-input"
              disabled={isLoading || isSubmitting || !productoSeleccionado}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Personalización (Opcional)</label>
            <textarea
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              className="form-textarea"
              rows="3"
              disabled={isLoading || isSubmitting || !productoSeleccionado}
              placeholder="Indique cualquier detalle de personalización..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Archivo Adjunto (Opcional)</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="form-file-input"
              disabled={isLoading || isSubmitting || !productoSeleccionado}
            />
            {archivo && (
              <p className="file-info">Archivo seleccionado: {archivo.name}</p>
            )}
          </div>

          <button
            type="button"
            onClick={agregarProducto}
            className="add-button"
            disabled={isLoading || isSubmitting || !productoSeleccionado}
          >
            {isLoading ? "Cargando..." : "Agregar Producto"}
          </button>
        </div>

        <div className="summary-container">
          <h2 className="summary-title">Resumen de la Orden</h2>
          
          {detalles.length === 0 ? (
            <p className="empty-message">No hay productos agregados</p>
          ) : (
            <>
              <div className="table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{detalle.producto_nombre}</span>
                            {detalle.personalizacion && (
                              <span className="personalization">Personalización: {detalle.personalizacion}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">{detalle.cantidad}</td>
                        <td className="text-right">${detalle.precio_unitario.toFixed(2)}</td>
                        <td className="text-right">${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                        <td className="text-center">
                          <button
                            onClick={() => eliminarProducto(index)}
                            className="delete-button"
                            disabled={isSubmitting}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="total-container">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>IVA (19%):</span>
                  <span>${(total * 0.19).toFixed(2)}</span>
                </div>
                <div className="total-line grand-total">
                  <span>Total:</span>
                  <span>${(total * 1.19).toFixed(2)}</span>
                </div>
              </div>

              <div className="actions-container">
                <button
                  onClick={resetTodo}
                  className="cancel-button"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarOrden}
                  className="submit-button"
                  disabled={isSubmitting || detalles.length === 0}
                >
                  {isSubmitting ? (
                    <span className="button-loading">
                      <span className="spinner"></span> Procesando...
                    </span>
                  ) : (
                    "Confirmar Orden"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .orden-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .orden-title {
          font-size: 2rem;
          font-weight: 600;
          color: #2C3E50;
          text-align: center;
          border-bottom: 2px solid #2C3E50;
          padding-bottom: 0.5rem;
        }

        .error-message {
          background-color: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #dc2626;
        }

        .orden-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .orden-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-container, .summary-container {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
        }

        .form-title, .summary-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2C3E50;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .form-select, .form-input, .form-textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-select:focus, .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #2C3E50;
          box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.2);
        }

        .form-input-readonly {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          background-color: #f7fafc;
          color: #718096;
        }

        .form-file-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px dashed #cbd5e0;
          border-radius: 0.375rem;
          background-color: #f8fafc;
        }

        .file-info {
          font-size: 0.875rem;
          color: #4a5568;
          margin-top: 0.5rem;
        }

        .add-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2C3E50;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .add-button:hover {
          background-color: #1a252f;
        }

        .add-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .empty-message {
          color: #718096;
          text-align: center;
          padding: 1rem;
        }

        .table-container {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .order-table {
          width: 100%;
          border-collapse: collapse;
        }

        .order-table th, .order-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .order-table th {
          background-color: #f7fafc;
          font-weight: 600;
          color: #2C3E50;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .order-table tr:hover {
          background-color: #f8f9fa;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 500;
        }

        .personalization {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.25rem;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        .delete-button {
          color: #e53e3e;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: color 0.2s;
        }

        .delete-button:hover {
          color: #c53030;
          text-decoration: underline;
        }

        .delete-button:disabled {
          color: #a0aec0;
          cursor: not-allowed;
          text-decoration: none;
        }

        .total-container {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #f8fafc;
          border-radius: 0.375rem;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .grand-total {
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }

        .actions-container {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .cancel-button, .submit-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .cancel-button:hover {
          background-color: #cbd5e0;
        }

        .submit-button {
          background-color: #2C3E50;
          color: white;
        }

        .submit-button:hover {
          background-color: #1a252f;
        }

        .submit-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}