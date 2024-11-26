import mongoose from "mongoose";

// Esquema para Factura
const facturaSchema = mongoose.Schema({
  orden_id: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el modelo de órdenes
    ref: "ordenes",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0, 
  },
});

export default mongoose.model("factura", facturaSchema);
