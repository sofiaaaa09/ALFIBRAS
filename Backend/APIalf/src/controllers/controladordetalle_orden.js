import detalleOrdenSchema from '../models/detalle_ordenes.js';
import productoSchema from '../models/productos.js';  // Asegúrate de importar el modelo de producto
import { validatorHandler } from "../midleware/validator.handler.js";
import upload from "../config/multer.js";  
import {
  createDetalleOrdenSchema,
  getDetalleOrdenParamsSchema,
  updateDetalleOrdenSchema,
  deleteDetalleOrdenSchema,
} from "../validators/detalleOrdenValidarDTO.js";



// Crear detalle de orden con archivo
export const crearDetalleOrden = [
  upload.single("archivo"), 
  async (req, res) => {
    try {
      const { orden_id, producto_id, categoria_id, cantidad, precio_unitario, personalizacion } = req.body;

      const archivo = req.file ? `uploads/${req.file.filename}` : null;  // La ruta al archivo

      // Verificar que el producto exista
      const producto = await productoSchema.findById(producto_id);
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      const detalleOrden = new detalleOrdenSchema({
        orden_id,
        producto_id,
        categoria_id,
        cantidad,
        precio_unitario,
        personalizacion,
        archivo: req.file ? req.file.path : null, // Ruta del archivo
      });

      const detalleOrdenCreado = await detalleOrden.save();
      res.status(201).json(detalleOrdenCreado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


// Obtener todos los detalles de órdenes
export const obtenerDetallesOrden = async (req, res) => {
  try {
    const detallesOrden = await detalleOrdenSchema.find();
    res.json(detallesOrden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un detalle de orden por ID
export const obtenerDetalleOrdenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const detalleOrden = await detalleOrdenSchema.findById(id);
    if (!detalleOrden) {
      return res.status(404).json({ message: "Detalle de orden no encontrado" });
    }
    res.json(detalleOrden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consultar un detalle de orden por ID 
export const consultarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const detalleOrden = await detalleOrdenSchema.findById(id);
      if (!detalleOrden) {
        return resp.status(404).json({
          message: "Detalle de orden no encontrado",
        });
      }
      resp.json(detalleOrden);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];

// Actualizar detalle de orden
export const actualizarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { orden_id, producto_id, categoria_id, cantidad, precio_unitario, personalizacion, archivo} = req.body;

    try {
      // Verificar que el producto exista antes de actualizar
      const producto = await productoSchema.findById(producto_id);
      if (!producto) {
        return resp.status(404).json({ message: "Producto no encontrado" });
      }

      const actualizarDetalle = await detalleOrdenSchema.updateOne(
        { _id: id },
        { $set: { orden_id, producto_id, categoria_id, cantidad, precio_unitario, personalizacion, archivo} }
      );

      if (actualizarDetalle.matchedCount === 0) {
        return resp.status(404).json({ message: "Detalle de orden no encontrado" });
      }

      resp.status(200).json({ message: "Detalle de orden actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];

// Borrar detalle de orden
export const borrarDetalleOrden = [
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = await detalleOrdenSchema.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return resp.status(404).json({ message: "Detalle de orden no encontrado" });
      }
      resp.status(200).json({ message: "Detalle de orden eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
