import inventarioSchema from '../models/inventarios.js';
import productoSchema from "../models/productos.js"; // Aún lo necesitamos para verificar si el producto existe por nombre
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createInventarioSchema,
  getInventarioParamsSchema,  
  updateInventarioSchema,
  deleteInventarioSchema,
} from "../validators/inventarioValidarDTO.js";  

// Crear inventario
export const crearInventario = [
  validatorHandler(createInventarioSchema, "body"),
  async (req, res) => {
    const { producto, stock, stock_min, stock_max } = req.body;

    try {
      // Verificar si el producto existe por nombre de la categoría
      const productoExistente = await productoSchema.findOne({ categoria: producto });
      if (!productoExistente) {
        return res.status(404).json({ message: "Producto con esta categoría no encontrado" });
      }

      // Crear el inventario
      const inventario = new inventarioSchema({ producto, stock, stock_min, stock_max });
      const inventarioCreado = await inventario.save();

      res.status(201).json(inventarioCreado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todos los inventarios
export const obtenerInventarios = async (req, res) => {
  try {
    const inventarios = await inventarioSchema.find();
    res.json(inventarios);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un inventario por ID
export const obtenerInventarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const inventario = await inventarioSchema.findById(id);
    if (!inventario) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consultar un inventario por ID
export const consultarInventario = [
  validatorHandler(getInventarioParamsSchema, "params"),  
  async (req, res) => {
    const { id } = req.params;
    try {
      const inventario = await inventarioSchema.findById(id);
      if (!inventario) {
        return res.status(404).json({
          message: "Inventario no encontrado",
        });
      }
      res.json(inventario);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
];

// Actualizar inventario
export const actualizarInventario = [
  validatorHandler(getInventarioParamsSchema, "params"),
  validatorHandler(updateInventarioSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { producto, stock, stock_min, stock_max } = req.body;

    try {
      // Verificar si el producto existe por nombre de la categoría
      const productoExistente = await productoSchema.findOne({ categoria: producto });
      if (!productoExistente) {
        return res.status(404).json({ message: "Producto con esta categoría no encontrado" });
      }

      // Actualizar inventario
      const actualizarInventario = await inventarioSchema.updateOne(
        { _id: id },
        { $set: { producto, stock, stock_min, stock_max } }
      );

      if (actualizarInventario.matchedCount === 0) {
        return res.status(404).json({ message: "Inventario no encontrado" });
      }

      res.status(200).json({ message: "Inventario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar inventario
export const borrarInventario = [
  validatorHandler(deleteInventarioSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await inventarioSchema.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Inventario no encontrado" });
      }
      res.status(200).json({ message: "Inventario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
