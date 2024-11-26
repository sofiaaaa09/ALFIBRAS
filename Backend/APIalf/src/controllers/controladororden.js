import ordenSchema from '../models/ordenes.js';
import facturaSchema from '../models/facturas.js';  
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createOrdenSchema,
  getOrdenParamsSchema,
  updateOrdenSchema,
  deleteOrdenSchema,
} from "../validators/ordenValidarDTO.js";

// Crear orden
export const crearOrden = [
  validatorHandler(createOrdenSchema, "body"),
  async (req, res) => {
    const orden = new ordenSchema(req.body);
    try {
      const ordenCreada = await orden.save();

      // Crear una factura asociada a la orden, si es necesario
      const factura = new facturaSchema({
        orden_id: ordenCreada._id,
        fecha: new Date(),
        total: req.body.total,  
      });

      await factura.save();  
      res.status(201).json({ orden: ordenCreada, factura });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todas las ordenes
export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await ordenSchema.find();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await ordenSchema.findById(id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar orden
export const actualizarOrden = [
  validatorHandler(getOrdenParamsSchema, "params"),
  validatorHandler(updateOrdenSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { total } = req.body;

    try {
      const actualizarOrden = await ordenSchema.updateOne(
        { _id: id },
        { $set: { total } }
      );

      if (actualizarOrden.matchedCount === 0) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Actualizar la factura asociada a la orden
      const factura = await facturaSchema.findOneAndUpdate(
        { orden_id: id },
        { $set: { total } },  
        { new: true }
      );

      res.status(200).json({ message: "Orden y factura actualizadas correctamente", factura });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar orden
export const borrarOrden = [
  validatorHandler(deleteOrdenSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await ordenSchema.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Borrar la factura asociada a la orden
      await facturaSchema.deleteOne({ orden_id: id });
      res.status(200).json({ message: "Orden y factura eliminadas correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


