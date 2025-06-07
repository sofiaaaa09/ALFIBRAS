import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Ordenes() {
  // Estados principales
  const [detallesOrden, setDetallesOrden] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [nuevaOrden, setNuevaOrden] = useState({
    cliente_correo: '',
    estado: 'pendiente',
    detalles: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creandoOrden, setCreandoOrden] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Cargar detalles de orden y clientes en paralelo
        const [detallesResponse, clientesResponse] = await Promise.all([
          axios.get('http://localhost:9001/api/detalle_ordenes', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:9001/api/clientes', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Procesar detalles de orden
        const detallesData = detallesResponse.data?.success 
          ? detallesResponse.data.data 
          : detallesResponse.data || [];
        setDetallesOrden(detallesData);

        // Procesar y normalizar datos de clientes
        let clientesData = [];
        if (Array.isArray(clientesResponse.data)) {
          clientesData = clientesResponse.data;
        } else if (clientesResponse.data?.data) {
          clientesData = clientesResponse.data.data;
        }

        const clientesValidos = clientesData
          .map(cliente => ({
            ...cliente,
            correo: cliente.correo || cliente.email || '',
            nombre: cliente.nombre || cliente.nombre_completo || 'Cliente sin nombre'
          }))
          .filter(cliente => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo));

        setClientes(clientesValidos);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message);
        MySwal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Seleccionar detalle de orden
  const seleccionarDetalle = (detalle) => {
    setOrdenSeleccionada(detalle);
    
    // Calcular total
    const total = Array.isArray(detalle.productos) 
      ? detalle.productos.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0)
      : (detalle.cantidad * detalle.precio_unitario);

    setNuevaOrden({
      cliente_correo: '',
      estado: 'pendiente',
      detalles: Array.isArray(detalle.productos) 
        ? detalle.productos.map(p => ({ 
            producto_id: p._id || p.producto_id,
            producto_nombre: p.producto_nombre,
            categoria_nombre: p.categoria_nombre,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario
          }))
        : [{
            producto_id: detalle._id,
            producto_nombre: detalle.producto_nombre,
            categoria_nombre: detalle.categoria_nombre,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario
          }],
      total
    });
  };

  // Función para generar número de orden
  const generarNumeroOrden = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ORD-${year}-${month}-${day}-${timestamp}-${random}`;
  };

  const crearNuevaOrden = async () => {
    try {
      // Validaciones
      if (!nuevaOrden.cliente_correo) {
        throw new Error('Debe seleccionar un cliente');
      }
  
      if (nuevaOrden.detalles.length === 0) {
        throw new Error('La orden debe contener al menos un producto');
      }
  
      setCreandoOrden(true);
      const token = localStorage.getItem('token');
  
      // Calcular el total correctamente
      const totalCalculado = nuevaOrden.detalles.reduce(
        (sum, item) => sum + (item.cantidad * item.precio_unitario),
        0
      );
  
      // Preparar datos para la API
      const datosOrden = {
        cliente_correo: nuevaOrden.cliente_correo,
        estado: nuevaOrden.estado,
        detalles: nuevaOrden.detalles.map(item => ({
          producto_id: item.producto_id,
          producto_nombre: item.producto_nombre,
          categoria_nombre: item.categoria_nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        })),
        total: totalCalculado, // Enviamos el total calculado
        numero_orden: generarNumeroOrden(),
        fecha: new Date().toISOString()
      };
  
      console.log('Datos a enviar:', JSON.stringify(datosOrden, null, 2));
  
      // Enviar a la API
      const response = await axios.post('http://localhost:9001/api/ordenes', datosOrden, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Manejar respuesta exitosa
      if (response.data.success) {
        MySwal.fire({
          title: '¡Éxito!',
          text: `Orden ${response.data.numero_orden} creada correctamente`,
          icon: 'success'
        });
  
        // Resetear formulario
        setNuevaOrden({
          cliente_correo: '',
          estado: 'pendiente',
          detalles: [],
          total: 0
        });
      } else {
        throw new Error(response.data.message || 'Error al crear la orden');
      }
  
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      let mensajeError = 'Error al crear la orden';
      if (error.response?.data) {
        // Intentar extraer el mensaje de error del HTML
        const errorMatch = error.response.data.match(/<pre>([^<]+)<\/pre>/);
        mensajeError = errorMatch ? errorMatch[1] : JSON.stringify(error.response.data);
      } else {
        mensajeError = error.message;
      }
  
      MySwal.fire({
        title: 'Error',
        text: mensajeError,
        icon: 'error'
      });
    } finally {
      setCreandoOrden(false);
    }
  };


  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      gap: '1rem'
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: '5px solid rgba(44, 62, 80, 0.2)',
        borderRadius: '50%',
        borderTopColor: '#2C3E50',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Cargando datos...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (error) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      gap: '1rem',
      color: '#dc3545'
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        background: '#dc3545',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>!</div>
      <p>Error: {error}</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '0.5rem 1rem',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginTop: '3rem',
        marginBottom: '3rem',
        color: '#2C3E50',
        fontWeight: '600'
      }}>Gestión de Órdenes</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Sección de detalles disponibles */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: '#2C3E50',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #dee2e6'
          }}>Detalles Disponibles</h2>
          
          {detallesOrden.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {detallesOrden.map((detalle) => (
                <div 
                  key={detalle._id} 
                  style={{
                    background: 'white',
                    border: ordenSeleccionada?._id === detalle._id ? '2px solid #2C3E50' : '1px solid #dee2e6',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: ordenSeleccionada?._id === detalle._id ? 'rgba(44, 62, 80, 0.05)' : 'white'
                  }}
                  onClick={() => seleccionarDetalle(detalle)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <span style={{
                      fontWeight: '600',
                      color: '#2C3E50'
                    }}>Detalle #{detalle.numero_orden}</span>
                    <span style={{
                      background: '#2C3E50',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {Array.isArray(detalle.productos) ? detalle.productos.length : 1} producto(s)
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    {Array.isArray(detalle.productos) ? (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {detalle.productos.slice(0, 3).map((producto, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0',
                            borderBottom: '1px dashed #dee2e6'
                          }}>
                            <span style={{ fontWeight: '500' }}>{producto.producto_nombre}</span>
                            <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                              {producto.cantidad} x ${producto.precio_unitario?.toLocaleString()}
                            </span>
                          </li>
                        ))}
                        {detalle.productos.length > 3 && (
                          <li style={{
                            textAlign: 'center',
                            color: '#2C3E50',
                            fontStyle: 'italic',
                            marginTop: '0.5rem'
                          }}>
                            +{detalle.productos.length - 3} más...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0'
                      }}>
                        <span style={{ fontWeight: '500' }}>{detalle.producto_nombre}</span>
                        <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                          {detalle.cantidad} x ${detalle.precio_unitario?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ textAlign: 'right', fontWeight: '600', color: '#2C3E50' }}>
                    Total: ${Array.isArray(detalle.productos) 
                      ? detalle.productos.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0)?.toLocaleString()
                      : (detalle.cantidad * detalle.precio_unitario)?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6c757d',
              textAlign: 'center'
            }}>
              <p>No hay detalles de orden disponibles</p>
            </div>
          )}
        </div>

        {/* Sección de creación de orden */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: '#2C3E50',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #dee2e6'
          }}>
            {ordenSeleccionada ? `Crear Orden #${ordenSeleccionada.numero_orden}` : 'Seleccione un detalle'}
          </h2>
          
          {ordenSeleccionada ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#6c757d'
                }}>Cliente:</label>
                <select
                  value={nuevaOrden.cliente_correo}
                  onChange={(e) => setNuevaOrden({...nuevaOrden, cliente_correo: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente._id} value={cliente.correo}>
                      {cliente.nombre} ({cliente.correo})
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#6c757d'
                }}>Estado:</label>
                <select
                  value={nuevaOrden.estado}
                  onChange={(e) => setNuevaOrden({...nuevaOrden, estado: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{
                  marginBottom: '1rem',
                  color: '#6c757d',
                  fontSize: '1.1rem'
                }}>Productos en la Orden</h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px'
                }}>
                  {nuevaOrden.detalles.map((producto, index) => (
                    <div key={index} style={{
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        <span style={{ fontWeight: '500' }}>{producto.producto_nombre}</span>
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#6c757d'
                        }}>{producto.categoria_nombre}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '0.25rem'
                      }}>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#6c757d'
                        }}>{producto.cantidad} x ${producto.precio_unitario?.toLocaleString()}</span>
                        <span style={{ fontWeight: '500' }}>
                          ${(producto.cantidad * producto.precio_unitario)?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '1rem',
                fontSize: '1.2rem',
                fontWeight: '500'
              }}>
                <span>Total:</span>
                <span style={{
                  color: '#2C3E50',
                  fontWeight: '600'
                }}>${nuevaOrden.total?.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={crearNuevaOrden}
                disabled={!nuevaOrden.cliente_correo || creandoOrden}
                style={{
                  background: '#2C3E50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  marginTop: '1.5rem',
                  opacity: !nuevaOrden.cliente_correo || creandoOrden ? '0.7' : '1'
                }}
              >
                {creandoOrden ? 'Creando Orden...' : 'Registrar Orden'}
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '1rem',
              color: '#6c757d',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', opacity: '0.5' }}>🛒</div>
              <p>Seleccione un detalle de orden para crear una nueva orden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ordenes;