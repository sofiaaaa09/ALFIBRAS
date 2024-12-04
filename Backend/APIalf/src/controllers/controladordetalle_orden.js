import { validatorHandler } from "../midleware/validator.handler.js";
import detalleOrdenSchema from "../models/detalle_ordenes.js";
import productoSchema from "../models/productos.js";
import ordenSchema from "../models/ordenes.js";
import { createDetalleOrdenSchema,
  getDetalleOrdenParamsSchema,
   updateDetalleOrdenSchema,
    deleteDetalleOrdenSchema } from "../validators/detalleOrdenValidarDTO.js";

    export const crearDetalleOrden = async (req, res) => {
      try {
        const { numero_producto, cantidad, precio_unitario, personalizacion, archivo } = req.body;
    
        // Verificar que el número de producto y la orden existen
        const producto = await productoSchema.findOne({ numero_producto });
        if (!producto) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
    
        // Generar el número de orden automáticamente
        const ultimaOrden = await ordenSchema.findOne().sort({ numero_orden: -1 });
        const numero_orden = ultimaOrden ? ultimaOrden.numero_orden + 1 : 1;
    
        // Crear el detalle de la orden
        const detalleOrden = new detalleOrdenSchema({
          numero_orden,  // Este valor se genera automáticamente
          numero_producto,
          cantidad,
          precio_unitario,
          personalizacion,
          archivo
        });
    
        const detalleOrdenCreado = await detalleOrden.save();
        res.status(201).json(detalleOrdenCreado);
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    

// Obtener todos los detalles de órdenes
export const obtenerDetallesOrden = async (req, res) => {
  try {
    const detallesOrden = await detalleOrdenSchema.find();
    res.json(detallesOrden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener detalle de orden por número de orden
export const obtenerDetalleOrdenPorNumeroOrden = async (req, res) => {
  const { numero_orden } = req.params;
  try {
    const detalles = await detalleOrdenSchema.find({ numero_orden });
    if (!detalles.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron detalles para este número de orden" });
    }
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consultar un detalle de orden por ID
export const consultarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const detalleOrden = await detalleOrdenSchema.findById(id);
      if (!detalleOrden) {
        return res.status(404).json({
          message: "Detalle de orden no encontrado",
        });
      }
      res.json(detalleOrden);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
];

// Actualizar un detalle de orden
export const actualizarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const {
      numero_orden,
      producto_nombre,
      categoria_nombre,
      cantidad,
      precio_unitario,
      personalizacion,
    } = req.body;

    try {
      // Verificar que el número de orden exista
      const orden = await ordenSchema.findOne({ numero_orden });
      if (!orden) {
        return res.status(404).json({ message: "Número de orden no encontrado" });
      }

      // Verificar que el producto exista por su nombre
      const producto = await productoSchema.findOne({ nombre: producto_nombre });
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      const actualizarDetalle = await detalleOrdenSchema.findByIdAndUpdate(
        id,
        {
          numero_orden,
          producto_nombre,
          categoria_nombre,
          cantidad,
          precio_unitario,
          personalizacion,
        },
        { new: true }
      );

      if (!actualizarDetalle) {
        return res.status(404).json({ message: "Detalle de orden no encontrado" });
      }

      res.status(200).json(actualizarDetalle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar detalle de orden
export const borrarDetalleOrden = [
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await detalleOrdenSchema.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Detalle de orden no encontrado" });
      }
      res.status(200).json({ message: "Detalle de orden eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
