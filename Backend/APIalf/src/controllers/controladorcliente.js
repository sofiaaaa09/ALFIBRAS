import Cliente from '../models/clientes.js';
import Orden from '../models/ordenes.js';
import { validatorHandler } from '../midleware/validator.handler.js';  

import {
  createClienteSchema,
  getClienteParamsSchema,
  updateClienteSchema,
  deleteClienteSchema,
} from "../validators/clienteValidarDTO.js";

// Crear cliente con orden inicial
export const crearCliente = [
  validatorHandler(createClienteSchema, "body"),
  async (req, res) => {
    const clienteData = req.body;

    try {
      // Crear el cliente
      const cliente = new Cliente(clienteData);
      const clienteCreado = await cliente.save();
      res.status(201).json({ cliente: clienteCreado });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find(); 
    res.json(clientes); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un cliente por ID con órdenes asociadas
export const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar cliente con nuevas órdenes si es necesario
export const actualizarCliente = [
  validatorHandler(getClienteParamsSchema, "params"),
  validatorHandler(updateClienteSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { nombre, edad, email, telefono, direccion, ordenes } = req.body;

    try {
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Actualiza los campos del cliente
      cliente.nombre = nombre || cliente.nombre;
      cliente.edad = edad || cliente.edad;
      cliente.email = email || cliente.email;
      cliente.telefono = telefono || cliente.telefono;
      cliente.direccion = direccion || cliente.direccion;

      // Si se pasa una nueva orden se agrega
      if (ordenes && Array.isArray(ordenes)) {
        cliente.ordenes.push(...ordenes);
      }

      await cliente.save();
      res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Borrar cliente y órdenes asociadas
export const borrarCliente = [
  validatorHandler(deleteClienteSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Eliminar cliente
      await cliente.deleteOne();
      res.status(200).json({ message: "Cliente  eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
