import envioSchema from "../models/envios.js";  
import ordenSchema from "../models/ordenes.js";  
import { validatorHandler } from "../midleware/validator.handler.js";  
import {
  createEnvioSchema,
  getEnvioParamsSchema,
  updateEnvioSchema,
  deleteEnvioSchema,
} from "../validators/envioValidarDTO.js";  

// Crear envío
export const crearEnvio = [
  validatorHandler(createEnvioSchema, "body"),
  async (req, res) => {
    const envio = new envioSchema(req.body);
    try {
      // Verificar que la orden exista
      const orden = await ordenSchema.findById(envio.orden_id);
      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Crear el envío
      const envioCreado = await envio.save();
      res.status(201).json(envioCreado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todos los envíos
export const obtenerEnvios = async (req, res) => {
  try {
    const envios = await envioSchema.find();  
    res.json(envios);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un envío por ID
export const obtenerEnvioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const envio = await envioSchema.findById(id);  
    if (!envio) {
      return res.status(404).json({ message: "Envío no encontrado" });
    }
    res.json(envio);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un envío
export const actualizarEnvio = [
  validatorHandler(getEnvioParamsSchema, "params"),
  validatorHandler(updateEnvioSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { orden_id, direccion_envio, fecha_envio, estado } = req.body;

    try {
      // Verificar que la orden exista antes de actualizar el envío
      const orden = await ordenSchema.findById(orden_id);
      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // Actualizar el envío
      const actualizarEnvio = await envioSchema.updateOne(
        { _id: id },
        { $set: { orden_id, direccion_envio, fecha_envio, estado } }
      );

      if (actualizarEnvio.matchedCount === 0) {
        return res.status(404).json({ message: "Envío no encontrado" });
      }

      res.status(200).json({ message: "Envío actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar un envío
export const borrarEnvio = [
  validatorHandler(deleteEnvioSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await envioSchema.deleteOne({ _id: id });  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Envío no encontrado" });
      }
      res.status(200).json({ message: "Envío eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
