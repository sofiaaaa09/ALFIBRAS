const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

exports.verifyRoles = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.roles[0])) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};
