import detalleOrdenSchema from "../models/detalle_ordenes.js";
import productoSchema from "../models/productos.js";
import ordenSchema from "../models/ordenes.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { 
  createDetalleOrdenSchema, 
  getDetalleOrdenParamsSchema, 
  updateDetalleOrdenSchema, 
  deleteDetalleOrdenSchema 
} from "../validators/detalleOrdenValidarDTO.js";

export const crearDetalleOrden = [
  validatorHandler(createDetalleOrdenSchema, "body"),
  async (req, res) => {
    try {
      const { productos, total, personalizacion = "", archivo = null } = req.body;

      
      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Debe incluir al menos un producto",
          code: "PRODUCTOS_REQUERIDOS"
        });
      }

      // Validar estructura de cada producto
      const productosInvalidos = productos.filter(p => 
        !p.numero_producto || 
        !p.producto_nombre || 
        !p.categoria_nombre || 
        !p.cantidad || 
        !p.precio_unitario
      );

      if (productosInvalidos.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Algunos productos no tienen todos los campos requeridos",
          productosInvalidos,
          code: "PRODUCTOS_INVALIDOS"
        });
      }

      // Verificar existencia de productos
      const numerosProductos = productos.map(p => p.numero_producto);
      const productosExistentes = await productoSchema.find({ 
        numero_producto: { $in: numerosProductos } 
      });

      if (productosExistentes.length !== productos.length) {
        const productosNoEncontrados = numerosProductos.filter(
          np => !productosExistentes.some(pe => pe.numero_producto === np)
        );
        return res.status(404).json({
          success: false,
          message: "Algunos productos no existen",
          productosNoEncontrados,
          code: "PRODUCTOS_NO_ENCONTRADOS"
        });
      }

      // Calcular total y verificar
      const totalCalculado = productos.reduce(
        (suma, producto) => suma + (producto.cantidad * producto.precio_unitario),
        0
      );

      if (totalCalculado !== total) {
        return res.status(400).json({
          success: false,
          message: "El total no coincide con la suma de los productos",
          totalRecibido: total,
          totalCalculado: totalCalculado,
          code: "TOTAL_INCORRECTO"
        });
      }

      // Generar número de orden 
      const ultimaOrden = await ordenSchema.findOne().sort({ numero_orden: -1 });
      const numeroOrden = ultimaOrden ? 
        (parseInt(ultimaOrden.numero_orden) + 1).toString() : "1";

      // Crear detalle de orden
      const nuevoDetalle = new detalleOrdenSchema({
        numero_orden: numeroOrden,
        productos: productos.map(p => ({
          numero_producto: p.numero_producto,
          producto_nombre: p.producto_nombre,
          categoria_nombre: p.categoria_nombre,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario
        })),
        total: totalCalculado,
        personalizacion,
        archivo: archivo || null
      });

      // Guardar en base de datos
      const detalleGuardado = await nuevoDetalle.save();

      res.status(201).json({
        success: true,
        message: "Detalle de orden creado exitosamente",
        data: detalleGuardado,
        code: "DETALLE_CREADO"
      });

    } catch (error) {
      console.error("Error al crear detalle de orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
        code: "ERROR_SERVIDOR"
      });
    }
  }
];

export const obtenerDetallesOrden = async (req, res) => {
  try {
    const detalles = await detalleOrdenSchema.find();
    
    if (!detalles || detalles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron detalles de orden",
        code: "NO_ENCONTRADOS"
      });
    }

    res.json({
      success: true,
      count: detalles.length,
      data: detalles,
      code: "DETALLES_ENCONTRADOS"
    });

  } catch (error) {
    console.error("Error al obtener detalles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener detalles",
      error: error.message,
      code: "ERROR_OBTENER_DETALLES"
    });
  }
};


export const obtenerDetalleOrdenPorId = async (req, res) => {
  try {
    const detalle = await detalleOrdenSchema.findById(req.params.id);
    if (!detalle) {
      return res.status(404).json({
        success: false,
        message: "Detalle no encontrado",
        code: "DETALLE_NO_ENCONTRADO"
      });
    }
    res.json({
      success: true,
      data: detalle,
      code: "DETALLE_ENCONTRADO"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener detalle",
      error: error.message,
      code: "ERROR_OBTENER_DETALLE"
    });
  }
};



export const actualizarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  async (req, res) => {
    try {
      const { productos, total, personalizacion, archivo } = req.body;

      // Validaciones básicas
      if (productos && (!Array.isArray(productos) || productos.length === 0)) {
        return res.status(400).json({
          success: false,
          message: "Los productos deben ser un array con al menos un elemento",
          code: "PRODUCTOS_INVALIDOS"
        });
      }

      // Buscar y actualizar
      const detalleActualizado = await detalleOrdenSchema.findByIdAndUpdate(
        req.params.id,
        {
          productos,
          total,
          personalizacion,
          archivo
        },
        { new: true, runValidators: true }
      );

      if (!detalleActualizado) {
        return res.status(404).json({
          success: false,
          message: "Detalle de orden no encontrado",
          code: "DETALLE_NO_ENCONTRADO"
        });
      }

      res.json({
        success: true,
        message: "Detalle actualizado correctamente",
        data: detalleActualizado,
        code: "DETALLE_ACTUALIZADO"
      });

    } catch (error) {
      console.error("Error al actualizar detalle:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar detalle",
        error: error.message,
        code: "ERROR_ACTUALIZAR_DETALLE"
      });
    }
  }
];

export const borrarDetalleOrden = [
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  async (req, res) => {
    try {
      const detalleEliminado = await detalleOrdenSchema.findByIdAndDelete(req.params.id);

      if (!detalleEliminado) {
        return res.status(404).json({
          success: false,
          message: "Detalle de orden no encontrado",
          code: "DETALLE_NO_ENCONTRADO"
        });
      }

      res.json({
        success: true,
        message: "Detalle eliminado correctamente",
        data: detalleEliminado,
        code: "DETALLE_ELIMINADO"
      });

    } catch (error) {
      console.error("Error al eliminar detalle:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar detalle",
        error: error.message,
        code: "ERROR_ELIMINAR_DETALLE"
      });
    }
  }
];