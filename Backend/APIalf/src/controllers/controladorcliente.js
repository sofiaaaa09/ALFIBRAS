import { validatorHandler } from "../midleware/validator.handler.js";
import Cliente from "../models/clientes.js";
import bcrypt from 'bcrypt';
import {
  createClienteSchema,
  deleteClienteSchema,
  getClienteParamsSchema,
  updateClienteSchema,
} from "../validators/clienteValidarDTO.js";

export const crearCliente = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion, rol } = req.body;

    console.log("\n📥 Registrando usuario:", email);
    console.log("📝 Contraseña recibida:", password);

    const existeEmail = await Cliente.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const nuevoCliente = new Cliente({
      nombre,
      email,
      password,  
      telefono,
      direccion,
      rol: rol?.toLowerCase() || 'usuario',
    });

    const clienteGuardado = await nuevoCliente.save();

    console.log("📦 Guardado en base de datos: alfibras\n");

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      cliente: {
        id: clienteGuardado._id,
        nombre: clienteGuardado.nombre,
        email: clienteGuardado.email,
        telefono: clienteGuardado.telefono,
        direccion: clienteGuardado.direccion,
        rol: clienteGuardado.rol,
      }
    });
  } catch (error) {
    console.error('🔥 Error al registrar cliente:', error.message);
    res.status(500).json({ message: 'Error al registrar el cliente', error: error.message });
  }
};



export const obtenerClientes = async (req, res) => {
  
  try {
    const clientes = await Cliente.find();
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
