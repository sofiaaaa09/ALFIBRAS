import mongoose from "mongoose";

// Esquema para el carrito
const carritoSchema = mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el modelo de clientes
    ref: "usuarios",
    required: true,  
  },
  estado: {
    type: String,
    enum: ["pendiente", "procesando", "finalizado", "cancelado"], // Los posibles estados del carrito
    required: true,  // El estado es obligatorio
  },
});

export default mongoose.model("carrito", carritoSchema);
