import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Cliente from '../models/clientes.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar cliente por email
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esContrasenaValida = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!esContrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({ 
      token,
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};