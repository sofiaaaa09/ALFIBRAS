import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores.' });
  }
  next();
};

export const soloUsuario = (req, res, next) => {
  if (req.user.role !== 'usuario') {
    return res.status(403).json({ message: 'Acceso solo para usuarios normales.' });
  }
  next();
};
