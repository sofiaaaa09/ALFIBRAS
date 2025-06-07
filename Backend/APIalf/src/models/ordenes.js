import mongoose from 'mongoose';

const ordenSchema = new mongoose.Schema({
  cliente_correo: { type: String, required: true },
  estado: { type: String, required: true },
  detalles: [{
    producto_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    producto_nombre: { type: String, required: true },
    categoria_nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio_unitario: { type: Number, required: true }
  }],
  total: { type: Number, required: true }, // Asegúrate que esté como required
  numero_orden: { type: String, required: true, unique: true },
  fecha: { type: Date, required: true }
}, { timestamps: true });
export default mongoose.model('Orden', ordenSchema);
