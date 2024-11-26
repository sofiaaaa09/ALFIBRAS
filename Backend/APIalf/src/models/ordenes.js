import mongoose from "mongoose";

// Esquema para las órdenes
const ordenesSchema = mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,  // Relación con el modelo de cliente (supuesto)
    ref: "clientes",  // Nombre del modelo de clientes, ajusta si es diferente
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,  // Establece la fecha actual por defecto
  },
  estado: {
    type: String,
    enum: ["pendiente", "enviado", "entregado"],  // Solo valores válidos
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,  // El total no puede ser negativo
  },
});

export default mongoose.model("ordenes", ordenesSchema);
