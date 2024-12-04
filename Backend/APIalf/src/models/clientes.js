import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


const clienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  telefono: {
    type: Number,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "Usuario",
    enum: ["Usuario", "Administrador"], 
  },
  password: {
    type: String,
    required: true,
  },
});


clienteSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Cliente', clienteSchema);
