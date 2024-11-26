import facturaSchema from '../models/facturas.js';
import ordenSchema from '../models/ordenes.js';  // Asegúrate de importar el modelo de orden
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createFacturaSchema,
  getFacturaParamsSchema,
  updateFacturaSchema,
  deleteFacturaSchema,
} from "../validators/facturaValidarDTO.js";

// Crear factura
export const crearFactura = [
  validatorHandler(createFacturaSchema, "body"),
  async (req, res) => {
    const factura = new facturaSchema(req.body);
    try {
      // Verificar que la orden exista
      const orden = await ordenSchema.findById(factura.orden_id);
      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Crear la factura
      const facturaCreada = await factura.save();
      res.status(201).json(facturaCreada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await facturaSchema.find();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una factura por ID
export const obtenerFacturaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const factura = await facturaSchema.findById(id);
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }
    res.json(factura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar factura
export const actualizarFactura = [
  validatorHandler(getFacturaParamsSchema, "params"),
  validatorHandler(updateFacturaSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { orden_id, fecha, total } = req.body;

    try {
      // Verificar que la orden exista antes de actualizar la factura
      const orden = await ordenSchema.findById(orden_id);
      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Actualizar la factura
      const actualizarFactura = await facturaSchema.updateOne(
        { _id: id },
        { $set: { orden_id, fecha, total } }
      );

      if (actualizarFactura.matchedCount === 0) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      res.status(200).json({ message: "Factura actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar factura
export const borrarFactura = [
  validatorHandler(deleteFacturaSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await facturaSchema.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }
      res.status(200).json({ message: "Factura eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
