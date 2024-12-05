import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const tokenLimpio = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    const tieneRolPermitido = usuario.roles.some(rol => 
      rolesPermitidos.includes(rol)
    );

    if (!tieneRolPermitido) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    next();
  };
};