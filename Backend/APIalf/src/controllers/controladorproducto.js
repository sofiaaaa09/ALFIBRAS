import productoSchema from '../models/productos.js';  
import { validatorHandler } from "../midleware/validator.handler.js";  
import {
  createProductoSchema,
  getProductoParamsSchema,
  updateProductoSchema,
  deleteProductoSchema,
} from "../validators/productoValidarDTO.js";  

// Crear producto
export const crearProducto = [
  validatorHandler(createProductoSchema, "body"),  
  async (req, res) => {
    const producto = new productoSchema(req.body);
    try {
      const productoCreado = await producto.save();  
      res.status(201).json(productoCreado);  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoSchema
      .find()
      .populate("categoria", "nombre_categoria"); // Mostrar detalles de la categoría
    res.json(productos);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productoSchema
      .findById(id)
      .populate("categoria", "nombre_categoria"); // Mostrar detalles de la categoría
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto
export const actualizarProducto = [
  validatorHandler(getProductoParamsSchema, "params"),  
  validatorHandler(updateProductoSchema, "body"),  
  async (req, resp) => {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      cantidad_inicial,
      stock_min,
      stock_max,
    } = req.body;

    try {
      const actualizarProducto = await productoSchema.updateOne(
        { _id: id },
        { $set: { nombre, descripcion, precio, categoria, cantidad_inicial, stock_min, stock_max } }
      );

      if (actualizarProducto.matchedCount === 0) {
        return resp.status(404).json({ message: "Producto no encontrado" });
      }

      resp.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];

// Borrar producto
export const borrarProducto = [
  validatorHandler(deleteProductoSchema, "params"),  
  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = await productoSchema.deleteOne({ _id: id });  
      if (result.deletedCount === 0) {
        return resp.status(404).json({ message: "Producto no encontrado" });
      }
      resp.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
