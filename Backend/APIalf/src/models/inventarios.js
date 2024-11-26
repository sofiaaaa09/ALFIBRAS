import mongoose from 'mongoose';

const inventarioSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true,
    trim: true, // Guardamos el nombre de la categoría (no el ID)
  },
  cantidad_inicial: {
    type: Number,
    required: true,
    default: 0,
  },
  stock_min: {
    type: Number,
    required: true,
    default: 0,
  },
  stock_max: {
    type: Number,
    required: true,
    default: 0,
  },
  cantidad_disponible: {
    type: Number,
    required: true,
    default: 0, // Se actualizará dinámicamente
  },
}, { timestamps: true });

const Inventario = mongoose.model('Inventario', inventarioSchema);

export default Inventario;
