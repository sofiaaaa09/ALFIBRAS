import mongoose from "mongoose";

const detalleOrdenSchema = mongoose.Schema({
  numero_orden: {
    type: String, // Este será generado automáticamente
    required: true,
  },
  numero_producto: {
    type: Number, 
    required: true,
  },
  producto_nombre: {
    type: String, // Agrega este campo
    required: true,
  },
  categoria_nombre: {
    type: String, // Agrega este campo
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precio_unitario: {
    type: Number,
    required: true,
    min: 0,
  },
  personalizacion: {
    type: String,
    default: "",
  },
  archivo: {
    type: String,
    required: false,
  },
});

export default mongoose.model("DetalleOrden", detalleOrdenSchema);
