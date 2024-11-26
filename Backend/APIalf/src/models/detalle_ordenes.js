import mongoose from "mongoose";


const detalleOrdenSchema = mongoose.Schema({
  orden_id: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "ordenes",  
    required: true,
  },
  producto_id: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "productos",  
    required: true,
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "categorias",  
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
  archivo:{
    type: String,
    required: false
  }
});

export default mongoose.model("detalle_orden", detalleOrdenSchema);
