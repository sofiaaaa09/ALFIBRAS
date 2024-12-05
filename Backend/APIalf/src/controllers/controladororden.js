import ordenSchema from '../models/ordenes.js';  
import detalleOrdenSchema from '../models/detalle_ordenes.js'; 
import { validatorHandler } from "../midleware/validator.handler.js";  
import {
  createOrdenSchema,
  getOrdenParamsSchema,
  updateOrdenSchema,
  deleteOrdenSchema,
} from "../validators/ordenValidarDTO.js";  

export const crearOrden = async (req, res) => {
  try {
    const { cliente_correo, total, estado, fecha, detalles } = req.body;

    // Validar que detalles sea un arreglo de objetos (IDs de detalles de orden)
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ message: "Los detalles deben ser un arreglo de IDs de objetos." });
    }

    // Validar que cada ID de detalle sea válido
    for (let i = 0; i < detalles.length; i++) {
      const detalle = await detalleOrdenSchema.findById(detalles[i]);
      if (!detalle) {
        return res.status(404).json({ message: `Detalle de orden con ID ${detalles[i]} no encontrado.` });
      }
    }

    // Generar número de orden automáticamente
    const ultimaOrden = await ordenSchema.findOne().sort({ numero_orden: -1 });
    const numero_orden = ultimaOrden ? ultimaOrden.numero_orden + 1 : 1;

    // Crear la orden
    const orden = new ordenSchema({
      cliente_correo,
      estado,
      total,
      numero_orden,
      fecha: new Date(fecha),  // Convertir la fecha al tipo Date
      detalles,  // Detalles con los IDs de detalleOrden
    });

    // Guardar la orden
    const ordenCreada = await orden.save();

    // Responder con la orden y los detalles
    res.status(201).json({ orden: ordenCreada });

  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las órdenes
export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await ordenSchema.find().populate("detalles"); // Poblar los detalles
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await ordenSchema.findById(id).populate("detalles"); // Poblar los detalles
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una orden
export const actualizarOrden = async (req, res) => {
  const { id } = req.params;
  const { cliente_correo, estado, total, fecha, detalles } = req.body;

  try {
    // Validar detalles si son IDs válidos
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ message: "Los detalles deben ser un arreglo de IDs de objetos." });
    }

    // Validar que cada ID de detalle sea válido
    for (let i = 0; i < detalles.length; i++) {
      const detalle = await detalleOrdenSchema.findById(detalles[i]);
      if (!detalle) {
        return res.status(404).json({ message: `Detalle de orden con ID ${detalles[i]} no encontrado.` });
      }
    }

    const actualizarOrden = await ordenSchema.updateOne(
      { _id: id },
      { $set: { cliente_correo, estado, total, fecha, detalles } }  // Actualizar detalles también
    );

    if (actualizarOrden.matchedCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json({ message: "Orden actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una orden
export const borrarOrden = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ordenSchema.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Eliminar los detalles de la orden si es necesario
    await detalleOrdenSchema.deleteMany({ numero_orden: id });

    res.status(200).json({ message: "Orden y detalles eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
