import Cliente from '../models/clientes.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); 

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("\n📩 Intento de login con:", email);

  try {
    const user = await Cliente.findOne({ email });

    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(404).json({ message: 'usuario no encontrado' });
    }

    console.log("🗃️ Contraseña en BD:", user.password);
    console.log("🔐 Contraseña ingresada:", password);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("✅ ¿Coinciden las contraseñas?", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const role = (user.rol || 'usuario').toLowerCase();
    const token = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '12h' }
    );

    console.log("🔐 Token generado:", token);

    res.status(200).json({
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: role ,
      }
    });
  } catch (error) {
    console.error("🔥 Error interno en login:", error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};