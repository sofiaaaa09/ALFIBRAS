import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const tokenLimpio = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.cliente = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};