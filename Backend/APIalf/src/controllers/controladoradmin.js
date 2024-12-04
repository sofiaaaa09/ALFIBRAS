import { validatorHandler } from "../midleware/validator.handler.js";
import adminsSchema from "../models/admins.js";
import bcrypt from "bcrypt";
import {
  createAdminSchema,
  deleteAdminSchema,
  getAdminParamsSchema,
  updateAdminSchema,
} from "../validators/adminValidarDTO.js";

// Crear un nuevo administrador
export const crearAdmin = [
  validatorHandler(createAdminSchema, "body"),
  async (req, res) => {
    const { nombre, email, telefono, password } = req.body;

    try {
      // Crear un nuevo administrador con la contraseña encriptada
      const admin = new adminsSchema({ nombre, email, telefono, password });
      const adminCreado = await admin.save();

      res.status(201).json({
        message: "Administrador creado exitosamente",
        admin: { id: adminCreado._id, nombre: adminCreado.nombre, email: adminCreado.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todos los administradores
export const obtenerAdmins = async (req, res) => {
  try {
    const admins = await adminsSchema.find({}, { password: 0 }); 
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un administrador por ID
export const obtenerAdminPorId = [
  validatorHandler(getAdminParamsSchema, "params"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const admin = await adminsSchema.findById(id, { password: 0 }); 
      if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Actualizar un administrador
export const actualizarAdmin = [
  validatorHandler(getAdminParamsSchema, "params"),
  validatorHandler(updateAdminSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, password } = req.body;

    try {
      const updatedData = { nombre, email, telefono };
      if (password) {
        
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(password, salt);
      }

      const actualizarAdmin = await adminsSchema.updateOne({ _id: id }, { $set: updatedData });
      if (actualizarAdmin.matchedCount === 0) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }

      res.status(200).json({ message: "Administrador actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Eliminar un administrador
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

// Validar credenciales de administrador (Login)
export const autenticarAdmin = async (req, res) => {
  const { email, password } = req.body;

    try {
      const admin = await adminsSchema.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Comparar la contraseña ingresada con la almacenada
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json({
        message: "Autenticación exitosa",
        admin: { id: admin._id, nombre: admin.nombre, email: admin.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
