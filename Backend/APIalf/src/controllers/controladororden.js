import ordenSchema from "../models/ordenes.js";
import detalleOrdenSchema from "../models/detalle_ordenes.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createOrdenSchema,
  getOrdenParamsSchema,
  updateOrdenSchema,
  deleteOrdenSchema,
} from "../validators/ordenValidarDTO.js";

// Crear una orden
export const crearOrden = async (req, res) => {
  try {
    const { cliente_correo, total, estado, fecha, detalles } = req.body;

    // Validar los IDs de los detalles
    const detalleDocs = await detalleOrdenSchema.find({ _id: { $in: detalles } });
    if (detalleDocs.length !== detalles.length) {
      return res.status(404).json({ message: "Uno o más detalles no existen." });
    }

    // Generar número de orden automáticamente
    const ultimaOrden = await ordenSchema.findOne().sort({ numero_orden: -1 });
    const numero_orden = ultimaOrden ? ultimaOrden.numero_orden + 1 : 1;

    // Crear la orden
    const nuevaOrden = new ordenSchema({
      cliente_correo,
      estado,
      total,
      numero_orden,
      fecha: new Date(fecha),
      detalles,
    });

    const ordenCreada = await nuevaOrden.save();

    // Poblar los detalles
    const ordenConDetalles = await ordenSchema.findById(ordenCreada._id).populate("detalles");

    res.status(201).json({
      message: "Orden creada exitosamente",
      orden: ordenConDetalles,
    });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: error.message });
  }
};


export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await ordenSchema.find().populate("detalles"); // Poblar los detalles
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ message: error.message });
  }
};


export const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await ordenSchema.findById(id).populate("detalles");
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.json(orden);
  } catch (error) {
    console.error("Error al obtener la orden por ID:", error);
    res.status(500).json({ message: error.message });
  }
};


// Actualizar una orden
export const actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_correo, estado, total, fecha, detalles } = req.body;

    // Validar los detalles de orden
    const validDetalles = await Promise.all(
      detalles.map(async (detalleId) => {
        const detalle = await detalleOrdenSchema.findById(detalleId);
        if (!detalle) {
          throw new Error(`Detalle de orden con ID ${detalleId} no encontrado.`);
        }
        return detalleId;
      })
    );

    const ordenActualizada = await ordenSchema.findByIdAndUpdate(
      id,
      {
        cliente_correo,
        estado,
        total,
        fecha,
        detalles: validDetalles,
      },
      { new: true }
    );

    if (!ordenActualizada) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json({ message: "Orden actualizada correctamente", orden: ordenActualizada });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ message: error.message });
  }
};

// Borrar una orden y sus detalles
export const borrarOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const ordenEliminada = await ordenSchema.findByIdAndDelete(id);
    if (!ordenEliminada) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Opcional: Eliminar detalles asociados si no están vinculados a otras órdenes
    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ message: error.message });
  }
};
