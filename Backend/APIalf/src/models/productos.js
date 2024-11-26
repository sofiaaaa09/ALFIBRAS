import mongoose from "mongoose";


const categoriasDisponibles = ["Puertas", "Techos", "Macetas", "Silleteria", "Cajeros Dom"];

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Categoria' ,
    required: true,
  },
  cantidad_inicial: {
    type: Number,
    required: true,
  },
  stock_min: {
    type: Number,
    required: true,
    min: 10, // Validación de mínimo
  },
  stock_max: {
    type: Number,
    required: true,
    max: 100, // Validación de máximo
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
