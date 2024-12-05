import { validatorHandler } from "../midleware/validator.handler.js";
import Cliente from "../models/clientes.js";

import {
  createClienteSchema,
  deleteClienteSchema,
  getClienteParamsSchema,
  updateClienteSchema,
} from "../validators/clienteValidarDTO.js";


export const crearCliente = [
  validatorHandler(createClienteSchema, "body"),
  async (req, res) => {
    const clienteData = { 
      ...req.body, 
      rol: "Usuario",
      password: req.body.password,
    };

    try {
      const cliente = new Cliente(clienteData);
      const clienteCreado = await cliente.save();
      res.status(201).json({ cliente: clienteCreado });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


export const obtenerClientes = async (req, res) => {
  
  try {console.log("controlador obtener cliente");
    const clientes = await Cliente.find();
    console.log("logica buscar");
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


export const actualizarCliente = [
  validatorHandler(getClienteParamsSchema, "params"),
  validatorHandler(updateClienteSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, password } = req.body;

    try {
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      cliente.nombre = nombre || cliente.nombre;
      cliente.email = email || cliente.email;
      cliente.telefono = telefono || cliente.telefono;
      cliente.direccion = direccion || cliente.direccion;
      cliente.password = password || cliente.password; 
      await cliente.save();
      res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


export const borrarCliente = [
  validatorHandler(deleteClienteSchema, "params"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      await cliente.deleteOne();
      res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
