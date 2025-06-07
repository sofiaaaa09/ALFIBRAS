import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/clientes.js'; 
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Datos recibidos:", { email, password });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta para:", email);
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const roles = user.roles?.map(role => role.name) || ['usuario'];
    console.log("✅ Login correcto. Roles:", roles);

    const token = jwt.sign(
      { id: user._id, name: user.name, role: roles[0] },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    console.log("🔐 Token generado:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.error("🔥 Error en login:", error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
