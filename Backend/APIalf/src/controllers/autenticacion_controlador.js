import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../modelos/modelo_usuario.js'; // Ajusta la ruta de importación
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Extraer roles del usuario
    const roles = usuario.roles.map(rol => rol.nombre);

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        roles: roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // console.log(token); // Verificar creación del token

    res.status(200).json({ 
      token,
      usuario: {
        id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        roles: roles
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};