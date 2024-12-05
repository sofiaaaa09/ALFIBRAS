import mongoose from "mongoose";

// Esquema para los envíos
const envioSchema = mongoose.Schema({
  orden_id: {
    type: mongoose.Schema.Types.ObjectId,  // Relación con el modelo de ordenes
    ref: "ordenes",  // Ajusta si el nombre del modelo de órdenes es diferente
    required: true,
  },
  direccion_envio: {
    type: String,
    required: true,
    min: 10,  // Mínimo 10 caracteres para la dirección
  },
  fecha_envio: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "enviado", "entregado", "fallido"],  // Posibles estados de un envío
    required: true,
  },
});

export default mongoose.model("envio", envioSchema);