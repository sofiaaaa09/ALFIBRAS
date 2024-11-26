import mongoose from "mongoose";


const categoriasSchema = mongoose.Schema({
    nombre_categoria: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    }
}, { timestamps: true });  

export default mongoose.model("Categoria", categoriasSchema);

