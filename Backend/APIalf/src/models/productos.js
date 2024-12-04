import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  numero_producto: {
    type: Number,
    required: true,
    unique: true, 
  },
  categoria: {
    type: String,
    required: true,
  },
  cantidad_inicial: {
    type: Number,
    required: true,
  },
  stock_min: {
    type: Number,
    required: true,
    min: 10,
  },
  stock_max: {
    type: Number,
    required: true,
    max: 100,
  },
}, {
  timestamps: true,
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
