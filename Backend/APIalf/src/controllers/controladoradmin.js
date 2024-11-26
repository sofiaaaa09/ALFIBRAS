import adminsSchema from '../models/admins.js';  
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createAdminSchema,
  getAdminParamsSchema,  
  updateAdminSchema,
  deleteAdminSchema,
} from "../validators/adminValidarDTO.js";  

// Crear admin
export const crearAdmin = [
  validatorHandler(createAdminSchema, "body"),
  async (req, res) => {
    const admin = new adminsSchema(req.body);
    await admin
      .save()
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(500).json({ message: error.message }));
  },
];

// Obtener todos los admins
export const obtenerAdmins = async (req, res) => {
  
  try {
    const admins = await adminsSchema.find();  
    res.json(admins);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un admin por ID
export const obtenerAdminPorId = [
  validatorHandler(getAdminParamsSchema, "params"), 
  async (req, res) => {
    const { id } = req.params;

    try {
      const admin = await adminsSchema.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


// Consultar un admin por ID
export const consultarAdmin = [
  validatorHandler(getAdminParamsSchema, "params"),  
  async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await adminsSchema.findById(id);
      if (!admin) {
        return res.status(404).json({
          message: "Administrador no encontrado",
        });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
];

// Actualizar admin
export const actualizarAdmin = [
  validatorHandler(getAdminParamsSchema, "params"),  
  validatorHandler(updateAdminSchema, "body"),  
  async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;

    try {
      const actualizarAdmin = await adminsSchema.updateOne(
        { _id: id },
        { $set: { nombre, email, telefono } }
      );

      if (actualizarAdmin.matchedCount === 0) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }

      res.status(200).json({ message: "Administrador actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar admin
export const borrarAdmin = [
  validatorHandler(deleteAdminSchema, "params"),  
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await adminsSchema.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }
      res.status(200).json({ message: "Administrador eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
