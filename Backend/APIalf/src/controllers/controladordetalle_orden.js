import { validatorHandler } from "../midleware/validator.handler.js";
import detalleOrdenSchema from "../models/detalle_ordenes.js";
import productoSchema from "../models/productos.js";
import ordenSchema from "../models/ordenes.js";
import {
  createDetalleOrdenSchema,
  getDetalleOrdenParamsSchema,
  updateDetalleOrdenSchema,
  deleteDetalleOrdenSchema,
} from "../validators/detalleOrdenValidarDTO.js";

export const crearDetalleOrden = async (req, res) => {
  try {
    const { numero_orden, productos, total } = req.body;

    // Validaciones iniciales
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ message: "El campo 'productos' debe ser un arreglo con al menos un producto." });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: "El campo 'total' debe ser un número mayor a 0." });
    }

    // Validación de estructura de cada producto
    for (const producto of productos) {
      if (!producto.numero_producto || !producto.cantidad || !producto.precio_unitario) {
        return res.status(400).json({ message: "Cada producto debe incluir 'numero_producto', 'cantidad', y 'precio_unitario'." });
      }
    }
    // Validar que los productos existan
    const productosExistentes = await productoSchema.find({
      numero_producto: { $in: productos.map((p) => p.numero_producto) },
    });

    if (productosExistentes.length !== productos.length) {
      return res.status(404).json({ message: "Uno o más productos no existen." });
    }

    // Calcular el total en el servidor
    const totalCalculado = productos.reduce(
      (suma, producto) => suma + producto.cantidad * producto.precio_unitario,
      0
    );

    if (totalCalculado !== total) {
      return res.status(400).json({
        message: "El total enviado no coincide con el cálculo del servidor.",
      });
    }

    // Generar número de orden de manera robusta
    const ultimaOrden = await ordenSchema.findOne({}, {}, { sort: { numero_orden: -1 } });
    const numero_ordenNuevo = ultimaOrden ? (parseInt(ultimaOrden.numero_orden) + 1).toString() : "1";

    // Crear el detalle de la orden
    const detalleOrden = new detalleOrdenSchema({
      numero_orden: numero_ordenNuevo,
      productos: productos.map((producto) => ({
        numero_producto: producto.numero_producto,
        producto_nombre: producto.producto_nombre,
        categoria_nombre: producto.categoria_nombre,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
      })),
      total: totalCalculado,
    });

    const detalleOrdenCreado = await detalleOrden.save();
    res.status(201).json({ message: "Detalle de orden creado exitosamente", detalleOrden: detalleOrdenCreado });
  } catch (error) {
    console.error("Error al crear detalle de orden:", error);
    res.status(500).json({ message: error.message });
  }
};


// Obtener todos los detalles de órdenes
export const obtenerDetallesOrden = async (req, res) => {
  try {
    const detallesOrden = await detalleOrdenSchema.find();
    res.json(detallesOrden); // Devuelve todos los campos del esquema
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener detalle de orden por número de orden
export const obtenerDetalleOrdenPorNumeroOrden = async (req, res) => {
  const { numero_orden } = req.params;
  try {
    const detalles = await detalleOrdenSchema.find({ numero_orden });
    if (!detalles.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron detalles para este número de orden" });
    }
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consultar un detalle de orden por ID
export const consultarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const detalleOrden = await detalleOrdenSchema.findById(id);
      if (!detalleOrden) {
        return res.status(404).json({
          message: "Detalle de orden no encontrado",
        });
      }
      res.json(detalleOrden);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
];

// Actualizar un detalle de orden
export const actualizarDetalleOrden = [
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const {
      numero_producto,
      cantidad,
      precio_unitario,
      personalizacion,
      archivo,
    } = req.body;

    try {
      // Verificar que el producto exista
      const producto = await productoSchema.findOne({ numero_producto });
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      const actualizarDetalle = await detalleOrdenSchema.findByIdAndUpdate(
        id,
        {
          numero_producto,
          producto_nombre: producto.nombre, // Actualizar nombre del producto
          categoria_nombre: producto.categoria, // Actualizar nombre de la categoría
          cantidad,
          precio_unitario,
          personalizacion,
          archivo,
        },
        { new: true }
      );

      if (!actualizarDetalle) {
        return res.status(404).json({ message: "Detalle de orden no encontrado" });
      }

      res.status(200).json(actualizarDetalle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar detalle de orden
export const borrarDetalleOrden = [
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await detalleOrdenSchema.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Detalle de orden no encontrado" });
      }
      res.status(200).json({ message: "Detalle de orden eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
