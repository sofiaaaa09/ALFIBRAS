import clientes from "../models/clientes.js";
import Carrito from "../models/carritos.js";
import {validatorHandler} from "../midleware/validator.handler.js";
import { createCarritoSchema, getCarritoParamsSchema, updateCarritoSchema, deleteCarritoSchema } from "../validators/carritoValidarDTO.js";

export const crearCarrito = [
  validatorHandler(createCarritoSchema, "body"),
  async (req, res) => {
    const carritoData = req.body;

    try {
      // Verificar que el cliente exista
      const cliente = await clientes.findById(carritoData.cliente_id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Crear el carrito
      const carrito = new Carrito(carritoData);
      const carritoCreado = await carrito.save();

      // Asociar el carrito al cliente
      if (!Array.isArray(cliente.carritos)) {
        cliente.carritos = []; // Asegurar que carritos es un array
      }
      cliente.carritos.push(carritoCreado._id);
      await cliente.save();

      res.status(201).json(carritoCreado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


// Obtener todos los carritos
export const obtenerCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find();
    res.json(carritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Obtener un carrito por ID
export const obtenerCarritoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const carrito = await Carrito.findById(id).populate("cliente_id");
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar carrito
export const actualizarCarrito = [
  validatorHandler(getCarritoParamsSchema, "params"),
  validatorHandler(updateCarritoSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { cliente_id, estado } = req.body;

    try {
      // Verificar que el cliente exista
      const cliente = await clientes.findById(cliente_id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Actualizar el carrito
      const carrito = await Carrito.updateOne({ _id: id }, { $set: { cliente_id, estado } });

      if (carrito.matchedCount === 0) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      res.status(200).json({ message: "Carrito actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar carrito
export const borrarCarrito = [
  validatorHandler(deleteCarritoSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const carrito = await Carrito.findById(id);
      if (!carrito) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      // Eliminar carrito
      await carrito.deleteOne();
      res.status(200).json({ message: "Carrito eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
