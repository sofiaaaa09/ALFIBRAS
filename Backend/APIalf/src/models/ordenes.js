import mongoose from "mongoose";

const ordenesSchema = new mongoose.Schema({
  cliente_correo: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} no es un correo válido.`,
    },
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ["pendiente", "procesada", "completada", "enviado"],
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  numero_orden: {
    type: Number,
    required: true,
    unique: true,
  },
  detalles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DetalleOrden", // Relación con DetalleOrden
    },
  ],
});

export default mongoose.model("Orden", ordenesSchema);
