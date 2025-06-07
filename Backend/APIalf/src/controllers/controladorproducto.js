import productoSchema from '../models/productos.js';  
import { validatorHandler } from "../midleware/validator.handler.js";  
import {
  createProductoSchema,
  getProductoParamsSchema,
  updateProductoSchema,
  deleteProductoSchema,
} from "../validators/productoValidarDTO.js";  

export const crearProducto = [
  validatorHandler(createProductoSchema, "body"),
  async (req, res) => {
    try {

      if (req.body.numero_producto) {
        return res.status(400).json({ message: "No se debe enviar el campo numero_producto. Se asignará automáticamente." });
      }


      const ultimoProducto = await productoSchema.findOne().sort({ numero_producto: -1 });


      const numero_producto = ultimoProducto && !isNaN(ultimoProducto.numero_producto) 
        ? ultimoProducto.numero_producto + 1 
        : 1;


      const producto = new productoSchema({
        ...req.body,
        numero_producto,
      });

      const productoCreado = await producto.save();
      res.status(201).json(productoCreado);
    } catch (error) {

      console.error("Error creando producto:", error);
      res.status(500).json({ message: error.message });
    }
  },
];



// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoSchema
      .find()
      .populate("categoria", "nombre_categoria"); 
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