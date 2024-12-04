const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Asumimos que el usuario puede ser 'admin' o 'user'
});

// Método para encriptar la contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Método para generar el token JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
