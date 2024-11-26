import Categoria from '../models/categorias.js';  
import { validatorHandler } from "../midleware/validator.handler.js";
import {
  createCategoriaSchema,
  getCategoriaParamsSchema,  
  updateCategoriaSchema,
  deleteCategoriaSchema,
} from "../validators/categoriaValidarDTO.js";  

export const crearCategoria = [
  validatorHandler(createCategoriaSchema, "body"),
  async (req, res) => {
    const { nombre_categoria, descripcion, estado } = req.body;

    const categoria = new Categoria({
      nombre_categoria,
      descripcion,
      estado,
    });

    try {
      const categoriaCreada = await categoria.save();
      res.status(201).json(categoriaCreada);  // Retorna el objeto recién creado
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();  
    res.json(categorias);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const consultarCategoria = [
  validatorHandler(getCategoriaParamsSchema, "params"),  
  async (req, res) => {
    const { id } = req.params;
    try {
      const categoria = await Categoria.findById(id);
      if (!categoria) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }
      res.json(categoria);  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
];

export const actualizarCategoria = [
  validatorHandler(getCategoriaParamsSchema, "params"),  
  validatorHandler(updateCategoriaSchema, "body"),  
  async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria, descripcion, estado } = req.body;

    try {
      const categoriaActualizada = await Categoria.updateOne(
        { _id: id },
        { $set: { nombre_categoria, descripcion, estado } }
      );

      if (categoriaActualizada.matchedCount === 0) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      res.status(200).json({ message: "Categoría actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const borrarCategoria = [
  validatorHandler(deleteCategoriaSchema, "params"),  
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Categoria.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];